"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    try {
      const storedSubmission = window.localStorage.getItem("suara-formal-submission");
      const storedDraft = window.localStorage.getItem("suara-formal-draft");
      setSubmission(storedSubmission ? JSON.parse(storedSubmission) : null);
      setDraft(storedDraft ? JSON.parse(storedDraft) : null);
    } catch {
      setSubmission(null);
      setDraft(null);
    }
  }, []);

  return (
    <div className="responses-page">
      <SuaraHeader active="responses" />
      <main>
        <header className="responses-hero">
          <p className="kicker">Partisipasi saya</p>
          <h1>Jejak yang tetap dapat diperiksa setelah Anda mengirim.</h1>
          <p>Lihat draf, bukti pengiriman, tanggapan lembaga, dan perubahan naskah dalam satu tempat.</p>
        </header>

        {!submission && !draft ? (
          <section className="empty-state">
            <span>Belum ada partisipasi tersimpan di peramban ini.</span>
            <h2>Mulai dari rancangan yang dekat dengan kehidupan Anda.</h2>
            <p>Masukan disimpan secara lokal pada perangkat ini untuk keperluan prototipe.</p>
            <div><Link className="button primary" href="/product?step=2">Mulai memberi masukan <span>→</span></Link><Link className="button secondary" href="/consultations">Lihat konsultasi</Link></div>
          </section>
        ) : (
          <div className="response-dashboard">
            {draft && !submission && (
              <article className="response-summary-card">
                <span className="status-chip">Draf</span>
                <h2>Rancangan Kawasan Rendah Emisi Terpadu Blok M</h2>
                <p>{draft.impact || "Draf masukan formal belum selesai."}</p>
                <Link href="/product?step=2">Lanjutkan draf →</Link>
              </article>
            )}
            {submission && (
              <>
                <article className="response-summary-card submitted">
                  <div><span className="status-chip">Terkirim</span><b>{submission.receipt}</b></div>
                  <h2>Rancangan Kawasan Rendah Emisi Terpadu Blok M</h2>
                  <p>{submission.impact}</p>
                  <dl><div><dt>Bagian terkait</dt><dd>{submission.article}</dd></div><div><dt>Dikirim</dt><dd>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString("id-ID") : "Baru saja"}</dd></div></dl>
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
                  <Link href="/product?step=6">Lihat perubahan yang sedang dibahas →</Link>
                </aside>
              </>
            )}
          </div>
        )}
      </main>
      <footer className="site-footer"><span>SUARA · Prototipe CITECH 2026</span><span>Data hanya tersimpan pada perangkat ini.</span></footer>
    </div>
  );
}
