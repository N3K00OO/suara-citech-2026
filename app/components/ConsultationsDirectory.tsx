"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SuaraHeader } from "./SuaraHeader";

const consultations = [
  {
    title: "Rancangan Kawasan Rendah Emisi Terpadu Blok M",
    institution: "Dinas Perhubungan DKI Jakarta",
    region: "Jakarta Selatan",
    category: "Transportasi",
    status: "Aktif",
    closes: "30 Agustus 2026",
    responses: "5.114",
    featured: true,
  },
  {
    title: "Tarif Angkutan Publik Terpadu",
    institution: "Dinas Perhubungan DKI Jakarta",
    region: "DKI Jakarta",
    category: "Mobilitas",
    status: "Aktif",
    closes: "18 Juni 2026",
    responses: "3.210",
  },
  {
    title: "Pengelolaan Sampah Kota",
    institution: "Dinas Lingkungan Hidup",
    region: "DKI Jakarta",
    category: "Lingkungan",
    status: "Aktif",
    closes: "25 Juni 2026",
    responses: "2.891",
  },
  {
    title: "Perlindungan Ruang Terbuka Hijau",
    institution: "Dinas Pertamanan dan Hutan Kota",
    region: "Jakarta Timur",
    category: "Tata ruang",
    status: "Dalam pertimbangan",
    closes: "7 Mei 2026",
    responses: "5.114",
  },
  {
    title: "Rencana Aksi Pengendalian Polusi Udara",
    institution: "Dinas Lingkungan Hidup",
    region: "DKI Jakarta",
    category: "Lingkungan",
    status: "Selesai",
    closes: "30 April 2026",
    responses: "7.233",
  },
  {
    title: "Penataan Koridor Pejalan Kaki Kota Tua",
    institution: "Dinas Bina Marga",
    region: "Jakarta Barat",
    category: "Akses publik",
    status: "Aktif",
    closes: "12 September 2026",
    responses: "1.842",
  },
];

export function ConsultationsDirectory() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");
  const visible = useMemo(
    () =>
      consultations.filter((item) => {
        const matchesQuery = `${item.title} ${item.institution} ${item.region}`.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "Semua" || item.status === status;
        return matchesQuery && matchesStatus;
      }),
    [query, status],
  );

  return (
    <div className="directory-page">
      <SuaraHeader active="consultations" />
      <main>
        <header className="directory-hero">
          <p className="kicker">Konsultasi kebijakan publik</p>
          <h1>Temukan rancangan yang memengaruhi kehidupan Anda.</h1>
          <p>Baca ruang perubahan, periksa dokumen, lalu sampaikan pengalaman dalam format yang dapat ditinjau.</p>
          <form role="search" onSubmit={(event) => event.preventDefault()}>
            <label>
              <span className="sr-only">Cari konsultasi</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kebijakan, wilayah, atau instansi…" />
            </label>
            <button type="submit">Cari</button>
          </form>
        </header>

        <div className="directory-toolbar">
          <span>{visible.length} konsultasi ditemukan</span>
          <div role="group" aria-label="Filter status">
            {["Semua", "Aktif", "Dalam pertimbangan", "Selesai"].map((item) => (
              <button type="button" key={item} className={status === item ? "active" : ""} onClick={() => setStatus(item)}>{item}</button>
            ))}
          </div>
        </div>

        <section className="consultation-grid" aria-label="Daftar konsultasi">
          {visible.map((item) => (
            <article className={item.featured ? "featured" : ""} key={item.title}>
              <div className="card-top"><span className={`status-chip ${item.status === "Selesai" ? "muted" : ""}`}>{item.status}</span><b>{item.category}</b></div>
              <h2>{item.title}</h2>
              <p>{item.institution}</p>
              <dl>
                <div><dt>Wilayah</dt><dd>{item.region}</dd></div>
                <div><dt>{item.status === "Selesai" ? "Ditutup" : "Berakhir"}</dt><dd>{item.closes}</dd></div>
                <div><dt>Masukan</dt><dd>{item.responses}</dd></div>
              </dl>
              <Link href="/product">Buka konsultasi <span>→</span></Link>
            </article>
          ))}
        </section>
      </main>
      <footer className="site-footer"><span>SUARA · Prototipe CITECH 2026</span><span>Seluruh konsultasi dan statistik adalah data simulasi.</span></footer>
    </div>
  );
}
