"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IndonesiaMap } from "./IndonesiaMap";
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
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
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
          </div>
          <div className="assembly-visual">
            <svg className="assembly-links" viewBox="0 0 700 660" aria-hidden="true">
              <path className="consensus-link one" d="M350 330 C250 185 170 180 118 128" />
              <path className="consensus-link two" d="M350 330 C440 176 520 184 586 132" />
              <path className="consensus-link three" d="M350 330 C510 310 564 332 630 332" />
              <path className="difference-link" d="M350 330 C468 450 526 486 584 548" />
              <path className="minority-link" d="M350 330 C245 468 180 500 116 548" />
              <path className="minority-link" d="M350 330 C190 324 142 336 82 332" />
            </svg>
            <div className="roundtable" aria-hidden="true">
              {["UMKM", "Pekerja", "Komuter", "Akses", "Warga", "Instansi"].map((group, index) => (
                <span key={group} style={{ "--seat": index } as React.CSSProperties}>{group}</span>
              ))}
              <strong>{activeAssembly.value}</strong>
            </div>
            <article className="assembly-result" aria-live="polite">
              <span>{activeAssembly.label}</span>
              <h3>{activeAssembly.headline}</h3>
              <p>{activeAssembly.copy}</p>
            </article>
          </div>
          <ChapterFooter number="03" label="Musyawarah" progress="03 / 05" />
        </section>

        <section className="story-section decision-section" aria-labelledby="decision-title" data-reveal>
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
