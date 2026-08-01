"""End-to-end walkthrough for the SUARA front-end demo.

Run while the preview is available:
  python -m pip install -r tests/requirements-walkthrough.txt
  python tests/selenium_walkthrough.py

Optional environment variables:
  SUARA_BASE_URL=http://localhost:4318
  SUARA_HEADLESS=0
"""

from __future__ import annotations

import base64
import json
import os
import time
import unittest
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("SUARA_BASE_URL", "http://localhost:4318").rstrip("/")
OUTPUT_DIR = Path(__file__).resolve().parents[1] / "output" / "walkthrough" / "selenium"
VIDEO_PATH = OUTPUT_DIR / "suara-selenium-walkthrough.webm"
VIDEO_FPS = 8
VIDEO_ENABLED = os.getenv("SUARA_RECORD", "1") != "0"


class SuaraWalkthrough(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        options = webdriver.ChromeOptions()
        if os.getenv("SUARA_HEADLESS", "1") != "0":
            options.add_argument("--headless=new")
        options.add_argument("--window-size=1600,1000")
        options.add_argument("--disable-gpu")
        cls.driver = webdriver.Chrome(options=options)
        cls.driver.set_script_timeout(90)
        cls.wait = WebDriverWait(cls.driver, 15)
        cls.video_frames: list[str] = []

    @classmethod
    def tearDownClass(cls) -> None:
        if cls.video_frames:
            payload = cls.driver.execute_async_script(
                """
                const frames = arguments[0];
                const fps = arguments[1];
                const done = arguments[arguments.length - 1];
                const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                  ? 'video/webm;codecs=vp9'
                  : 'video/webm';
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', { alpha: false });
                const stream = canvas.captureStream(fps);
                const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4500000 });
                const chunks = [];
                recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
                recorder.onerror = event => done({ error: String(event.error || event) });
                recorder.onstop = async () => {
                  const bytes = new Uint8Array(await new Blob(chunks, { type: mime }).arrayBuffer());
                  let binary = '';
                  const block = 0x8000;
                  for (let offset = 0; offset < bytes.length; offset += block) {
                    binary += String.fromCharCode(...bytes.subarray(offset, offset + block));
                  }
                  done({ mime, data: btoa(binary) });
                };
                recorder.start();
                let index = 0;
                const draw = () => {
                  const image = new Image();
                  image.onload = () => {
                    if (!canvas.width) {
                      canvas.width = image.naturalWidth;
                      canvas.height = image.naturalHeight;
                    }
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    index += 1;
                    if (index < frames.length) setTimeout(draw, 1000 / fps);
                    else setTimeout(() => recorder.stop(), 250);
                  };
                  image.onerror = () => done({ error: 'Could not decode a Selenium frame.' });
                  image.src = 'data:image/png;base64,' + frames[index];
                };
                draw();
                """,
                cls.video_frames,
                VIDEO_FPS,
            )
            if payload.get("error"):
                raise RuntimeError(payload["error"])
            VIDEO_PATH.write_bytes(base64.b64decode(payload["data"]))
        cls.driver.quit()

    def shot(self, name: str) -> None:
        self.driver.save_screenshot(str(OUTPUT_DIR / name))

    def record_hold(self, seconds: float = 1.0) -> None:
        """Add a readable hold of the current Selenium viewport to the WebM."""
        if not VIDEO_ENABLED:
            return
        frame = self.driver.get_screenshot_as_base64()
        self.video_frames.extend([frame] * max(1, round(seconds * VIDEO_FPS)))

    def phase(self, label: str, detail: str, seconds: float = 1.25) -> None:
        """Show a Selenium-only chapter card so the recorded CRUD flow is obvious."""
        self.driver.execute_script(
            """
            document.getElementById('selenium-walkthrough-label')?.remove();
            const card = document.createElement('div');
            card.id = 'selenium-walkthrough-label';
            card.style.cssText = `position:fixed;z-index:2147483647;left:28px;bottom:28px;
              max-width:440px;padding:16px 20px;border:1px solid #d7a643;background:#071724ee;
              box-shadow:0 14px 40px #0008;color:#f6ecd9;font:600 15px/1.35 Arial,sans-serif;
              letter-spacing:.02em;pointer-events:none`;
            card.innerHTML = `<b style="display:block;margin-bottom:5px;color:#e7b64c;
              font-size:12px;letter-spacing:.14em;text-transform:uppercase"></b><span></span>`;
            card.querySelector('b').textContent = arguments[0];
            card.querySelector('span').textContent = arguments[1];
            document.body.appendChild(card);
            """,
            label,
            detail,
        )
        self.record_hold(seconds)
        time.sleep(min(seconds, 1.0))

    def visit(self, path: str, label: str, detail: str, screenshot: str) -> None:
        self.driver.get(f"{BASE_URL}{path}")
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "main")))
        self.phase(label, detail)
        self.shot(screenshot)

    def test_all_pages_and_complete_crud_walkthrough(self) -> None:
        driver = self.driver

        driver.get(f"{BASE_URL}/")
        self.wait.until(EC.visibility_of_element_located((By.TAG_NAME, "h1")))
        driver.execute_script("localStorage.clear();")
        self.assertIn("kebijakan", driver.find_element(By.TAG_NAME, "h1").text.lower())
        self.phase("PAGE 1 / HOME", "Beranda dan pengantar perjalanan kebijakan.")
        self.shot("01-home.png")

        self.visit(
            "/consultations",
            "PAGE 2 / KONSULTASI",
            "Direktori seluruh konsultasi publik yang tersedia.",
            "02-consultations.png",
        )

        product_details = [
            (0, "Pahami", "Ringkasan kebijakan dan ruang lingkup konsultasi."),
            (1, "Periksa naskah", "Baca pasal, bahasa resmi, dan penjelasan sederhananya."),
            (2, "Sampaikan dampak", "Formulir masukan formal dan bukti pengalaman."),
            (3, "Suara warga", "Tanggapan warga yang tersusun dan dapat dibandingkan."),
            (4, "Bermusyawarah", "Peta isu, perbedaan, dan titik temu."),
            (5, "Lihat pertimbangan", "Bukti, keputusan, dan alasan lembaga."),
            (6, "Telusuri perubahan", "Bandingkan naskah sebelum dan sesudah konsultasi."),
        ]
        for index, title, description in product_details:
            self.visit(
                f"/product?step={index}",
                f"PRODUCT {index + 1} / 7 · {title}",
                description,
                f"{index + 3:02d}-product-step-{index + 1}.png",
            )

        driver.get(f"{BASE_URL}/product?step=2")
        proposal = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//label[contains(., 'Usulan redaksi perubahan')]/textarea"))
        )
        impact = driver.find_element(By.XPATH, "//label[contains(., 'Jelaskan dampak secara ringkas')]/textarea")
        proposal.clear()
        proposal.send_keys("Tambahkan audit lift bulanan dan kanal pelaporan publik dengan tenggat perbaikan.")
        impact.clear()
        impact.send_keys("Lift yang tidak berfungsi menambah waktu perjalanan dan membuat pengguna kehilangan akses.")
        self.phase("CRUD · CREATE", "Isi usulan dan dampak, lalu kirim sebagai catatan baru.")
        self.shot("10-crud-create-form.png")

        submit = driver.find_element(By.XPATH, "//button[contains(., 'Kirim masukan')]")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit)
        driver.execute_script("arguments[0].click();", submit)
        receipt = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".receipt b"))).text
        self.assertTrue(receipt.startswith("SUA-2026-"))
        self.phase("CREATE COMPLETE", f"Bukti penerimaan dibuat: {receipt}")
        self.shot("11-crud-create-receipt.png")

        stored = driver.execute_script(
            "return {submission: localStorage.getItem('suara-formal-submission'), "
            "history: localStorage.getItem('suara-participation-history')};"
        )
        self.assertEqual(json.loads(stored["submission"])["receipt"], receipt)
        self.assertGreaterEqual(len(json.loads(stored["history"])), 4)

        driver.get(f"{BASE_URL}/responses")
        self.wait.until(EC.visibility_of_element_located((By.ID, "tracking-title")))
        self.assertIn(receipt, driver.page_source)
        self.assertIn("Riwayat partisipasi", driver.page_source)
        self.phase("CRUD · READ", "Buka Partisipasi saya untuk membaca catatan dan statusnya.")
        self.shot("12-crud-read.png")

        edit_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Edit masukan')]")))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_button)
        driver.execute_script("arguments[0].click();", edit_button)
        proposal = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//label[contains(., 'Usulan redaksi perubahan')]/textarea"))
        )
        impact = driver.find_element(By.XPATH, "//label[contains(., 'Jelaskan dampak secara ringkas')]/textarea")
        proposal.clear()
        proposal.send_keys("Tambahkan audit lift mingguan, dasbor publik, dan tenggat perbaikan maksimum 24 jam.")
        impact.clear()
        impact.send_keys("Pembaruan ini memastikan gangguan akses cepat ditemukan, diumumkan, dan diperbaiki.")
        self.phase("CRUD · UPDATE", "Edit catatan yang sama; nomor bukti tetap dipertahankan.")
        self.shot("13-crud-update-form.png")
        submit = driver.find_element(By.XPATH, "//button[contains(., 'Kirim masukan')]")
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'}); arguments[0].click();", submit)
        updated_receipt = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".receipt b"))).text
        self.assertEqual(updated_receipt, receipt)
        self.phase("UPDATE COMPLETE", f"Catatan {receipt} berhasil diperbarui.")
        self.shot("14-crud-update-receipt.png")

        driver.get(f"{BASE_URL}/responses")
        self.wait.until(EC.visibility_of_element_located((By.ID, "tracking-title")))
        self.assertIn("Pembaruan ini memastikan", driver.page_source)
        self.phase("CRUD · READ UPDATED", "Baca kembali hasil pembaruan pada halaman partisipasi.")
        self.shot("15-crud-read-updated.png")

        delete_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Hapus masukan')]")))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", delete_button)
        self.phase("CRUD · DELETE", "Hapus catatan utama dari penyimpanan lokal perangkat ini.")
        driver.execute_script("arguments[0].click();", delete_button)
        self.wait.until(EC.invisibility_of_element_located((By.XPATH, f"//*[contains(., '{receipt}')]")))
        self.assertNotIn(receipt, driver.page_source)
        self.phase("DELETE COMPLETE", "Catatan utama sudah dihapus; data demo lain tetap tersedia.")
        self.shot("16-crud-delete-complete.png")

        reset = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Reset data lokal')]")))
        driver.execute_script("arguments[0].click();", reset)
        self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".empty-state")))
        self.phase("WALKTHROUGH COMPLETE", "Semua halaman dan operasi Create, Read, Update, Delete sudah ditampilkan.", 2.0)
        self.shot("17-empty-local-state.png")


if __name__ == "__main__":
    unittest.main(verbosity=2)
