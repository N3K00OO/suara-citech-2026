import * as THREE from "three";

export type TextileMotif = "batik" | "floral" | "geometric" | "ikat" | "papua" | "plaid" | "songket" | "stripe" | "weave";
export type ProvinceTextile = { attire: string; textile: string; motif: TextileMotif; palette: [string, string, string] };

export const PROVINCE_TEXTILES: Record<string, ProvinceTextile> = {
  Aceh:{attire:"Ulee Balang",textile:"sulaman Aceh",motif:"geometric",palette:["#1b1715","#bf2634","#eac35a"]},
  "Sumatera Utara":{attire:"Busana Batak",textile:"ulos",motif:"weave",palette:["#211817","#a7292c","#eee0bf"]},
  "Sumatera Barat":{attire:"Bundo Kanduang",textile:"songket Minang",motif:"songket",palette:["#661f2c","#d5a53f","#f6e5ad"]},
  Riau:{attire:"Teluk Belanga",textile:"tenun Siak",motif:"songket",palette:["#174d41","#d3ad42","#f1dfaa"]},
  "Kepulauan Riau":{attire:"Teluk Belanga",textile:"tenun Melayu",motif:"weave",palette:["#156b70","#e8bd4c","#eaf3ce"]},
  Jambi:{attire:"Kurung Tanggung",textile:"songket Jambi",motif:"floral",palette:["#7b1f2a","#d6a139","#efdfb7"]},
  "Sumatera Selatan":{attire:"Aesan Gede",textile:"songket Palembang",motif:"songket",palette:["#7b1a21","#e1b748","#fff0bd"]},
  Bengkulu:{attire:"Busana Rejang",textile:"kain besurek",motif:"floral",palette:["#2a1c22","#ae334b","#e8bd69"]},
  Lampung:{attire:"Tulang Bawang",textile:"kain tapis",motif:"geometric",palette:["#791d24","#e0b13c","#f6e7b3"]},
  "Kepulauan Bangka Belitung":{attire:"Paksian",textile:"kain cual",motif:"floral",palette:["#542a63","#d5a63f","#f2e0ac"]},
  Banten:{attire:"Pangsi Baduy",textile:"tenun Baduy",motif:"stripe",palette:["#161d20","#315a73","#ece8d8"]},
  "DKI Jakarta":{attire:"Kebaya Encim",textile:"batik Betawi",motif:"floral",palette:["#9d2f3d","#2a8c82","#f1d77c"]},
  "Jawa Barat":{attire:"Pangsi Sunda",textile:"batik Priangan",motif:"batik",palette:["#17486a","#72b8bd","#e7e1bc"]},
  "Jawa Tengah":{attire:"Jawi Jangkep",textile:"batik kawung",motif:"batik",palette:["#533524","#a8713c","#e5cf9d"]},
  "Daerah Istimewa Yogyakarta":{attire:"Surjan",textile:"batik parang",motif:"stripe",palette:["#3b2921","#aa7953","#eee1c6"]},
  "Jawa Timur":{attire:"Pesa'an Madura",textile:"batik Madura",motif:"stripe",palette:["#9f1f27","#f0ddbd","#30201b"]},
  Bali:{attire:"Payas Agung",textile:"songket Bali",motif:"songket",palette:["#6b174b","#d9ad3f","#f3e1a6"]},
  "Nusa Tenggara Barat":{attire:"Lambung Sasak",textile:"songket Sasak",motif:"weave",palette:["#171b1f","#9f2631","#e2b64a"]},
  "Nusa Tenggara Timur":{attire:"Busana Tenun NTT",textile:"tenun ikat",motif:"ikat",palette:["#5d201c","#d36636","#e8d1a5"]},
  "Kalimantan Barat":{attire:"King Baba & King Bibinge",textile:"motif Dayak",motif:"geometric",palette:["#791f23","#e0ae38","#20251f"]},
  "Kalimantan Tengah":{attire:"Sangkarut",textile:"motif Dayak Ngaju",motif:"geometric",palette:["#4b2a1f","#daa93e","#9f2b2c"]},
  "Kalimantan Selatan":{attire:"Bagajah Gamuling",textile:"sasirangan",motif:"stripe",palette:["#4f2469","#21a3a0","#e6c25c"]},
  "Kalimantan Timur":{attire:"Kustin",textile:"ulap doyo",motif:"geometric",palette:["#33281f","#b66a2e","#e4c66e"]},
  "Kalimantan Utara":{attire:"Ta'a & Sapei Sapaq",textile:"manik Dayak",motif:"geometric",palette:["#161c1d","#d9ae31","#a92b2f"]},
  "Sulawesi Utara":{attire:"Laku Tepu",textile:"tenun Minahasa",motif:"stripe",palette:["#264c78","#e0bd48","#ede5c6"]},
  Gorontalo:{attire:"Biliu & Payunga",textile:"sulam karawo",motif:"geometric",palette:["#5f286e","#dfb540","#e9d6a9"]},
  "Sulawesi Tengah":{attire:"Nggembe",textile:"tenun Donggala",motif:"weave",palette:["#72232a","#d7a844","#1f2521"]},
  "Sulawesi Barat":{attire:"Pattuqduq Towaine",textile:"tenun Sekomandi",motif:"geometric",palette:["#3a2720","#c76030","#d9aa45"]},
  "Sulawesi Selatan":{attire:"Baju Bodo",textile:"sutra Bugis",motif:"weave",palette:["#a43b52","#e0b84c","#f0cfad"]},
  "Sulawesi Tenggara":{attire:"Busana Kinawo",textile:"tenun Buton",motif:"stripe",palette:["#244a77","#d8ad3c","#e7e0c1"]},
  Maluku:{attire:"Baju Cele",textile:"kain salele",motif:"plaid",palette:["#8e2430","#f1e6ce","#252f35"]},
  "Maluku Utara":{attire:"Manteren Lamo & Kimun Gia",textile:"tenun Ternate",motif:"geometric",palette:["#8a2228","#dfb540","#ede1bc"]},
  "Papua Barat":{attire:"Busana Ewer",textile:"serat alam Arfak",motif:"papua",palette:["#4d3322","#b76431","#e1bf68"]},
  "Papua Barat Daya":{attire:"Kain Timur",textile:"hias manik Papua",motif:"papua",palette:["#6f2426","#e0ad35","#242923"]},
  Papua:{attire:"Kain Timur & aksesori Papua",textile:"lukis kulit kayu",motif:"papua",palette:["#432f23","#b63c2e","#e5c568"]},
  "Papua Tengah":{attire:"Sali & Noken",textile:"serat anggrek",motif:"papua",palette:["#513121","#b64d32","#d9bc67"]},
  "Papua Pegunungan":{attire:"Rok Rumbai & Noken",textile:"serat alam Baliem",motif:"papua",palette:["#4a3122","#c27c32","#e1c16b"]},
  "Papua Selatan":{attire:"Busana Marind",textile:"ornamen Marind",motif:"papua",palette:["#382d24","#aa332e","#e3d5b4"]},
};

