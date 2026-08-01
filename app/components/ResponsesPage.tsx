"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearSuaraLocalData,
  FORMAL_DRAFT_KEY,
  FORMAL_SUBMISSION_KEY,
  removeParticipation,
  seedDemoParticipation,
  type StoredParticipation,
} from "../demoData";
import { SuaraHeader } from "./SuaraHeader";

type Submission = {
  receipt?: string;
  submittedAt?: string;
  article?: string;
  proposal?: string;
  impact?: string;
};

export function ResponsesPage() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [draft, setDraft] = useState<Submission | null>(null);
  const [history, setHistory] = useState<StoredParticipation[]>([]);

  const refreshLocalData = () => {
    try {
      const storedSubmission = window.localStorage.getItem(FORMAL_SUBMISSION_KEY);
      const storedDraft = window.localStorage.getItem(FORMAL_DRAFT_KEY);
      setSubmission(storedSubmission ? JSON.parse(storedSubmission) : null);
      setDraft(storedDraft ? JSON.parse(storedDraft) : null);
    } catch {
      setSubmission(null);
      setDraft(null);
    }
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      refreshLocalData();
      setHistory(seedDemoParticipation());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const loadDemo = () => {
    setHistory(seedDemoParticipation(true));
    refreshLocalData();
  };

  const resetLocal = () => {
    clearSuaraLocalData();
    setHistory([]);
    setSubmission(null);
    setDraft(null);
  };

  const editSubmission = () => {
    if (!submission) return;
    window.localStorage.setItem(FORMAL_DRAFT_KEY, JSON.stringify(submission));
    window.localStorage.removeItem(FORMAL_SUBMISSION_KEY);
    window.location.href = "/product?step=2&mode=edit";
  };

  const deleteSubmission = () => {
    if (!submission?.receipt) return;
    const nextHistory = removeParticipation(submission.receipt);
    window.localStorage.removeItem(FORMAL_SUBMISSION_KEY);
    window.localStorage.removeItem(FORMAL_DRAFT_KEY);
    setSubmission(null);
    setDraft(null);
    setHistory(nextHistory);
  };

  return (
    <div className="responses-page">
      <SuaraHeader active="responses" />
      <main>
        <header className="responses-hero">
          <p className="kicker">Partisipasi saya</p>
          <h1>
            <span>Jejak yang tetap dapat diperiksa</span>
            <span>setelah Anda mengirim.</span>
          </h1>
          <p>Lihat draf, bukti pengiriman, tanggapan lembaga, dan perubahan naskah dalam satu tempat.</p>
        </header>

        <section className="demo-data-toolbar" aria-label="Kontrol data demo">
          <div>
            <b>Mode demo lokal</b>
            <span>Data disimpan hanya di peramban ini dan tidak dikirim ke server.</span>
          </div>
          <div>
            <button type="button" onClick={loadDemo}>Muat data contoh</button>
            <button type="button" className="quiet" onClick={resetLocal}>Reset data lokal</button>
          </div>
        </section>

        {!submission && !draft && history.length === 0 ? (
          <section className="empty-state">
            <span>Belum ada partisipasi tersimpan di peramban ini.</span>
            <h2>Mulai dari rancangan yang dekat dengan kehidupan Anda.</h2>
            <p>Masukan disimpan secara lokal pada perangkat ini untuk keperluan prototipe.</p>
            <div><Link className="button primary" href="/product?step=2">Mulai memberi masukan <span>-&gt;</span></Link><Link className="button secondary" href="/consultations">Lihat konsultasi</Link></div>
          </section>
        ) : null}

        {(submission || draft) && (
          <div className="response-dashboard">
            {draft && !submission && (
              <article className="response-summary-card">
                <span className="status-chip">Draf</span>
                <h2>Rancangan Kawasan Rendah Emisi Terpadu Blok M</h2>
                <p>{draft.impact || "Draf masukan formal belum selesai."}</p>
                <Link href="/product?step=2">Lanjutkan draf -&gt;</Link>
              </article>
            )}
            {submission && (
              <>
                <article className="response-summary-card submitted">
                  <div><span className="status-chip">Terkirim</span><b>{submission.receipt}</b></div>
                  <h2>Rancangan Kawasan Rendah Emisi Terpadu Blok M</h2>
                  <p>{submission.impact}</p>
                  <dl><div><dt>Bagian terkait</dt><dd>{submission.article}</dd></div><div><dt>Dikirim</dt><dd>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString("id-ID") : "Baru saja"}</dd></div></dl>
                  <div className="response-crud-actions" aria-label="Kelola masukan">
                    <button type="button" onClick={editSubmission}>Edit masukan</button>
                    <button type="button" className="danger" onClick={deleteSubmission}>Hapus masukan</button>
                  </div>
                </article>

                <section className="tracking-timeline" aria-labelledby="tracking-title">
                  <h2 id="tracking-title">Jejak pertimbangan</h2>
                  {[
                    ["Masukan terkirim", "Sistem menerbitkan bukti penerimaan.", "complete"],
                    ["Pemeriksaan kelengkapan", "Bagian naskah dan bukti berhasil dihubungkan.", "complete"],
                    ["Analisis isu", "Masukan dikelompokkan bersama isu akses dan pekerja shift.", "active"],
                    ["Tanggapan lembaga", "Alasan keputusan akan diterbitkan di halaman ini.", ""],
                    ["Perubahan naskah", "Versi sebelum dan sesudah dapat dibandingkan.", ""],
                  ].map((item, index) => (
                    <article key={item[0]} className={item[2]}>
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      <div><h3>{item[0]}</h3><p>{item[1]}</p></div>
                      <span>{item[2] === "complete" ? "Selesai" : item[2] === "active" ? "Berjalan" : "Menunggu"}</span>
                    </article>
                  ))}
                </section>

                <aside className="what-changed">
                  <span>Isu terkait</span>
                  <h2>Akses perlu melekat pada pengguna, bukan kendaraan.</h2>
                  <p>Masukan Anda ikut terbaca bersama 96 tanggapan lain mengenai akses pendamping dan ketersediaan fasilitas.</p>
                  <Link href="/product?step=6">Lihat perubahan yang sedang dibahas -&gt;</Link>
                </aside>
              </>
            )}
          </div>
        )}

        {history.length > 0 && (
          <section className="demo-history" aria-labelledby="history-title">
            <div className="demo-history-heading">
              <div><span>Data contoh</span><h2 id="history-title">Riwayat partisipasi</h2></div>
              <p>Tiga contoh memperlihatkan status yang berbeda tanpa memerlukan backend.</p>
            </div>
            <div className="demo-history-grid">
              {history.map((item) => (
                <article key={item.receipt}>
                  <div><span className={`demo-status ${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span><small>{item.article}</small></div>
                  <h3>{item.title}</h3>
                  <p>{item.impact}</p>
                  <footer><code>{item.receipt}</code><time>{new Date(item.submittedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</time></footer>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="site-footer"><span>SUARA - Prototipe CITECH 2026</span><span>Data hanya tersimpan pada perangkat ini.</span></footer>
    </div>
  );
}
