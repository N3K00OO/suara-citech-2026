"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SuaraHeader } from "./SuaraHeader";

const productSteps = [
  { short: "Pahami", detail: "Ringkasan dan ruang lingkup" },
  { short: "Periksa naskah", detail: "Teks dan penjelasan" },
  { short: "Sampaikan dampak", detail: "Masukan formal" },
  { short: "Suara warga", detail: "Tanggapan terstruktur" },
  { short: "Bermusyawarah", detail: "Isu dan titik temu" },
  { short: "Lihat pertimbangan", detail: "Alasan lembaga" },
  { short: "Telusuri perubahan", detail: "Sebelum dan sesudah" },
];

const articles = [
  {
    id: "Pasal 3",
    title: "Tujuan",
    official:
      "Kawasan Rendah Emisi Terpadu bertujuan mengurangi paparan emisi transportasi, meningkatkan penggunaan angkutan umum, serta menjaga akses yang adil.",
    plain:
      "Kebijakan ingin mengurangi polusi dan kendaraan pribadi tanpa menutup akses bagi orang yang benar-benar membutuhkan perjalanan ke kawasan.",
  },
  {
    id: "Pasal 7",
    title: "Waktu dan batas kawasan",
    official:
      "Pembatasan kendaraan diberlakukan pada hari kerja pukul 06.00–21.00 dalam batas kawasan yang ditetapkan pada peta lampiran.",
    plain:
      "Jam dan batas zona masih dapat berubah. Konsultasi terutama memeriksa dampaknya pada pekerja shift, UMKM, logistik, dan akses disabilitas.",
  },
  {
    id: "Pasal 12",
    title: "Pengecualian dan dukungan",
    official:
      "Pengecualian diberikan kepada kendaraan darurat, angkutan umum, dan kendaraan pemegang izin akses khusus.",
    plain:
      "Rancangan awal belum menjelaskan akses penyandang disabilitas, pekerja malam, kendaraan pendamping, atau dukungan usaha kecil.",
  },
  {
    id: "Pasal 14",
    title: "Evaluasi",
    official:
      "Pelaksanaan dievaluasi setelah dua belas bulan berdasarkan indikator kualitas udara dan volume kendaraan.",
    plain:
      "Warga meminta evaluasi lebih cepat serta indikator keterjangkauan, keselamatan, dan dampak pada jalan sekitar.",
  },
];

const communityResponses = [
  {
    name: "Rina P.",
    role: "Pekerja shift",
    ref: "Pasal 9",
    tone: "Dukung dengan perubahan",
    quote: "Tarif tanpa batas harian sulit diprediksi ketika angkutan umum sudah berhenti sebelum shift selesai.",
    proposal: "Tambahkan batas harian dan izin terverifikasi bagi pekerja shift.",
  },
  {
    name: "Bagus W.",
    role: "Pelaku UMKM",
    ref: "Pasal 7",
    tone: "Setuju dengan syarat",
    quote: "Jam bongkar muat harus terpisah dari jam tersibuk agar pembatasan tidak memutus pasokan usaha kecil.",
    proposal: "Sediakan jendela pengiriman 05.00–07.00.",
  },
  {
    name: "Nadia A.",
    role: "Advokat akses",
    ref: "Pasal 12",
    tone: "Menolak sebagian",
    quote: "Izin akses tidak boleh melekat pada satu kendaraan karena kendaraan pendamping dapat berganti.",
    proposal: "Izin melekat pada pengguna yang terverifikasi.",
  },
  {
    name: "Warga Melawai",
    role: "Warga kawasan",
    ref: "Pasal 14",
    tone: "Setuju",
    quote: "Data rata-rata tidak boleh menutupi perpindahan lalu lintas ke jalan lingkungan.",
    proposal: "Publikasikan evaluasi setiap tiga bulan.",
  },
];

type FormalState = {
  article: string;
  clause: string;
  changeType: string;
  proposal: string;
  impact: string;
  affected: string[];
  evidence: string[];
};

