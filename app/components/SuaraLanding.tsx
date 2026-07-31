"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IndonesiaMap } from "./IndonesiaMap";
import { DeliberationMap3D } from "./DeliberationMap3D";
import { SuaraHeader } from "./SuaraHeader";

const residents = [
  {
    name: "Raka",
    role: "Pekerja malam",
    quote: "Jam akses berubah begini membuat pulang kerja, bongkar muat, dan mobilitas kami langsung kacau.",
    fact: "Pulang pukul 23.40 · layanan terakhir 22.30",
  },
  {
    name: "Sari",
    role: "Penjual UMKM",
    quote: "Saya mendukung udara yang lebih bersih, tetapi jendela bongkar muat harus mengikuti ritme pasar.",
    fact: "Pasokan tiba 05.15 · akses baru dimulai 06.00",
  },
  {
    name: "Ayu",
    role: "Advokat akses",
    quote: "Rute alternatif bukan akses bila lift, guiding block, dan titik turunnya tidak ikut diperiksa.",
    fact: "Tambahan 430 m · satu lift belum berfungsi",
  },
];

const assemblyViews = {
  common: {
    label: "Titik temu",
    headline: "Masa transisi yang dapat dievaluasi",
    copy: "Pekerja, pelaku usaha, komuter, dan kelompok akses sama-sama meminta tahapan yang jelas serta evaluasi berkala.",
    value: "72%",
  },
  difference: {
    label: "Perbedaan",
    headline: "Jam operasional menjadi titik beda",
    copy: "Komuter menekankan koneksi antarmoda; pekerja malam dan pedagang menekankan akses sebelum dan setelah jam layanan.",
    value: "4 sudut",
  },
  minority: {
    label: "Suara jarang terlihat",
    headline: "Akses titik turun tetap harus masuk",
    copy: "Jumlah masukannya kecil, tetapi konsekuensinya besar bagi pengguna mobilitas terbatas dan pendamping.",
    value: "96 suara",
  },
} as const;

type AssemblyView = keyof typeof assemblyViews;

