export type NetworkNode = {
  id: string;
  index: number;
  label: string;
  icon: string;
  score: number;
  category: "agreement" | "difference" | "unheard";
  categoryLabel: string;
  description: string;
  priority: string;
  criticalTime: string;
  distance: string;
  position: [number, number, number];
  bend: number;
};

export const networkNodes: NetworkNode[] = [
  {
    id: "umkm", index: 1, label: "UMKM", icon: "▦", score: 76,
    category: "agreement", categoryLabel: "Titik temu kuat",
    description: "Akses bongkar muat lebih awal menjaga ritme usaha kecil tanpa menghentikan arus utama kota.",
    priority: "Jendela logistik mikro sebelum pukul 07.00", criticalTime: "05.00-08.00",
    distance: "0.8 km", position: [-3.05, 2.45, 0], bend: -0.72,
  },
  {
    id: "malam", index: 2, label: "Pekerja malam", icon: "◐", score: 69,
    category: "difference", categoryLabel: "Perbedaan ritme",
    description: "Jam regulasi bersinggungan langsung dengan perjalanan pulang saat pilihan angkutan sedang paling sedikit.",
    priority: "Koridor aman dan frekuensi malam yang pasti", criticalTime: "21.00-23.00",
    distance: "1.4 km", position: [3.05, 2.4, 0.12], bend: 0.68,
  },
  {
    id: "komuter", index: 3, label: "Komuter", icon: "▣", score: 81,
    category: "agreement", categoryLabel: "Titik temu kuat",
    description: "Rute pengumpan yang konsisten mengurangi perpindahan moda dan membuat waktu tempuh lebih dapat diprediksi.",
    priority: "Integrasi halte dalam radius berjalan kaki", criticalTime: "06.30-09.00",
    distance: "1.25 km", position: [4.12, 0.12, 0.18], bend: -0.52,
  },
  {
    id: "akses", index: 4, label: "Aksesibilitas", icon: "♿", score: 58,
    category: "unheard", categoryLabel: "Suara jarang terlihat",
    description: "Perubahan kecil pada elevasi, penerangan, dan waktu menyeberang menentukan apakah sebuah rute benar-benar dapat digunakan.",
    priority: "Audit jalur bersama pengguna disabilitas", criticalTime: "SEPANJANG HARI",
    distance: "0.45 km", position: [2.55, -2.75, 0.05], bend: 0.8,
  },
  {
    id: "instansi", index: 5, label: "Instansi", icon: "◆", score: 64,
    category: "difference", categoryLabel: "Perbedaan mandat",
    description: "Koordinasi lintas pengelola menentukan apakah aturan lapangan bergerak sebagai satu sistem atau sebagai fragmen.",
    priority: "Satu indikator bersama untuk evaluasi berkala", criticalTime: "08.00-16.00",
    distance: "2.1 km", position: [-4.05, -1.2, 0.08], bend: -0.62,
  },
];