const initialFormal: FormalState = {
  article: "Pasal 7",
  clause: "Ayat (2) Butir b",
  changeType: "Tambah ketentuan",
  proposal: "Tambahkan kewajiban perawatan rutin dan standar ketersediaan minimum lift dan ramp, serta sanksi bila tidak berfungsi.",
  impact: "Lift tidak berfungsi sehingga saya harus turun dan naik tangga. Ketinggalan bus, terlambat kerja, kehilangan upah harian.",
  affected: ["Penyandang disabilitas", "Pekerja harian"],
  evidence: ["Foto lift mati di halte ASEAN", "Struk TransJakarta Koridor 1", "Peta lokasi & rute berjalan"],
};

export function SuaraProduct() {
  const [step, setStep] = useState(0);
  const [article, setArticle] = useState(1);
  const [formal, setFormal] = useState<FormalState>(initialFormal);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [saved, setSaved] = useState("Draf tersimpan otomatis");
  const [assemblyIssue, setAssemblyIssue] = useState("Akses disabilitas");

  useEffect(() => {
    const selected = Number(new URLSearchParams(window.location.search).get("step"));
    if (Number.isInteger(selected) && selected >= 0 && selected < productSteps.length) setStep(selected);
    try {
      const stored = window.localStorage.getItem("suara-formal-draft");
      if (stored) setFormal({ ...initialFormal, ...JSON.parse(stored) });
      const submission = window.localStorage.getItem("suara-formal-submission");
      if (submission) setReceipt(JSON.parse(submission).receipt ?? null);
    } catch {
      // Local persistence is optional.
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem("suara-formal-draft", JSON.stringify(formal));
        setSaved(`Draf disimpan ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`);
      } catch {
        setSaved("Draf tersimpan selama halaman ini terbuka");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [formal]);

  const progress = Math.round(((step + 1) / productSteps.length) * 100);
  const activeArticle = articles[article];
  const affectedText = useMemo(() => formal.affected.join(", "), [formal.affected]);

  const goTo = (index: number) => {
    setStep(index);
    window.history.replaceState({}, "", `/product?step=${index}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAffected = (value: string) => {
    setFormal((current) => ({
      ...current,
      affected: current.affected.includes(value)
        ? current.affected.filter((item) => item !== value)
        : [...current.affected, value],
    }));
  };

  const submitFormal = () => {
    const newReceipt = `SUA-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const record = { ...formal, receipt: newReceipt, submittedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem("suara-formal-submission", JSON.stringify(record));
      window.localStorage.removeItem("suara-formal-draft");
    } catch {
      // The receipt still works in memory.
    }
    setReceipt(newReceipt);
  };

  return (
    <div className="product-page">
      <SuaraHeader active="product" />

      <div className="product-shell">
        <aside className="journey-sidebar" aria-label="Tahap konsultasi">
          <div className="journey-intro">
            <span>Konsultasi aktif</span>
            <h1>Jejak kebijakan</h1>
            <p>Pilih tahapan untuk membuka isi konsultasi.</p>
          </div>
          <ol>
            {productSteps.map((item, index) => (
              <li key={item.short}>
                <button
                  type="button"
                  className={step === index ? "active" : ""}
                  aria-current={step === index ? "step" : undefined}
                  onClick={() => goTo(index)}
                >
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <span><strong>{item.short}</strong><small>{item.detail}</small></span>
                  <i>›</i>
                </button>
              </li>
            ))}
          </ol>
          <div className="journey-progress">
            <span>Progres jejak Anda</span>
            <p><b>{step + 1}</b> dari {productSteps.length} tahap</p>
            <div><i style={{ width: `${progress}%` }}></i></div>
            <small>{progress}%</small>
          </div>
        </aside>

        <main className="product-content">
          <div className="product-mobile-progress">
            <button type="button" onClick={() => goTo(Math.max(0, step - 1))}>←</button>
            <span>{String(step + 1).padStart(2, "0")} / {String(productSteps.length).padStart(2, "0")} · {productSteps[step].short}</span>
            <button type="button" onClick={() => goTo(Math.min(productSteps.length - 1, step + 1))}>→</button>
          </div>

          {step === 0 && <OverviewStep onStart={() => goTo(1)} />}
          {step === 1 && (
            <DocumentStep
              article={activeArticle}
              selected={article}
              onSelect={setArticle}
              onContinue={() => goTo(2)}
            />
          )}
          {step === 2 && (
            <FormalStep
              formal={formal}
              saved={saved}
              receipt={receipt}
              affectedText={affectedText}
              onChange={setFormal}
              onToggleAffected={toggleAffected}
              onSubmit={submitFormal}
            />
          )}
          {step === 3 && <CommunityStep onContinue={() => goTo(4)} />}
          {step === 4 && (
            <AssemblyStep
              issue={assemblyIssue}
              onSelect={setAssemblyIssue}
              onContinue={() => goTo(5)}
            />
          )}
          {step === 5 && <ConsiderationStep onContinue={() => goTo(6)} />}
          {step === 6 && <RevisionStep />}
        </main>
      </div>
    </div>
  );
}

function StepHeader({ number, kicker, title, copy }: { number: string; kicker: string; title: string; copy: string }) {
  return (
    <header className="step-header">
      <p>{number} · {kicker}</p>
      <h2>{title}</h2>
      <span>{copy}</span>
    </header>
  );
}

function OverviewStep({ onStart }: { onStart: () => void }) {
  return (
    <section className="product-step overview-step">
      <StepHeader
        number="01"
        kicker="Pahami"
        title="Rancangan Kawasan Rendah Emisi Terpadu Blok M"
        copy="Kenali tujuan, ruang perubahan, jadwal, dan siapa yang terdampak sebelum memberi tanggapan."
      />
      <div className="overview-grid">
        <article className="policy-summary">
          <span className="status-chip">Konsultasi terbuka</span>
          <h3>Satu kawasan, banyak cara bergerak.</h3>
          <p>
            Rancangan mengatur jam pembatasan kendaraan, tarif parkir berbasis emisi,
            pengecualian akses, dan evaluasi kawasan.
          </p>
          <dl>
            <div><dt>Instansi</dt><dd>Dinas Perhubungan DKI Jakarta</dd></div>
            <div><dt>Wilayah</dt><dd>Blok M dan Melawai</dd></div>
            <div><dt>Batas konsultasi</dt><dd>30 Agustus 2026</dd></div>
          </dl>
        </article>
        <div className="scope-board">
          <div className="scope-route" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
            <span>MRT</span><span>Pasar</span><span>Terminal</span><span>Hunian</span>
          </div>
          <div className="scope-facts">
            <article><b>06.00–21.00</b><span>Jam awal yang diusulkan</span></article>
            <article><b>4 kelompok</b><span>Perlu perlindungan khusus</span></article>
            <article><b>6 bulan</b><span>Usulan evaluasi pertama</span></article>
          </div>
        </div>
      </div>
      <div className="scope-columns">
        <article><span>Dapat berubah</span><p>Jam berlaku, masa transisi, pengecualian, dukungan UMKM, dan indikator evaluasi.</p></article>
        <article><span>Di luar ruang konsultasi</span><p>Tujuan pengendalian emisi Jakarta dan tarif angkutan umum di luar rancangan ini.</p></article>
      </div>
      <button className="button primary" type="button" onClick={onStart}>Periksa naskah <span>→</span></button>
    </section>
  );
}

function DocumentStep({
  article,
  selected,
  onSelect,
  onContinue,
}: {
  article: (typeof articles)[number];
  selected: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
}) {
  return (
    <section className="product-step document-step">
      <StepHeader
        number="02"
        kicker="Periksa naskah"
        title="Baca pasal, konteks, dan arti praktisnya."
        copy="Teks resmi ditempatkan berdampingan dengan penjelasan bahasa sederhana."
      />
      <div className="document-workbench">
        <nav aria-label="Daftar pasal">
          {articles.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={selected === index ? "active" : ""}
              onClick={() => onSelect(index)}
            >
              <b>{item.id}</b><span>{item.title}</span>
            </button>
          ))}
        </nav>
        <article className="document-sheet">
          <div className="document-meta"><span>Naskah konsultasi · versi 1.2</span><b>{article.id}</b></div>
          <h3>{article.title}</h3>
          <p className="legal-copy">{article.official}</p>
          <aside>
            <span>Bahasa sederhana</span>
            <p>{article.plain}</p>
          </aside>
          <div className="document-actions">
            <button type="button">Dengarkan penjelasan</button>
            <button type="button">Tandai untuk masukan</button>
          </div>
        </article>
        <aside className="document-notes">
          <span>Yang perlu diperiksa</span>
          <ul>
            <li>Apakah jam berlaku realistis?</li>
            <li>Siapa yang menanggung biaya?</li>
            <li>Apakah akses alternatif tersedia?</li>
            <li>Bagaimana hasil akan dievaluasi?</li>
          </ul>
        </aside>
      </div>
      <button className="button primary" type="button" onClick={onContinue}>Sampaikan dampak <span>→</span></button>
    </section>
  );
}

function FormalStep({
  formal,
  saved,
  receipt,
  affectedText,
  onChange,
  onToggleAffected,
  onSubmit,
}: {
  formal: FormalState;
  saved: string;
  receipt: string | null;
  affectedText: string;
  onChange: (value: FormalState) => void;
  onToggleAffected: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="product-step formal-product-step">
      <StepHeader
        number="03"
        kicker="Sampaikan dampak"
        title="Masukan formal"
        copy="Jawaban disusun sebagai tanggapan konsultasi yang dapat ditinjau, bukan sekadar komentar singkat."
      />
      <div className="formal-workspace">
        <div className="formal-photo-crop" role="img" aria-label="Warga melintasi genangan di kawasan permukiman">
          <img src="/design/masukan-formal-reference.png" alt="" />
          <span>Pengalaman lapangan · akses dan mobilitas</span>
        </div>
        <form className="formal-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <div className="form-grid compact">
            <label>Rancangan kebijakan
              <select value={formal.article} onChange={(event) => onChange({ ...formal, article: event.target.value })}>
                <option>Pasal 7</option>
                <option>Pasal 9</option>
                <option>Pasal 12</option>
                <option>Pasal 14</option>
              </select>
            </label>
            <label>Bagian
              <select value={formal.clause} onChange={(event) => onChange({ ...formal, clause: event.target.value })}>
                <option>Ayat (2) Butir b</option>
                <option>Ayat (3)</option>
                <option>Penjelasan</option>
              </select>
            </label>
          </div>
          <div className="clause-preview">
            <b>{formal.article} · {formal.clause}</b>
            <p>menyediakan fasilitas aksesibilitas yang memadai pada setiap simpul transportasi, termasuk lift, ramp, guiding block, dan informasi visual.</p>
          </div>
          <fieldset>
            <legend>Perubahan yang dibutuhkan</legend>
            {["Tambah ketentuan", "Ubah ketentuan", "Hapus ketentuan", "Perjelas ketentuan"].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="change-type"
                  checked={formal.changeType === item}
                  onChange={() => onChange({ ...formal, changeType: item })}
                />
                {item}
              </label>
            ))}
          </fieldset>
          <label>Usulan redaksi perubahan
            <textarea value={formal.proposal} onChange={(event) => onChange({ ...formal, proposal: event.target.value })} />
          </label>
          <div className="form-grid">
            <label>Jelaskan dampak secara ringkas
              <textarea value={formal.impact} onChange={(event) => onChange({ ...formal, impact: event.target.value })} />
            </label>
            <fieldset className="affected-fieldset">
              <legend>Siapa terdampak selain Anda?</legend>
              {["Penyandang disabilitas", "Lansia", "Orang tua dengan anak", "Pekerja harian", "Pelajar / Mahasiswa"].map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={formal.affected.includes(item)}
                    onChange={() => onToggleAffected(item)}
                  />
                  {item}
                </label>
              ))}
              <small>{affectedText || "Belum ada kelompok dipilih"}</small>
            </fieldset>
          </div>
          <div className="evidence-upload">
            <span>Bukti pengalaman</span>
            {formal.evidence.map((item) => <b key={item}>{item}<i>×</i></b>)}
            <label>+ Tambahkan bukti lain<input type="file" multiple /></label>
          </div>
          <div className="form-actions">
            <span>{saved}</span>
            <button className="button primary" type="submit">Kirim masukan <span>→</span></button>
          </div>
          {receipt && (
            <div className="receipt" role="status">
              <span>Masukan berhasil dicatat</span>
              <b>{receipt}</b>
              <Link href="/responses">Lihat jejak partisipasi →</Link>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function CommunityStep({ onContinue }: { onContinue: () => void }) {
  const [filter, setFilter] = useState("Semua");
  const filters = ["Semua", "Pekerja shift", "Pelaku UMKM", "Advokat akses", "Warga kawasan"];
  const visible = filter === "Semua" ? communityResponses : communityResponses.filter((item) => item.role === filter);
  return (
    <section className="product-step community-step">
      <StepHeader
        number="04"
        kicker="Suara warga"
        title="Pengalaman dibaca satu per satu."
        copy="Tanggapan ditampilkan sebagai argumen terstruktur: konteks, dampak, bukti, dan usulan."
      />
      <div className="filter-row" role="group" aria-label="Filter kelompok warga">
        {filters.map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <div className="response-grid">
        {visible.map((item) => (
          <article key={item.name}>
            <div><b>{item.ref}</b><span>{item.tone}</span></div>
            <p>“{item.quote}”</p>
            <aside><span>Usulan</span>{item.proposal}</aside>
            <footer><strong>{item.name}</strong><span>{item.role}</span></footer>
          </article>
        ))}
      </div>
      <button className="button primary" type="button" onClick={onContinue}>Buka musyawarah <span>→</span></button>
    </section>
  );
}

function AssemblyStep({ issue, onSelect, onContinue }: { issue: string; onSelect: (value: string) => void; onContinue: () => void }) {
  const issues = [
    ["Akses disabilitas", "96 suara", "Izin akses perlu melekat pada pengguna, bukan kendaraan."],
    ["Pekerja & UMKM", "173 suara", "Masa transisi dan jendela logistik perlu diperpanjang."],
    ["Keterjangkauan", "418 suara", "Tarif tanpa batas harian berisiko tidak proporsional."],
    ["Evaluasi kawasan", "211 suara", "Indikator sosial perlu diterbitkan bersama data emisi."],
  ];
  const selected = issues.find((item) => item[0] === issue) ?? issues[0];
  return (
    <section className="product-step assembly-product-step">
      <StepHeader
        number="05"
        kicker="Bermusyawarah"
        title="Isu dibaca satu per satu dan hubungan antarsuara terlihat."
        copy="Ruang ini tidak mengurutkan warga berdasarkan siapa yang paling ramai."
      />
      <div className="issue-board">
        <nav aria-label="Daftar isu">
          {issues.map((item) => (
            <button type="button" key={item[0]} className={issue === item[0] ? "active" : ""} onClick={() => onSelect(item[0])}>
              <span>{item[0]}</span><b>{item[1]}</b>
            </button>
          ))}
        </nav>
        <div className="relationship-map" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i>
          <span>Pekerja</span><span>UMKM</span><span>Akses</span><span>Warga</span><span>Instansi</span>
          <b>{selected[0]}</b>
        </div>
        <article className="issue-summary">
          <span>Titik temu terpilih</span>
          <h3>{selected[0]}</h3>
          <p>{selected[2]}</p>
          <dl><div><dt>Bukti</dt><dd>Audit perjalanan dan tanggapan terstruktur</dd></div><div><dt>Perbedaan</dt><dd>Jangkauan pengecualian dan mekanisme verifikasi</dd></div></dl>
        </article>
      </div>
      <button className="button primary" type="button" onClick={onContinue}>Lihat pertimbangan <span>→</span></button>
    </section>
  );
}

function ConsiderationStep({ onContinue }: { onContinue: () => void }) {
  const rows = [
    ["Masa transisi usaha kecil", "173", "Diterima sebagian", "Transisi menjadi enam bulan dengan evaluasi bulanan."],
    ["Akses melekat pada pengguna", "96", "Diterima", "Kendaraan pendamping terdaftar dapat berganti."],
    ["Batas tarif harian", "418", "Diterima", "Batas maksimum harian ditambahkan selama uji coba."],
    ["Hapus kebijakan rendah emisi", "52", "Ditolak dengan alasan", "Tujuan dipertahankan; perlindungan pelaksanaan diperkuat."],
  ];
  return (
    <section className="product-step consideration-step">
      <StepHeader
        number="06"
        kicker="Lihat pertimbangan"
        title="Bagaimana lembaga mempertimbangkan masukan."
        copy="Setiap keputusan dihubungkan dengan isu, bukti, kelompok terdampak, dan alasan."
      />
      <blockquote>“Kepercayaan muncul ketika alasan dapat diperiksa—termasuk ketika usulan ditolak.”</blockquote>
      <div className="consideration-table" role="table" aria-label="Pertimbangan lembaga">
        <div className="table-head" role="row"><span>Masukan warga</span><span>Jumlah</span><span>Keputusan</span><span>Alasan dan hasil</span></div>
        {rows.map((row) => (
          <div role="row" key={row[0]}>
            <strong>{row[0]}</strong><b>{row[1]}</b><span className="status accepted">{row[2]}</span><p>{row[3]}</p>
          </div>
        ))}
      </div>
      <button className="button primary" type="button" onClick={onContinue}>Telusuri perubahan <span>→</span></button>
    </section>
  );
}

function RevisionStep() {
  const [version, setVersion] = useState("Pasal 12");
  const revisions = {
    "Pasal 9": {
      before: "Tarif parkir disinsentif paling tinggi Rp15.000 per jam tanpa batas harian selama masa uji coba.",
      after: "Tarif diterapkan bertahap dengan batas maksimum harian Rp45.000 selama masa uji coba.",
      reason: "Keterjangkauan muncul dalam 418 respons, terutama dari pekerja shift dan pelaku usaha.",
    },
    "Pasal 12": {
      before: "Izin akses khusus diberikan kepada kendaraan yang memenuhi kriteria verifikasi.",
      after: "Izin diberikan kepada pengguna terverifikasi dan dapat digunakan pada kendaraan pendamping terdaftar.",
      reason: "Masukan menunjukkan kebutuhan mobilitas tidak selalu melekat pada satu kendaraan.",
    },
    "Pasal 14": {
      before: "Pelaksanaan dievaluasi setelah dua belas bulan berdasarkan kualitas udara dan volume kendaraan.",
      after: "Pelaksanaan dievaluasi setiap enam bulan dengan indikator sosial, keselamatan, dan dampak jalan sekitar.",
      reason: "Warga meminta evaluasi lebih cepat serta indikator yang tidak hanya membaca rata-rata emisi.",
    },
  };
  const selected = revisions[version as keyof typeof revisions];
  return (
    <section className="product-step revision-product-step">
      <StepHeader
        number="07"
        kicker="Telusuri perubahan"
        title="Masukan tidak berakhir saat dikirim."
        copy="Lihat kalimat yang berubah, alasan pertimbangan, dan sumber masukan yang memengaruhinya."
      />
      <div className="revision-tabs">
        {Object.keys(revisions).map((item) => <button type="button" key={item} className={version === item ? "active" : ""} onClick={() => setVersion(item)}>{item}</button>)}
      </div>
      <div className="version-grid">
        <article><span>Sebelum konsultasi · draf v1.2</span><h3>{version}</h3><p>{selected.before}</p></article>
        <article><span>Setelah pertimbangan · draf v1.4</span><h3>{version}</h3><p>{selected.after}</p></article>
      </div>
      <div className="revision-reason"><span>Alasan perubahan</span><p>{selected.reason}</p><b>Keputusan dapat diperiksa</b></div>
      <div className="completion-card">
        <span>Jejak selesai</span>
        <h3>Anda telah mengikuti satu suara sampai naskah berubah.</h3>
        <div><Link className="button primary" href="/responses">Lihat partisipasi saya <span>→</span></Link><Link className="button secondary" href="/consultations">Konsultasi lainnya</Link></div>
      </div>
    </section>
  );
}