export const FALLBACK_TEXTILE: ProvinceTextile = {attire:"Busana adat Nusantara",textile:"tenun lokal",motif:"weave",palette:["#275e4d","#b7d66b","#e8e1b7"]};
export const PROVINCE_TEXTURE_KEYS: Record<string, string> = {
  Aceh:"aceh", "Sumatera Utara":"sumatera-utara", "Sumatera Barat":"sumatera-barat",
  Riau:"riau", Jambi:"jambi", "Sumatera Selatan":"sumatera-selatan", Bengkulu:"bengkulu",
  Lampung:"lampung", "Kepulauan Bangka Belitung":"bangka-belitung", "Kepulauan Riau":"kepulauan-riau",
  "DKI Jakarta":"dki-jakarta", "Jawa Barat":"jawa-barat", "Jawa Tengah":"jawa-tengah",
  "Daerah Istimewa Yogyakarta":"di-yogyakarta", "Jawa Timur":"jawa-timur", Banten:"banten",
  Bali:"bali", "Nusa Tenggara Barat":"nusa-tenggara-barat", "Nusa Tenggara Timur":"nusa-tenggara-timur",
  "Kalimantan Barat":"kalimantan-barat", "Kalimantan Tengah":"kalimantan-tengah",
  "Kalimantan Selatan":"kalimantan-selatan", "Kalimantan Timur":"kalimantan-timur",
  "Kalimantan Utara":"kalimantan-utara", "Sulawesi Utara":"sulawesi-utara",
  "Sulawesi Tengah":"sulawesi-tengah", "Sulawesi Selatan":"sulawesi-selatan",
  "Sulawesi Tenggara":"sulawesi-tenggara", Gorontalo:"gorontalo", "Sulawesi Barat":"sulawesi-barat",
  Maluku:"maluku", "Maluku Utara":"maluku-utara", "Papua Barat":"papua-barat",
  "Papua Barat Daya":"papua-barat", Papua:"papua", "Papua Tengah":"papua",
  "Papua Pegunungan":"papua", "Papua Selatan":"papua"
};

export function createTextileTexture(province: string, onColor?: (color: THREE.Color) => void) {
  const key = PROVINCE_TEXTURE_KEYS[province] ?? "papua";
  const texture = new THREE.TextureLoader().load(`/textures/provinces/${key}.webp`, (loadedTexture) => {
    if (!onColor) return;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 24;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    context.drawImage(loadedTexture.image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let red = 0, green = 0, blue = 0, samples = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 16) continue;
      red += pixels[index];
      green += pixels[index + 1];
      blue += pixels[index + 2];
      samples += 1;
    }
    if (!samples) return;
    const color = new THREE.Color(
      `rgb(${Math.round(red / samples)}, ${Math.round(green / samples)}, ${Math.round(blue / samples)})`,
    );
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);
    color.setHSL(hsl.h, Math.max(hsl.s, .28), THREE.MathUtils.clamp(hsl.l * .78, .26, .46));
    onColor(color);
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(.34, .34);
  texture.center.set(.5, .5);
  texture.anisotropy = 8;
  return texture;
}