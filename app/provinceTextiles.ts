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

export function createTextileTexture(t: ProvinceTextile, index: number) {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
  const c = canvas.getContext("2d"); if (!c) return null;
  const [base, ink, hi] = t.palette; c.fillStyle = base; c.fillRect(0,0,128,128); c.lineCap="round"; c.lineJoin="round";
  const diamond = (size:number) => { c.strokeStyle=ink; c.lineWidth=4; for(let y=-size;y<144;y+=size) for(let x=-size;x<144;x+=size){ c.beginPath(); c.moveTo(x,y+size/2); c.lineTo(x+size/2,y); c.lineTo(x+size,y+size/2); c.lineTo(x+size/2,y+size); c.closePath(); c.stroke(); } };
  if(t.motif==="songket"||t.motif==="geometric"){
    diamond(t.motif==="songket"?30:24); c.fillStyle=hi; for(let y=15;y<128;y+=30) for(let x=15;x<128;x+=30){c.beginPath();c.arc(x,y,3.5,0,Math.PI*2);c.fill();}
  } else if(t.motif==="batik"||t.motif==="floral"){
    c.strokeStyle=ink;c.lineWidth=3;for(let y=16;y<144;y+=32)for(let x=16;x<144;x+=32){for(let p=0;p<4;p++){c.save();c.translate(x,y);c.rotate(p*Math.PI/2);c.beginPath();c.ellipse(0,-7,5,10,0,0,Math.PI*2);c.stroke();c.restore();}c.fillStyle=hi;c.beginPath();c.arc(x,y,2.5,0,Math.PI*2);c.fill();}
  } else if(t.motif==="ikat"||t.motif==="papua"){
    c.strokeStyle=ink;c.lineWidth=t.motif==="ikat"?7:5;for(let y=10;y<140;y+=28){c.beginPath();for(let x=-10;x<145;x+=16)c.lineTo(x,y+((x/16)%2?10:-2));c.stroke();}c.fillStyle=hi;for(let y=16;y<128;y+=28)for(let x=8;x<128;x+=32){c.beginPath();c.arc(x,y,t.motif==="papua"?4:2.5,0,Math.PI*2);c.fill();}
  } else if(t.motif==="plaid"){
    c.globalAlpha=.72;c.fillStyle=ink;for(let n=0;n<128;n+=32){c.fillRect(n,0,9,128);c.fillRect(0,n,128,9);}c.globalAlpha=1;c.strokeStyle=hi;c.lineWidth=2;for(let n=16;n<128;n+=32){c.beginPath();c.moveTo(n,0);c.lineTo(n,128);c.stroke();c.beginPath();c.moveTo(0,n);c.lineTo(128,n);c.stroke();}
  } else {
    c.strokeStyle=ink;c.lineWidth=t.motif==="stripe"?9:3;for(let n=-32;n<160;n+=t.motif==="stripe"?24:12){c.beginPath();if(t.motif==="stripe"){c.moveTo(n,0);c.lineTo(n+42,128);}else{c.moveTo(n,0);c.lineTo(n,128);c.moveTo(0,n);c.lineTo(128,n);}c.stroke();}c.strokeStyle=hi;c.lineWidth=2;for(let n=6;n<128;n+=24){c.beginPath();c.moveTo(0,n);c.lineTo(128,n);c.stroke();}
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; texture.wrapS=texture.wrapT=THREE.RepeatWrapping; texture.repeat.set(2.2+(index%3)*.25,2.2+(index%2)*.3); texture.rotation=(index%4)*.06; texture.center.set(.5,.5); texture.anisotropy=4; return texture;
}