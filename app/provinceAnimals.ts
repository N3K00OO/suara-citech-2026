import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export type AnimalAssetKey = "elephant" | "manta" | "orangutan" | "rhino";
export type AnimalCredit = { label:string; creator:string; license:string; source:string };
export const PROVINCE_ANIMALS: Record<string, AnimalAssetKey> = { Aceh:"orangutan", Lampung:"elephant", Banten:"rhino", "Kalimantan Tengah":"orangutan", "Papua Barat Daya":"manta", "Sulawesi Tenggara":"manta" };
export const ANIMAL_CREDITS: Record<AnimalAssetKey, AnimalCredit> = {
  elephant:{label:"Gajah",creator:"jeremy",license:"CC BY 3.0",source:"https://poly.pizza/m/9J-cG39KYFC"},
  orangutan:{label:"Orangutan",creator:"cameron_",license:"CC BY 3.0",source:"https://poly.pizza/m/kD8hdFa32e"},
  rhino:{label:"Badak",creator:"Tom VanAntwerp",license:"CC BY 3.0",source:"https://poly.pizza/m/9deYXdpoeTC"},
  manta:{label:"Pari manta",creator:"Quaternius",license:"CC0",source:"https://quaternius.com/packs/animatedfish.html"},
};
const files:Record<AnimalAssetKey,string>={elephant:"/models/animals/elephant.glb",orangutan:"/models/animals/orangutan.glb",rhino:"/models/animals/rhino.glb",manta:"/models/animals/manta.obj"};
const cache=new Map<AnimalAssetKey,Promise<THREE.Group>>();
function normalize(model:THREE.Group,key:AnimalAssetKey){
  model.updateMatrixWorld(true);const size=new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());const longest=Math.max(size.x,size.y,size.z)||1;model.scale.multiplyScalar((key==="manta"?.31:.28)/longest);model.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(model);const center=box.getCenter(new THREE.Vector3());model.position.x-=center.x;model.position.z-=center.z;model.position.y+=.095-box.min.y;
  if(key==="manta"){model.rotation.y=Math.PI*.18;model.position.y+=.08;}
  model.traverse(child=>{if(child instanceof THREE.Mesh&&key==="manta")child.material=new THREE.MeshStandardMaterial({color:0x4ca4a1,emissive:0x0b3531,emissiveIntensity:.3,roughness:.55});});return model;
}
function load(key:AnimalAssetKey){const found=cache.get(key);if(found)return found;const promise=key==="manta"?new OBJLoader().loadAsync(files[key]).then(model=>normalize(model,key)):new GLTFLoader().loadAsync(files[key]).then(result=>normalize(result.scene,key));cache.set(key,promise);return promise;}
export async function loadProvinceAnimal(province:string){const key=PROVINCE_ANIMALS[province];if(!key)return null;const model=(await load(key)).clone(true);model.userData.assetKey=key;model.userData.credit=ANIMAL_CREDITS[key];return model;}
export function getProvinceAnimalCredit(province:string){const key=PROVINCE_ANIMALS[province];return key?ANIMAL_CREDITS[key]:null;}