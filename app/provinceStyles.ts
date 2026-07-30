export type MiniatureKind = "forest" | "lake" | "house" | "gadang" | "monument" | "temple" | "volcano" | "animal" | "bridge" | "islands" | "boat" | "coral" | "flower" | "terrace" | "fort" | "tower" | "honai" | "stone";

export type ProvinceStyle = {
  signature: string;
  detail: string;
  food: string;
  culture: string;
  category: "Alam" | "Bahari" | "Budaya" | "Gunung" | "Kota";
  color: number;
  accent: number;
  emissive: number;
  depth: number;
  model: MiniatureKind;
};

export const PROVINCE_STYLES: Record<string, ProvinceStyle> = {
  Aceh: { signature:"Gunung Leuser", detail:"Hutan hujan dan habitat orangutan", food:"Mie Aceh", culture:"Rumoh Aceh", category:"Alam", color:0x2f8a62, accent:0x8ee6a5, emissive:0x0c3827, depth:.52, model:"forest" },
  "Sumatera Utara": { signature:"Danau Toba", detail:"Kaldera vulkanik dan tanah Batak", food:"Arsik", culture:"Rumah Bolon", category:"Gunung", color:0x328d91, accent:0x8ee9df, emissive:0x0b3840, depth:.58, model:"lake" },
  "Sumatera Barat": { signature:"Rumah Gadang", detail:"Gonjong Minangkabau dan lembah Bukittinggi", food:"Rendang", culture:"Songket Minang", category:"Budaya", color:0x9b593b, accent:0xf1c66d, emissive:0x42180e, depth:.46, model:"gadang" },
  Riau: { signature:"Istana Siak", detail:"Warisan Melayu di tepian sungai", food:"Gulai Ikan Patin", culture:"Selembayung", category:"Budaya", color:0x4f9c68, accent:0xc1e283, emissive:0x173b20, depth:.32, model:"house" },
  "Kepulauan Riau": { signature:"Laut Natuna", detail:"Ribuan pulau tropis di jalur pelayaran", food:"Gonggong", culture:"Gurindam Dua Belas", category:"Bahari", color:0x2e9f9a, accent:0x94f2db, emissive:0x073f3d, depth:.22, model:"islands" },
  Jambi: { signature:"Gunung Kerinci", detail:"Puncak tertinggi Sumatra dan kebun teh", food:"Tempoyak", culture:"Rumah Kajang Leko", category:"Gunung", color:0x73914a, accent:0xd9d76a, emissive:0x2f3910, depth:.62, model:"volcano" },
  "Sumatera Selatan": { signature:"Jembatan Ampera", detail:"Ikon merah di atas Sungai Musi", food:"Pempek", culture:"Songket Palembang", category:"Kota", color:0xa55c41, accent:0xf2a46f, emissive:0x461c12, depth:.36, model:"bridge" },
  Bengkulu: { signature:"Rafflesia Arnoldii", detail:"Bunga tunggal terbesar di dunia", food:"Pendap", culture:"Kain Besurek", category:"Alam", color:0xa74358, accent:0xf58c9f, emissive:0x47111f, depth:.44, model:"flower" },
  Lampung: { signature:"Way Kambas", detail:"Bentang konservasi gajah Sumatra", food:"Seruit", culture:"Siger", category:"Alam", color:0x6f8c4e, accent:0xd1dd83, emissive:0x293614, depth:.40, model:"forest" },
  "Kepulauan Bangka Belitung": { signature:"Batu Granit", detail:"Pantai granit dan rumah rakit", food:"Lempah Kuning", culture:"Kain Cual", category:"Bahari", color:0x6e9693, accent:0xd3f1e4, emissive:0x183938, depth:.26, model:"stone" },
  Banten: { signature:"Ujung Kulon", detail:"Benteng terakhir badak Jawa", food:"Sate Bandeng", culture:"Sulah Nyanda", category:"Alam", color:0x718d45, accent:0xdce56e, emissive:0x2d3c12, depth:.40, model:"forest" },
  "DKI Jakarta": { signature:"Monas", detail:"Mercusuar emas metropolitan", food:"Kerak Telor", culture:"Ondel-ondel", category:"Kota", color:0xd39b3c, accent:0xffeb7a, emissive:0x6b3d05, depth:.68, model:"monument" },
  "Jawa Barat": { signature:"Tanah Priangan", detail:"Angklung, kebun teh, dan Mega Mendung", food:"Karedok", culture:"Rumah Julang Ngapak", category:"Budaya", color:0x64a450, accent:0xbfee79, emissive:0x214512, depth:.55, model:"terrace" },
  "Jawa Tengah": { signature:"Borobudur", detail:"Candi batu dan motif batik kawung", food:"Lumpia Semarang", culture:"Rumah Joglo", category:"Budaya", color:0x9a7448, accent:0xe9c783, emissive:0x402b11, depth:.50, model:"temple" },
  "Daerah Istimewa Yogyakarta": { signature:"Keraton dan Merapi", detail:"Sumbu filosofis, Joglo, dan batik parang", food:"Gudeg", culture:"Batik Parang", category:"Gunung", color:0x923f39, accent:0xf28a67, emissive:0x45100c, depth:.62, model:"house" },
  "Jawa Timur": { signature:"Gunung Bromo", detail:"Kaldera vulkanik di lautan pasir", food:"Rawon", culture:"Reog Ponorogo", category:"Gunung", color:0xb5663d, accent:0xffb06b, emissive:0x50200b, depth:.64, model:"volcano" },
  Bali: { signature:"Pura dan Subak", detail:"Terasering dalam filosofi harmoni", food:"Ayam Betutu", culture:"Tari Kecak", category:"Budaya", color:0x8ca64b, accent:0xeff07b, emissive:0x37450e, depth:.50, model:"temple" },
  "Nusa Tenggara Barat": { signature:"Gunung Rinjani", detail:"Puncak Lombok dan Danau Segara Anak", food:"Ayam Taliwang", culture:"Lumbung Sasak", category:"Gunung", color:0x397f83, accent:0x91e0c8, emissive:0x113a3d, depth:.65, model:"volcano" },
  "Nusa Tenggara Timur": { signature:"Komodo dan Savana", detail:"Pulau kering, tenun ikat, dan sasando", food:"Se'i", culture:"Mbaru Niang", category:"Alam", color:0xb66f3f, accent:0xf1c06d, emissive:0x54240b, depth:.42, model:"islands" },
  "Kalimantan Barat": { signature:"Khatulistiwa", detail:"Tugu ekuator dan Sungai Kapuas", food:"Bubur Pedas", culture:"Rumah Radakng", category:"Alam", color:0x398b70, accent:0x8ce5b6, emissive:0x103a2b, depth:.36, model:"monument" },
  "Kalimantan Tengah": { signature:"Tanjung Puting", detail:"Hutan gambut dan orangutan", food:"Juhu Singkah", culture:"Rumah Betang", category:"Alam", color:0x4b7f45, accent:0xa9d77b, emissive:0x193516, depth:.38, model:"forest" },
  "Kalimantan Selatan": { signature:"Pasar Terapung", detail:"Jukung di Sungai Martapura", food:"Soto Banjar", culture:"Kain Sasirangan", category:"Budaya", color:0x4f9690, accent:0xc1eee0, emissive:0x173e3a, depth:.34, model:"boat" },
  "Kalimantan Timur": { signature:"Sungai Mahakam", detail:"Perahu sungai dan Kepulauan Derawan", food:"Nasi Bekepor", culture:"Ulap Doyo", category:"Bahari", color:0x3c8f83, accent:0x91e9ce, emissive:0x103e37, depth:.42, model:"boat" },
  "Kalimantan Utara": { signature:"Kayan Mentarang", detail:"Pegunungan perbatasan dan hutan tua", food:"Nasi Subut", culture:"Rumah Baloy", category:"Alam", color:0x4d9272, accent:0xa8e8ba, emissive:0x173c2c, depth:.55, model:"forest" },
  "Sulawesi Utara": { signature:"Bunaken", detail:"Dinding karang dan laut vulkanik", food:"Tinutuan", culture:"Rumah Walewangko", category:"Bahari", color:0x328eaa, accent:0x86e7ef, emissive:0x0b3446, depth:.30, model:"coral" },
  Gorontalo: { signature:"Hiu Paus", detail:"Perairan Botubarani dan sulam karawo", food:"Binte Biluhuta", culture:"Sulam Karawo", category:"Bahari", color:0x3b9da6, accent:0xa2eef0, emissive:0x103c43, depth:.28, model:"coral" },
  "Sulawesi Tengah": { signature:"Megalit Lore Lindu", detail:"Patung batu purba dan Kepulauan Togean", food:"Kaledo", culture:"Rumah Tambi", category:"Budaya", color:0x4f8c67, accent:0xaddc8d, emissive:0x1b3925, depth:.44, model:"stone" },
  "Sulawesi Barat": { signature:"Perahu Sandeq", detail:"Pelaut Mandar dan tenun Sekomandi", food:"Jepa", culture:"Tenun Sekomandi", category:"Budaya", color:0x9c7642, accent:0xe3c379, emissive:0x422c10, depth:.40, model:"boat" },
  "Sulawesi Selatan": { signature:"Tongkonan dan Phinisi", detail:"Atap Toraja dan layar Bugis", food:"Coto Makassar", culture:"Rumah Tongkonan", category:"Budaya", color:0xa45b3b, accent:0xf0b068, emissive:0x471c0c, depth:.58, model:"gadang" },
  "Sulawesi Tenggara": { signature:"Wakatobi", detail:"Jantung segitiga terumbu karang", food:"Sinonggi", culture:"Tenun Buton", category:"Bahari", color:0x279b9d, accent:0x83f0dd, emissive:0x063e40, depth:.30, model:"coral" },
  Maluku: { signature:"Kepulauan Banda", detail:"Laut pala dan rumah Baileo", food:"Papeda", culture:"Rumah Baileo", category:"Bahari", color:0x576f91, accent:0xadbfe5, emissive:0x1b233d, depth:.30, model:"house" },
  "Maluku Utara": { signature:"Ternate dan Tidore", detail:"Gunung api di jalur rempah cengkih", food:"Gohu Ikan", culture:"Rumah Sasadu", category:"Gunung", color:0x974c43, accent:0xef9277, emissive:0x421612, depth:.56, model:"volcano" },
  "Papua Barat": { signature:"Pegunungan Arfak", detail:"Hutan montana dan burung cenderawasih", food:"Ikan Bakar Manokwari", culture:"Rumah Kaki Seribu", category:"Alam", color:0x3f875f, accent:0x9ae0a6, emissive:0x123621, depth:.55, model:"forest" },
  "Papua Barat Daya": { signature:"Raja Ampat", detail:"Karst dan biodiversitas laut dunia", food:"Cacing Laut Insonem", culture:"Tifa", category:"Bahari", color:0x2f9c92, accent:0x91f1d2, emissive:0x073d38, depth:.25, model:"islands" },
  Papua: { signature:"Danau Sentani", detail:"Lukisan kulit kayu dan budaya pesisir", food:"Papeda", culture:"Tifa dan Cenderawasih", category:"Budaya", color:0x428b7c, accent:0xd6dc79, emissive:0x123a31, depth:.48, model:"lake" },
  "Papua Tengah": { signature:"Puncak Carstensz", detail:"Puncak bersalju tropis tertinggi Indonesia", food:"Udang Selingkuh", culture:"Noken", category:"Gunung", color:0x799b91, accent:0xe5f3d8, emissive:0x28413c, depth:.80, model:"volcano" },
  "Papua Pegunungan": { signature:"Lembah Baliem", detail:"Punggung Jayawijaya dan rumah honai", food:"Bakar Batu", culture:"Rumah Honai", category:"Gunung", color:0x8c7352, accent:0xe2bd79, emissive:0x3b2c16, depth:.75, model:"honai" },
  "Papua Selatan": { signature:"Savana Wasur", detail:"Bentang savana Merauke dan budaya Marind", food:"Sagu Sep", culture:"Ukiran Marind", category:"Alam", color:0x9a8c48, accent:0xe9dc79, emissive:0x3e3710, depth:.32, model:"terrace" },
};

export const FALLBACK_STYLE: ProvinceStyle = { signature:"Nusantara", detail:"Warisan alam dan budaya Indonesia", food:"Kuliner lokal", culture:"Tradisi setempat", category:"Budaya", color:0x78b95f, accent:0xddea68, emissive:0x0b2d20, depth:.36, model:"house" };