export function SuaraLanding() {
  const [resident, setResident] = useState(0);
  const [position, setPosition] = useState("ubah");
  const [change, setChange] = useState("Tambah masa transisi");
  const [assembly, setAssembly] = useState<AssemblyView>("common");
  const [revision, setRevision] = useState(58);
  const activeResident = residents[resident];
  const activeAssembly = assemblyViews[assembly];

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "-8% 0px -12% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="suara-site">
      <SuaraHeader active="home" />

      <main>
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="landing-hero-copy">
              <p className="kicker">Satu kebijakan. Banyak kehidupan.</p>
              <h1 id="hero-title">Ikuti satu suara sampai kebijakan berubah.</h1>
              <p className="lead">
                Lihat bagaimana pengalaman sehari-hari menjadi masukan formal,
                dipertimbangkan, lalu dapat ditelusuri hingga keputusan dan revisi naskah.
              </p>
              <div className="button-row">
                <a className="button primary" href="#perjalanan">Mulai perjalanan <span>→</span></a>
                <Link className="button secondary" href="/product">Buka prototipe produk</Link>
              </div>
              <div className="hero-proof" aria-label="Ringkasan prototipe">
                <span><b>214.532</b> warga berpartisipasi</span>
                <span><b>38</b> kebijakan dipetakan</span>
                <span><b>7</b> tahap yang dapat dilacak</span>
              </div>
            </div>

            <div className="hero-map" aria-label="Peta 3D Nusantara">
              <IndonesiaMap />
              <div className="map-quote">
                <span>“</span>
                <strong>Satu kebijakan.<br />Banyak kehidupan.</strong>
              </div>
              <div className="map-legend" aria-hidden="true">
                <i></i> Masukan warga
                <i></i> Pertimbangan
                <i></i> Perubahan
              </div>
            </div>
          </div>

          <ol className="journey-strip" aria-label="Tahapan perjalanan satu suara">
            <li className="journey-label">Jejak satu suara</li>
            {["Dampak", "Masukan", "Musyawarah", "Pertimbangan", "Perubahan"].map((item, index) => (
              <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>
            ))}
          </ol>
        </section>

        <section id="perjalanan" className="story-section impact-section" aria-labelledby="impact-title" data-reveal>
          <div className="paper-card impact-card">
            <p className="kicker rust">01 · Dampak sehari-hari</p>
            <h2 id="impact-title">Sebuah kebijakan akan mengubah cara kawasan ini bergerak.</h2>
            <p>
              Perubahan akses transportasi, aturan zona, dan pola pergerakan akan berdampak
              berbeda bagi warga yang tinggal dan bekerja di kawasan ini setiap harinya.
            </p>
            <p className="microcopy">Pilih satu pengalaman untuk melihat dampaknya.</p>
            <div className="resident-tabs" role="tablist" aria-label="Warga terdampak">
              {residents.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={resident === index}
                  className={resident === index ? "active" : ""}
                  onClick={() => setResident(index)}
                >
                  <strong>{item.name}</strong><span>{item.role}</span>
                </button>
              ))}
            </div>
            <blockquote>“{activeResident.quote}”</blockquote>
            <p className="resident-fact">{activeResident.fact}</p>
          </div>
          <UrbanPolicyTwin activeResident={resident} />
          <ChapterFooter number="01" label="Dampak sehari-hari" progress="01 / 05" />
        </section>

        <section className="story-section formal-story" aria-labelledby="formal-title" data-reveal>
          <FormalEvidenceWall />
          <div className="evidence-board" aria-label="Pratinjau masukan formal">
            <div className="evidence-heading">
              <span>Catatan pengalaman · Blok M</span>
              <b>Bukti membuat dampak dapat diperiksa.</b>
            </div>
            <div className="evidence-canvas">
              <div className="route-card">
                <span>Rute biasa</span>
                <strong>820 m</strong>
                <i className="route-line"></i>
                <small>Halte ASEAN → Pasar Melawai</small>
              </div>
              <div className="route-card changed">
                <span>Setelah perubahan</span>
                <strong>1,25 km</strong>
                <i className="route-line"></i>
                <small>Lift mati · satu putaran tambahan</small>
              </div>
              <div className="evidence-note">
                <span>Catatan lapangan</span>
                <p>“Titik turun berpindah, akses jadi lebih jauh, dan jadwal terakhir tidak cocok dengan shift.”</p>
                <div><b>Foto lokasi</b><b>Struk perjalanan</b><b>Peta rute</b></div>
              </div>
            </div>
          </div>
          <div className="paper-card formal-card">
            <p className="kicker rust">02 · Dari pengalaman menjadi bukti</p>
            <h2 id="formal-title">Pengalaman menjadi masukan ketika dampaknya dapat dijelaskan.</h2>
            <p>Warga menghubungkan konteks, dampak, risiko, dan usulan perubahan—bukan sekadar komentar singkat.</p>
            <fieldset className="compact-fieldset">
              <legend>Apa yang sebaiknya dilakukan?</legend>
              {[
                ["terima", "Terima"],
                ["ubah", "Ubah"],
                ["tinjau", "Tinjau kembali"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="position-preview"
                    checked={position === value}
                    onChange={() => setPosition(value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <div className="change-choice">
              <span>Perubahan yang dibutuhkan</span>
              {["Tambah masa transisi", "Atur pengecualian", "Perbaiki akses"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={change === item ? "selected" : ""}
                  onClick={() => setChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="recorded-stamp">Masukan tercatat</div>
          </div>
          <ChapterFooter number="02" label="Masukan formal" progress="02 / 05" />
        </section>

        <section className="story-section assembly-section" aria-labelledby="assembly-title" data-reveal>
          <div className="paper-card assembly-copy">
            <p className="kicker rust">03 · Ruang musyawarah</p>
            <h2 id="assembly-title">Bukan mencari suara paling keras.</h2>
            <p>
              Perbedaan dibuat terbaca. Pengalaman yang jarang muncul tetap terlihat.
              Titik temu tidak tenggelam oleh jumlah balasan.
            </p>
            <div className="assembly-controls">
              {(Object.keys(assemblyViews) as AssemblyView[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={assembly === key ? "active" : ""}
                  onClick={() => setAssembly(key)}
                >
                  {assemblyViews[key].label}
                </button>
              ))}
            </div>
            <article className="assembly-copy-result" aria-live="polite">
              <strong>{activeAssembly.value} lintas kelompok</strong>
              <p>{activeAssembly.copy}</p>
            </article>
          </div>
          <div className="assembly-visual">
            <DeliberationMap3D activeView={assembly} />
            <svg className="assembly-links" viewBox="0 0 700 660" aria-hidden="true">
              <path className="consensus-link one" d="M350 330 C250 185 170 180 118 128" />
              <path className="consensus-link two" d="M350 330 C440 176 520 184 586 132" />
              <path className="consensus-link three" d="M350 330 C510 310 564 332 630 332" />
              <path className="difference-link" d="M350 330 C468 450 526 486 584 548" />
              <path className="minority-link" d="M350 330 C245 468 180 500 116 548" />
              <path className="minority-link" d="M350 330 C190 324 142 336 82 332" />
            </svg>
            <div className="roundtable" aria-hidden="true">
              {[
                ["▦", "UMKM"],
                ["◐", "Pekerja malam"],
                ["▣", "Komuter"],
                ["♿", "Aksesibilitas"],
                ["●", "Warga"],
                ["◆", "Instansi"],
              ].map(([icon, group], index) => (
                <span key={group} style={{ "--seat": index } as React.CSSProperties}>
                  <i>{icon}</i><b>{group}</b>
                </span>
              ))}
              <strong><small>Titik temu</small>{activeAssembly.value}<em>lintas kelompok</em></strong>
            </div>
            <div className="assembly-callouts" aria-hidden="true">
              <span className="callout-access"><small>Jam akses</small><b>05.00 – 22.00</b><em>Kecuali bus & layanan</em></span>
              <span className="callout-route"><small>Rute normal</small><b>820 m</b><em>±12 menit</em></span>
              <span className="callout-policy"><small>Pasal 4.2</small><b>Mobilitas esensial</b><em>dengan dampak terkendali</em></span>
              <span className="callout-economy"><small>Dampak ekonomi</small><b>−23%</b><em>Pendapatan harian</em></span>
              <span className="callout-pattern"><small>Pola pergerakan</small><b>21.00 – 23.00</b><em>Puncak malam</em></span>
              <span className="callout-zone"><small>Aturan zona</small><b>05.00 – 22.00</b><em>Zona bongkar muat</em></span>
              <span className="callout-review"><small>Evaluasi berkala</small><b>Setiap 3 bulan</b><em>indikator terukur</em></span>
            </div>
            <aside className="assembly-evidence-rail" aria-label="Bukti dan temuan musyawarah">
              <header><b>Bukti &amp; temuan</b><span>4</span></header>
              <article><i>01</i><small>Konsensus</small><b>72% lintas kelompok</b><p>Dukung transisi lebih panjang dengan evaluasi berkala.</p></article>
              <article><i>02</i><small>Perbedaan</small><b>Jam mulai pembatasan</b><p>Usulan 05.00 dan 06.00 masih berbeda.</p></article>
              <article><i>03</i><small>Suara jarang</small><b>Akses pejalan kaki</b><p>Dampaknya tinggi bagi kelompok rentan.</p></article>
              <article><i>04</i><small>Data rute</small><b>Rute terdampak utama</b><p>1,25 km dengan tambahan ±30 menit.</p></article>
              <div className="assembly-mini-map"><b>Peta musyawarah</b><span></span></div>
            </aside>
            <div className="assembly-legend" aria-hidden="true">
              <span><i></i>Titik temu</span><span><i></i>Perbedaan</span><span><i></i>Suara jarang terlihat</span>
            </div>
          </div>
          <ChapterFooter number="03" label="Musyawarah" progress="03 / 05" />
        </section>

        <section className="story-section decision-section" aria-labelledby="decision-title" data-reveal>
          <ConsiderationStoryboard />
          <div className="decision-quote">
            <span>Catatan pertimbangan</span>
            <blockquote>“Kepercayaan muncul ketika alasan dapat diperiksa—termasuk ketika usulan ditolak.”</blockquote>
          </div>
          <div className="paper-card decision-ledger">
            <p className="kicker rust">04 · Pertimbangan lembaga</p>
            <h2 id="decision-title">Keputusan harus disertai alasan yang dapat diperiksa.</h2>
            <div className="ledger-row"><b>Masukan warga</b><span>Masa transisi lebih panjang bagi usaha kecil dan pekerja shift.</span></div>
            <div className="ledger-row"><b>Bukti diperiksa</b><span>Data jam layanan, 42 tanggapan, dan tiga audit perjalanan.</span></div>
            <div className="ledger-row"><b>Keputusan</b><span className="status accepted">Diterima sebagian</span></div>
            <div className="ledger-row"><b>Alasan lembaga</b><span>Tahapan diperlukan hingga akses alternatif dan dukungan logistik tersedia.</span></div>
          </div>
          <ChapterFooter number="04" label="Pertimbangan lembaga" progress="04 / 05" />
        </section>

        <section className="story-section revision-section" aria-labelledby="revision-title" data-reveal>
          <RevisionStoryboard />
          <div className="revision-heading">
            <p className="kicker">05 · Jejak perubahan</p>
            <h2 id="revision-title">Masukan tidak berakhir saat dikirim.</h2>
            <p>Bandingkan teks awal dengan naskah setelah pertimbangan dan lihat alasan di balik setiap perubahan.</p>
          </div>
          <div className="revision-compare" style={{ "--after": `${revision}%` } as React.CSSProperties}>
            <article className="before">
              <span>Sebelum konsultasi</span>
              <h3>Pasal 12</h3>
              <p>Izin akses khusus diberikan kepada kendaraan yang memenuhi kriteria verifikasi.</p>
            </article>
            <article className="after">
              <span>Setelah pertimbangan</span>
              <h3>Pasal 12</h3>
              <p>Izin akses diberikan kepada pengguna yang terverifikasi dan dapat digunakan pada kendaraan pendamping terdaftar.</p>
            </article>
            <i className="compare-handle" aria-hidden="true"></i>
          </div>
          <label className="revision-slider">
            Geser untuk membandingkan versi
            <input
              type="range"
              min="20"
              max="80"
              value={revision}
              onChange={(event) => setRevision(Number(event.target.value))}
            />
          </label>
          <ChapterFooter number="05" label="Perubahan naskah" progress="05 / 05" />
        </section>

        <section className="handoff-section" aria-labelledby="handoff-title" data-reveal>
          <div>
            <p className="kicker rust">Pengantar selesai</p>
            <h2 id="handoff-title">Pahami rancangan.<br />Berikan masukan.<br />Periksa apa yang berubah.</h2>
            <p>Selanjutnya, antarmuka kembali tenang dan familiar agar Anda dapat membaca dokumen, mengisi tanggapan, dan menelusuri keputusan.</p>
            <Link className="button primary" href="/product">Buka konsultasi lengkap <span>→</span></Link>
          </div>
          <nav aria-label="Isi produk konsultasi">
            {["Ringkasan", "Naskah", "Masukan formal", "Suara warga", "Musyawarah", "Tanggapan lembaga", "Jejak perubahan"].map((item, index) => (
              <Link key={item} href={`/product?step=${index}`}>{item}<span>↗</span></Link>
            ))}
          </nav>
        </section>
      </main>

      <footer className="site-footer">
        <span>SUARA · Prototipe CITECH 2026</span>
        <span>Data, lembaga, dan hasil konsultasi bersifat simulasi.</span>
        <Link href="/consultations">Lihat semua konsultasi</Link>
      </footer>
    </div>
  );
}

function FormalEvidenceWall() {
  return (
    <div className="formal-reference-layout">
      <div className="formal-evidence-wall" aria-label="Rangkaian bukti pengalaman warga">
        <svg className="evidence-thread" viewBox="0 0 860 760" aria-hidden="true">
          <path d="M255 112 C330 112 315 270 320 345 C325 425 420 405 520 430 C600 450 610 620 700 640" />
          <path d="M300 355 C250 390 225 455 235 532" />
          <circle cx="255" cy="112" r="6" /><circle cx="320" cy="345" r="6" />
          <circle cx="520" cy="430" r="6" /><circle cx="700" cy="640" r="6" />
        </svg>

        <article className="evidence-paper evidence-photo">
          <span className="tape-label">Pengalaman</span>
          <div className="photo-window" aria-label="Halte Bundaran HI">
            <img src="/design/formal-stage-reference.png" alt="" />
          </div>
          <p>Halte Bundaran HI<br />Akses kursi roda terhalang lantai naik tanpa ramp.</p>
          <small>14 Apr 2025 · 07:42 WIB</small>
        </article>

        <article className="evidence-paper evidence-receipt">
          <strong className="transit-wordmark">transjakarta</strong>
          <dl>
            <div><dt>Tanggal</dt><dd>14/04/2025</dd></div>
            <div><dt>Waktu</dt><dd>07:42</dd></div>
            <div><dt>Halte</dt><dd>Bundaran HI</dd></div>
            <div><dt>Koridor</dt><dd>1</dd></div>
            <div><dt>Tujuan</dt><dd>Kota</dd></div>
            <div><dt>Tarif</dt><dd>Rp 3.500</dd></div>
          </dl>
          <em>Terima kasih<br />Selamat jalan</em>
        </article>

        <article className="evidence-paper evidence-chronology">
          <h3>Kronologi singkat</h3>
          <p><b>07:35</b> Tiba di Halte Bundaran HI</p>
          <p><b>07:37</b> Mencoba naik via pintu tengah</p>
          <p><b>07:38</b> Ramp tidak tersedia</p>
          <p><b>07:39</b> Meminta bantuan petugas</p>
          <p><b>07:41</b> Naik melalui pintu depan</p>
        </article>

        <article className="evidence-paper evidence-impact-note">
          <h3>Dampak aksesibilitas</h3>
          <p>Pengguna kursi roda dan lansia mengalami kesulitan akses. Waktu tempuh lebih lama dan berisiko keselamatan.</p>
          <b className="accessibility-mark">♿</b>
        </article>

        <article className="evidence-paper evidence-map-card">
          <div className="mini-map-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <b className="map-pin">●</b>
          <span>Halte Bundaran HI</span>
        </article>

        <article className="evidence-paper evidence-location">
          <h3>Lokasi &amp; waktu</h3>
          <p>Bundaran HI, Jakarta Pusat<br />14 Apr 2025 · 07:35–07:45 WIB</p>
        </article>

        <article className="evidence-paper evidence-policy">
          <h3>Rujukan kebijakan</h3>
          <p>Peraturan Gubernur DKI Jakarta No. 133 Tahun 2018 tentang Standar Pelayanan TransJakarta</p>
          <hr />
          <b>Pasal 18 — Aksesibilitas</b>
          <p><mark>(1) Setiap halte wajib menyediakan fasilitas aksesibilitas bagi penyandang disabilitas dan lansia.</mark></p>
          <p>(2) Fasilitas meliputi ramp, guiding block, dan informasi yang mudah diakses.</p>
          <span className="relevant-stamp">Relevan</span>
        </article>

        <article className="evidence-checklist">
          <h3>Disusun menjadi usulan</h3>
          <ul>
            <li>Pengalaman terverifikasi</li>
            <li>Konteks &amp; dampak jelas</li>
            <li>Rujukan kebijakan relevan</li>
            <li>Solusi &amp; harapan perubahan</li>
          </ul>
          <strong>Siap dikirim</strong>
        </article>
      </div>

      <div className="formal-reference-copy">
        <p className="kicker">Dari pengalaman menjadi bukti</p>
        <h2><span>“</span>Pengalaman menjadi bukti ketika dampaknya dapat dijelaskan.<span>”</span></h2>
        <p>SUARA mengubah pengalaman sehari-hari menjadi masukan formal yang terstruktur, dipertimbangkan, dan dapat ditinjau.</p>
        <fieldset>
          <legend>Apa yang sebaiknya dilakukan terhadap usulan ini?</legend>
          <label><input type="radio" name="formal-reference-position" /> Terima</label>
          <label><input type="radio" name="formal-reference-position" defaultChecked /> Ubah</label>
          <label><input type="radio" name="formal-reference-position" /> Tinjau kembali</label>
        </fieldset>
        <div className="formal-reference-actions">
          <span>Perubahan yang dibutuhkan:</span>
          <button type="button" className="active">Tambah masa transisi</button>
          <button type="button">Atur pengecualian</button>
          <button type="button">Perbaiki akses</button>
        </div>
        <strong className="recorded-stamp">Masukan tercatat</strong>
      </div>
    </div>
  );
}

function ConsiderationStoryboard() {
  return (
    <div className="consideration-reference-layout">
      <aside className="decision-intro">
        <p className="kicker">Stage 04</p>
        <span>Pertimbangan lembaga</span>
        <h2>Bagaimana lembaga mempertimbangkan masukan.</h2>
        <p>Masukan warga menjadi bukti berdasarkan data dan dampak nyata.</p>
        <i></i>
        <blockquote><b>“</b>Kepercayaan muncul ketika alasan dapat diperiksa.<b>”</b></blockquote>
        <p>Setiap keputusan dapat ditelusuri: dari masukan, bukti, pertimbangan, hingga alasan tertulis.</p>
      </aside>

      <div className="decision-workspace">
        <section className="consideration-summary">
          <h3>Ringkasan pertimbangan</h3>
          <div>
            <p><span>Masukan diterima</span><b>42</b> tanggapan</p>
            <p><span>Dokumen diperiksa</span><b>3</b> sumber resmi</p>
            <p><span>Kajian mobilitas</span><b>1</b> ringkasan kajian</p>
            <p><span>Periode tinjauan</span><strong>21 Jun – 18 Jul 2026</strong><small>28 hari kerja</small></p>
          </div>
          <p><b>Topik:</b> Perpanjangan masa transisi uji coba rute Blok M–Kota</p>
        </section>

        <div className="consideration-flow">
          <article>
            <i>01</i><h3>Masukan warga</h3>
            <blockquote>“Usaha kecil membutuhkan masa transisi lebih panjang.”</blockquote>
            <dl><div><dt>Diterima</dt><dd>21 Jun 2026, 14:32</dd></div><div><dt>Kanal</dt><dd>Portal SUARA</dd></div><div><dt>ID Masukan</dt><dd>SUA-2026-06-00217</dd></div></dl>
          </article>
          <article>
            <i>02</i><h3>Bukti diperiksa</h3>
            <ul><li>Data Penumpang TransJakarta <b>Terverifikasi ✓</b></li><li>Audit Aksesibilitas Halte <b>Terverifikasi ✓</b></li><li>Surat Edaran Dishub <b>Terverifikasi ✓</b></li></ul>
            <p>Total sumber diperiksa <b>3/3</b></p>
          </article>
          <article>
            <i>03</i><h3>Keputusan</h3>
            <span className="status accepted">Diterima sebagian</span>
            <p>Masa transisi diperpanjang menjadi 6 bulan dengan evaluasi berkala.</p>
            <div className="decision-metrics"><b>62%<small>Keterisian</small></b><b>91%<small>Ketepatan</small></b><b>78%<small>Aksesibilitas</small></b></div>
          </article>
          <article>
            <i>04</i><h3>Alasan lembaga</h3>
            <p>Perpanjangan diperlukan untuk melindungi keberlanjutan usaha kecil dan memastikan kesiapan layanan aksesibel.</p>
            <ul><li>Adaptasi penumpang masih berlangsung.</li><li>Empat halte belum memenuhi standar.</li><li>Evaluasi dilakukan tiap tiga bulan.</li></ul>
            <strong className="official-stamp">Dipertimbangkan<br />secara resmi</strong>
          </article>
        </div>
        <div className="public-accountability"><b>◇</b><p><strong>Akuntabilitas publik</strong>Semua dokumen dan data yang digunakan dapat diakses oleh publik.</p><a href="#decision-title">Lihat dokumen pendukung →</a></div>
      </div>
    </div>
  );
}

function RevisionStoryboard() {
  return (
    <div className="revision-reference-layout">
      <aside className="revision-reference-intro">
        <p className="kicker">05 · Perubahan naskah</p>
        <h2>Masukan tidak berakhir saat dikirim.</h2>
        <i></i>
        <p>Bandingkan naskah sebelum konsultasi dan setelah pertimbangan. Setiap perubahan dapat ditelusuri ke masukan warga dan alasannya.</p>
        <div className="revision-counts"><p><b>47</b> Masukan warga terkait pasal ini</p><p><b>12</b> Poin diakomodasi dalam perubahan</p></div>
        <div className="revision-document-name"><span>Naskah kebijakan</span><strong>Peraturan Gubernur tentang Integrasi Layanan Transportasi Publik</strong><b>Bab III · Bagian 2 · Pasal 7</b></div>
      </aside>

      <div className="revision-document-compare">
        <article className="document-before">
          <header><span>Sebelum konsultasi</span><b>12 Mei 2025 · v0.8</b></header>
          <div>
            <h3>Pasal 7</h3><h4>Masa Transisi dan Evaluasi</h4>
            <p>(1) Perubahan tarif berlaku terhitung <del>sejak tanggal ditetapkan.</del></p>
            <p>(2) Masa transisi penyesuaian layanan ditetapkan <del>paling lama 3 (tiga) bulan.</del></p>
            <p>(3) Evaluasi layanan dilakukan secara berkala <del>sesuai kebutuhan.</del></p>
          </div>
        </article>
        <article className="document-after">
          <header><span>Setelah pertimbangan</span><b>28 Juni 2025 · v1.1</b></header>
          <div>
            <h3>Pasal 7</h3><h4>Masa Transisi dan Evaluasi</h4>
            <p>(1) Perubahan tarif berlaku terhitung <ins>mulai tanggal 1 bulan setelah</ins> ditetapkan.</p>
            <p>(2) Masa transisi penyesuaian layanan ditetapkan <ins>paling lama 6 (enam) bulan, termasuk penyesuaian aksesibilitas.</ins></p>
            <p>(3) Evaluasi layanan dilakukan secara berkala <ins>setiap 3 (tiga) bulan selama masa transisi dan dipublikasikan.</ins></p>
          </div>
        </article>
      </div>

      <aside className="revision-reasons">
        <h3>⚖ Alasan perubahan</h3>
        <article><i>1</i><b>Waktu mulai diberi jeda</b><p>Memberi waktu sosialisasi dan penyesuaian sistem.</p><small>Sumber masukan: M-27, M-31, M-38</small></article>
        <article><i>2</i><b>Transisi diperpanjang &amp; inklusif</b><p>Kebutuhan penyesuaian aksesibilitas membutuhkan waktu lebih panjang.</p><small>Sumber masukan: M-04, M-16, M-22</small></article>
        <article><i>3</i><b>Evaluasi berkala &amp; transparan</b><p>Mendorong akuntabilitas dan kepercayaan publik.</p><small>Sumber masukan: M-11, M-29, M-45</small></article>
      </aside>

      <div className="revision-trail">
        <span>Jejak perubahan naskah</span>
        <p>Masukan warga <b>47 masukan</b></p><i>→</i><p>Musyawarah <b>12 poin diakomodasi</b></p><i>→</i><p>Pertimbangan lembaga <b>4 rapat · 28 hari</b></p><i>→</i><p className="active">Perubahan naskah <b>v0.8 → v1.1</b></p>
      </div>
    </div>
  );
}

function UrbanPolicyTwin({ activeResident }: { activeResident: number }) {
  const active = residents[activeResident];
  return (
    <div className="urban-policy-twin" role="img" aria-label="Simulasi elemen digital kawasan Blok M dan rute warga terdampak">
      <div className="twin-skyline" aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => (
          <i
            key={index}
            style={{
              "--building-x": `${(index * 37) % 96}%`,
              "--building-y": `${14 + ((index * 29) % 72)}%`,
              "--building-w": `${28 + ((index * 17) % 54)}px`,
              "--building-h": `${20 + ((index * 23) % 58)}px`,
              "--building-delay": `${index * -0.11}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <svg className="twin-routes" viewBox="0 0 900 720" aria-hidden="true">
        <defs>
          <filter id="routeGlow">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="roadFade" x1="0" x2="1">
            <stop offset="0" stopColor="#526276" stopOpacity=".18" />
            <stop offset=".5" stopColor="#7d8b98" stopOpacity=".5" />
            <stop offset="1" stopColor="#526276" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <path className="twin-road broad" d="M25 565 C180 498 292 478 412 375 C548 260 660 236 890 178" />
        <path className="twin-road" d="M58 192 C230 222 310 286 412 375 C548 494 684 516 864 630" />
        <path className="twin-road" d="M218 704 C268 575 333 470 412 375 C488 284 536 158 575 22" />
        <path className="route-normal route-animate" d="M74 545 C168 500 265 500 332 432 C390 373 447 302 558 292 C658 283 696 238 779 186" />
        <path className="route-impact route-animate" d="M74 545 C168 500 260 510 332 465 C424 408 490 442 565 488 C651 541 708 581 817 626" />
        {[["74","545"],["332","432"],["558","292"],["779","186"]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} className="normal-node" cx={cx} cy={cy} r="8" />
        ))}
        {[["332","465"],["565","488"],["817","626"]].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} className="impact-node" cx={cx} cy={cy} r="8" />
        ))}
      </svg>
      <div className="twin-hub">
        <span>Blok M Hub</span>
        <b>MRT Blok M</b>
      </div>
      <div className="policy-chip twin-hours"><span>Jam operasional</span><b>05.00–22.00</b><small>Kecuali bus & layanan</small></div>
      <div className="policy-chip twin-zone"><span>Zona bongkar muat</span><b>05.00–22.00</b></div>
      <div className="policy-chip twin-closure"><span>Akses ditutup</span><b>05.00–22.00</b></div>
      <div className={`resident-beacon beacon-${activeResident}`}>
        <i>{active.name.slice(0, 1)}</i>
        <span><b>{active.name}</b><small>{active.role}</small></span>
      </div>
      <div className="twin-metrics">
        <span>Rute normal<b>820 m</b><small>±12 menit</small></span>
        <span>Rute terdampak<b>1,25 km</b><small>±30 menit</small></span>
        <span className="alert">Detour<b>+430 m</b><small>+18 menit</small></span>
      </div>
      <div className="twin-legend">
        <span><i></i>Rute normal</span>
        <span><i></i>Rute terdampak</span>
        <span><i></i>Akses layanan</span>
      </div>
    </div>
  );
}

function ChapterFooter({ number, label, progress }: { number: string; label: string; progress: string }) {
  return (
    <div className="chapter-footer" aria-hidden="true">
      <span><b>{number}</b>{label}</span>
      <span>Jejak suara <i></i>{progress}</span>
    </div>
  );
}
