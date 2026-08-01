export type StoredParticipation = {
  receipt: string;
  submittedAt: string;
  title: string;
  article: string;
  proposal: string;
  impact: string;
  status: "Terkirim" | "Dalam analisis" | "Ditanggapi";
};

export const PARTICIPATION_HISTORY_KEY = "suara-participation-history";
export const FORMAL_DRAFT_KEY = "suara-formal-draft";
export const FORMAL_SUBMISSION_KEY = "suara-formal-submission";

export const demoParticipation: StoredParticipation[] = [
  {
    receipt: "SUA-DEMO-260731",
    submittedAt: "2026-07-29T09:14:00+07:00",
    title: "Akses pendamping bagi pengguna disabilitas",
    article: "Pasal 12",
    proposal: "Izin akses khusus melekat pada pengguna terverifikasi, bukan pada satu kendaraan.",
    impact: "Kendaraan pendamping dapat berganti sehingga izin berbasis pelat nomor memutus akses perjalanan.",
    status: "Dalam analisis",
  },
  {
    receipt: "SUA-DEMO-260718",
    submittedAt: "2026-07-18T16:42:00+07:00",
    title: "Jendela bongkar muat untuk UMKM",
    article: "Pasal 7",
    proposal: "Sediakan jendela bongkar muat pukul 05.00-07.00 dengan evaluasi setiap tiga bulan.",
    impact: "Pembatasan tanpa jam khusus membuat pasokan warung terlambat dan ongkos logistik meningkat.",
    status: "Ditanggapi",
  },
  {
    receipt: "SUA-DEMO-260705",
    submittedAt: "2026-07-05T20:05:00+07:00",
    title: "Rute aman bagi pekerja shift malam",
    article: "Pasal 9",
    proposal: "Tambahkan layanan penghubung pada akhir jam operasi dan batas tarif harian.",
    impact: "Pekerja pulang setelah layanan reguler berhenti dan harus menanggung perjalanan pengganti yang mahal.",
    status: "Terkirim",
  },
];

function readHistory(): StoredParticipation[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(PARTICIPATION_HISTORY_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function seedDemoParticipation(force = false) {
  if (typeof window === "undefined") return demoParticipation;
  const current = readHistory();
  if (current.length && !force) return current;
  window.localStorage.setItem(PARTICIPATION_HISTORY_KEY, JSON.stringify(demoParticipation));
  return demoParticipation;
}

export function appendParticipation(record: StoredParticipation) {
  if (typeof window === "undefined") return [record];
  const next = [record, ...readHistory().filter((item) => item.receipt !== record.receipt)];
  window.localStorage.setItem(PARTICIPATION_HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function removeParticipation(receipt: string) {
  if (typeof window === "undefined") return [];
  const next = readHistory().filter((item) => item.receipt !== receipt);
  window.localStorage.setItem(PARTICIPATION_HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearSuaraLocalData() {
  if (typeof window === "undefined") return;
  [PARTICIPATION_HISTORY_KEY, FORMAL_DRAFT_KEY, FORMAL_SUBMISSION_KEY].forEach((key) =>
    window.localStorage.removeItem(key),
  );
}
