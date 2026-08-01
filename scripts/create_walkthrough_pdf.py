from __future__ import annotations

from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SCREENSHOTS = ROOT / "output" / "walkthrough" / "screenshots"
OUTPUT = ROOT / "output" / "pdf" / "SUARA-Walkthrough-Frontend-Demo.pdf"
W, H = landscape(A4)

NAVY = HexColor("#071826")
NAVY_2 = HexColor("#0d2734")
PAPER = HexColor("#f1e7d4")
INK = HexColor("#1c1511")
MUTED = HexColor("#665c52")
GOLD = HexColor("#d7a83b")
RUST = HexColor("#aa4329")
TEAL = HexColor("#3aaea1")


def register_fonts() -> None:
    fonts = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("SuaraSans", str(fonts / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("SuaraSansBold", str(fonts / "arialbd.ttf")))
    pdfmetrics.registerFont(TTFont("SuaraSerif", str(fonts / "georgia.ttf")))
    pdfmetrics.registerFont(TTFont("SuaraSerifBold", str(fonts / "georgiab.ttf")))


def image_fit(c: canvas.Canvas, path: Path, x: float, y: float, width: float, height: float) -> None:
    with Image.open(path) as img:
        iw, ih = img.size
    scale = min(width / iw, height / ih)
    draw_w, draw_h = iw * scale, ih * scale
    c.drawImage(str(path), x + (width - draw_w) / 2, y + (height - draw_h) / 2, draw_w, draw_h, mask="auto")


def image_crop(c: canvas.Canvas, path: Path, x: float, y: float, width: float, height: float) -> None:
    with Image.open(path) as img:
        iw, ih = img.size
        target = width / height
        source = iw / ih
        if source > target:
            crop_w = int(ih * target)
            left = (iw - crop_w) // 2
            img = img.crop((left, 0, left + crop_w, ih))
        else:
            crop_h = int(iw / target)
            top = (ih - crop_h) // 2
            img = img.crop((0, top, iw, top + crop_h))
        cache = ROOT / "tmp" / "pdfs" / f"crop-{path.stem}-{int(width)}-{int(height)}.png"
        cache.parent.mkdir(parents=True, exist_ok=True)
        img.save(cache)
    c.drawImage(str(cache), x, y, width, height, mask="auto")


def header(c: canvas.Canvas, page_number: int, label: str) -> None:
    c.setFillColor(NAVY)
    c.rect(0, H - 48, W, 48, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("SuaraSerifBold", 18)
    c.drawString(30, H - 31, "SUARA")
    c.setFont("SuaraSansBold", 7)
    c.drawString(112, H - 28, label.upper())
    c.setFillColor(PAPER)
    c.drawRightString(W - 30, H - 30, f"WALKTHROUGH  /  {page_number:02d}")


def footer(c: canvas.Canvas, text: str) -> None:
    c.setStrokeColor(HexColor("#cbbca5"))
    c.line(30, 24, W - 30, 24)
    c.setFillColor(MUTED)
    c.setFont("SuaraSans", 7)
    c.drawString(30, 11, text)
    c.drawRightString(W - 30, 11, "Front-end demo - data lokal per browser")


def title(c: canvas.Canvas, kicker: str, heading: str, x: float, y: float, width: float) -> float:
    c.setFillColor(RUST)
    c.setFont("SuaraSansBold", 8)
    c.drawString(x, y, kicker.upper())
    y -= 25
    c.setFillColor(INK)
    c.setFont("SuaraSerifBold", 26)
    words = heading.split()
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if c.stringWidth(candidate, "SuaraSerifBold", 26) > width and line:
            c.drawString(x, y, line)
            y -= 30
            line = word
        else:
            line = candidate
    if line:
        c.drawString(x, y, line)
        y -= 34
    return y


def bullet_list(c: canvas.Canvas, items: list[str], x: float, y: float, width: float, color=INK) -> None:
    c.setFillColor(color)
    c.setFont("SuaraSans", 10)
    for index, item in enumerate(items, 1):
        c.setFillColor(GOLD)
        c.circle(x + 5, y + 4, 5, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("SuaraSansBold", 6)
        c.drawCentredString(x + 5, y + 2, str(index))
        c.setFillColor(color)
        c.setFont("SuaraSans", 9.5)
        words = item.split()
        line = ""
        line_y = y
        for word in words:
            candidate = f"{line} {word}".strip()
            if c.stringWidth(candidate, "SuaraSans", 9.5) > width - 22 and line:
                c.drawString(x + 20, line_y, line)
                line_y -= 13
                line = word
            else:
                line = candidate
        c.drawString(x + 20, line_y, line)
        y = line_y - 22


def screenshot_page(c: canvas.Canvas, number: int, label: str, screenshot: str, kicker: str, heading: str, steps: list[str], note: str) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header(c, number, label)
    image_fit(c, SCREENSHOTS / screenshot, 30, 168, 500, 350)
    c.setStrokeColor(GOLD)
    c.rect(30, 168, 500, 350, fill=0, stroke=1)
    y = title(c, kicker, heading, 558, 500, 245)
    bullet_list(c, steps, 558, y, 245)
    c.setFillColor(NAVY_2)
    c.roundRect(558, 70, 245, 58, 5, fill=1, stroke=0)
    c.setFillColor(PAPER)
    c.setFont("SuaraSansBold", 8)
    c.drawString(572, 108, "CATATAN DEMO")
    c.setFont("SuaraSans", 8)
    text = c.beginText(572, 93)
    text.setLeading(11)
    for line in note.split("\n"):
        text.textLine(line)
    c.drawText(text)
    footer(c, f"{label} - http://localhost:4318")
    c.showPage()


def create_pdf() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUTPUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("SUARA Walkthrough Frontend Demo")
    c.setAuthor("Codex for SUARA")

    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    image_crop(c, SCREENSHOTS / "01-hero.png", 402, 0, W - 402, H)
    c.setFillColor(NAVY)
    c.rect(0, 0, 460, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("SuaraSansBold", 9)
    c.drawString(44, H - 72, "PROTOTIPE CITECH 2026")
    c.setFillColor(PAPER)
    c.setFont("SuaraSerifBold", 38)
    c.drawString(44, H - 132, "Panduan")
    c.drawString(44, H - 178, "menggunakan")
    c.drawString(44, H - 224, "SUARA")
    c.setFont("SuaraSans", 12)
    c.drawString(44, H - 264, "Walkthrough front-end, data lokal, dan alur demo.")
    c.setStrokeColor(GOLD)
    c.line(44, H - 290, 330, H - 290)
    c.setFont("SuaraSans", 9)
    c.setFillColor(HexColor("#d9cebd"))
    c.drawString(44, 74, "Mulai: http://localhost:4318/")
    c.drawString(44, 56, "Data: localStorage browser, tanpa backend")
    c.showPage()

    screenshot_page(c, 2, "Landing dan orientasi", "01-hero.png", "Langkah 01", "Mulai dari peta perjalanan kebijakan", [
        "Buka halaman utama dan baca tujuan prototipe.",
        "Gerakkan atau amati peta 3D Indonesia sebagai orientasi nasional.",
        "Pilih Mulai perjalanan untuk membaca lima tahap cerita.",
        "Pilih Buka prototipe produk untuk langsung masuk ke konsultasi.",
    ], "Animasi scroll berjalan satu kali. Saat kembali ke atas,\nanimasi yang sudah selesai tidak diputar ulang.")

    screenshot_page(c, 3, "Dampak sehari-hari", "02-impact.png", "Langkah 02", "Lihat dampak kebijakan di Blok M", [
        "Baca ringkasan kebijakan pada panel kertas di kiri.",
        "Pilih Raka, Sari, atau Ayu untuk mengganti sudut pandang.",
        "Gunakan visual 3D Blok M untuk memahami rute normal dan rute terdampak.",
        "Catat jam operasi, zona bongkar muat, dan tambahan jarak perjalanan.",
    ], "Stage 01 adalah bagian yang sebelumnya paling berbeda.\nArtwork blok-m-mobility kini menjadi mesin visual utamanya.")

    screenshot_page(c, 4, "Musyawarah", "03-deliberation.png", "Langkah 03", "Temukan titik temu tanpa menghapus perbedaan", [
        "Pilih tab Titik temu, Perbedaan, atau Suara jarang terlihat.",
        "Amati node UMKM, pekerja malam, komuter, aksesibilitas, dan instansi.",
        "Klik node pada jaringan 3D untuk menonjolkan hubungan dan isu terkait.",
        "Gunakan ringkasan 72 persen sebagai hasil sementara, bukan keputusan final.",
    ], "Artwork titik-temu menggantikan diagram datar lama dan\nmempertahankan struktur panel editorial SUARA.")

    screenshot_page(c, 5, "Masukan formal", "04-formal-input.png", "Langkah 04", "Susun pengalaman menjadi masukan yang dapat ditinjau", [
        "Buka /product?step=2 atau pilih Sampaikan dampak di sidebar.",
        "Pilih pasal, jenis perubahan, dan tulis usulan redaksi yang spesifik.",
        "Jelaskan dampak dan tandai kelompok lain yang ikut terdampak.",
        "Klik Kirim masukan untuk membuat nomor bukti penerimaan.",
    ], "Form otomatis menyimpan draf. Tampilan ini adalah referensi\nproduk yang dipakai untuk alur demo saat ini.")

    screenshot_page(c, 6, "Pertimbangan lembaga", "05-consideration.png", "Langkah 05", "Periksa alasan, bukti, keputusan, dan status", [
        "Buka tahap Lihat pertimbangan untuk mengikuti urutan pemeriksaan.",
        "Bandingkan masukan warga, bukti terverifikasi, keputusan, dan alasan lembaga.",
        "Buka Partisipasi saya untuk melihat bukti kirim dan jejak status.",
        "Gunakan Muat data contoh atau Reset data lokal pada halaman respons.",
    ], "Data contoh memperlihatkan status Terkirim, Dalam analisis,\ndan Ditanggapi tanpa API atau database.")

    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header(c, 7, "Data lokal dan pengujian")
    y = title(c, "Untuk demo front-end", "Cara data disimpan dan diuji", 40, 500, 350)
    c.setFillColor(NAVY)
    c.roundRect(40, 82, 355, 310, 7, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("SuaraSansBold", 9)
    c.drawString(60, 365, "KUNCI LOCALSTORAGE")
    c.setFillColor(PAPER)
    c.setFont("Courier", 9)
    for i, key in enumerate(["suara-formal-draft", "suara-formal-submission", "suara-participation-history"]):
        c.drawString(60, 330 - i * 33, key)
    c.setFont("SuaraSans", 9)
    c.setFillColor(HexColor("#d9cebd"))
    text = c.beginText(60, 210)
    text.setLeading(15)
    for line in [
        "Semua data hanya hidup di browser dan perangkat yang sama.",
        "Tidak ada akun, sinkronisasi, enkripsi server, atau database.",
        "Reset data lokal menghapus tiga kunci di atas.",
    ]:
        text.textLine(line)
    c.drawText(text)
    c.setFillColor(NAVY_2)
    c.roundRect(425, 82, 377, 310, 7, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("SuaraSansBold", 9)
    c.drawString(445, 365, "SELENIUM WALKTHROUGH")
    c.setFillColor(PAPER)
    c.setFont("Courier", 8.5)
    command_lines = [
        "python -m pip install -r", "  tests/requirements-walkthrough.txt", "python tests/selenium_walkthrough.py",
    ]
    for i, line in enumerate(command_lines):
        c.drawString(445, 330 - i * 18, line)
    bullet_list(c, [
        "Membuka landing page dan memeriksa judul utama.",
        "Mengisi usulan serta dampak pada langkah masukan formal.",
        "Mengirim data, memeriksa receipt, dan memvalidasi localStorage.",
        "Membuka Partisipasi saya dan memeriksa timeline.",
    ], 445, 245, 330, PAPER)
    footer(c, "Pengujian - tests/selenium_walkthrough.py")
    c.save()


if __name__ == "__main__":
    create_pdf()
