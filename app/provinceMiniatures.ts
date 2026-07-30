import * as THREE from "three";
import type { ProvinceStyle } from "./provinceStyles";

export function createProvinceMiniature(style: ProvinceStyle) {
  const group = new THREE.Group();
  const accent = new THREE.MeshStandardMaterial({ color: style.accent, emissive: style.emissive, emissiveIntensity: .4, roughness: .4, metalness: .16 });
  const body = new THREE.MeshStandardMaterial({ color: style.color, emissive: style.emissive, emissiveIntensity: .25, roughness: .7 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x17352d, roughness: .8 });
  const add = (geometry: THREE.BufferGeometry, material = body, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };
  const base = add(new THREE.CylinderGeometry(.19, .23, .045, 20), dark, 0, .022, 0);
  base.userData.isPedestal = true;
  const orbit = add(new THREE.TorusGeometry(.22, .009, 6, 30), accent, 0, .05, 0);
  orbit.rotation.x = Math.PI / 2;

  if (style.model === "forest") {
    [-.1, 0, .1].forEach((x, i) => {
      add(new THREE.CylinderGeometry(.018, .025, .12, 8), dark, x, .12, i === 1 ? -.02 : .03);
      add(new THREE.ConeGeometry(.09 - i * .01, .22, 10), body, x, .25, i === 1 ? -.02 : .03);
    });
  } else if (style.model === "lake") {
    const water = add(new THREE.CylinderGeometry(.15, .17, .025, 28), accent, 0, .075, 0);
    water.scale.z = .65;
    const rim = add(new THREE.TorusGeometry(.16, .022, 7, 28), body, 0, .09, 0);
    rim.rotation.x = Math.PI / 2;
    rim.scale.z = .65;
  } else if (style.model === "gadang") {
    add(new THREE.BoxGeometry(.25, .13, .14), body, 0, .15, 0);
    [-.09, 0, .09].forEach((x) => {
      const roof = add(new THREE.ConeGeometry(.115, .17, 4), accent, x, .29, 0);
      roof.rotation.y = Math.PI / 4;
      roof.scale.z = .55;
    });
    [-.08, .08].forEach((x) => add(new THREE.CylinderGeometry(.015, .015, .08, 6), dark, x, .065, 0));
  } else if (style.model === "house") {
    add(new THREE.BoxGeometry(.25, .14, .17), body, 0, .15, 0);
    const roof = add(new THREE.ConeGeometry(.19, .16, 4), accent, 0, .29, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = .72;
    [-.09, .09].forEach((x) => add(new THREE.CylinderGeometry(.013, .013, .09, 6), dark, x, .07, .04));
  } else if (style.model === "honai") {
    add(new THREE.CylinderGeometry(.13, .15, .13, 16), body, 0, .14, 0);
    add(new THREE.ConeGeometry(.19, .22, 20), accent, 0, .31, 0);
  } else if (style.model === "monument") {
    add(new THREE.CylinderGeometry(.055, .085, .28, 10), body, 0, .2, 0);
    add(new THREE.ConeGeometry(.065, .15, 8), accent, 0, .41, 0);
    add(new THREE.BoxGeometry(.24, .04, .17), dark, 0, .075, 0);
  } else if (style.model === "temple") {
    add(new THREE.BoxGeometry(.29, .06, .24), body, 0, .085, 0);
    add(new THREE.BoxGeometry(.22, .07, .18), body, 0, .15, 0);
    add(new THREE.BoxGeometry(.14, .08, .12), accent, 0, .225, 0);
    add(new THREE.ConeGeometry(.075, .13, 4), accent, 0, .33, 0).rotation.y = Math.PI / 4;
  } else if (style.model === "volcano") {
    const mountain = add(new THREE.ConeGeometry(.2, .34, 18), body, 0, .23, 0);
    mountain.scale.z = .82;
    const crater = add(new THREE.TorusGeometry(.045, .014, 6, 20), accent, 0, .4, 0);
    crater.rotation.x = Math.PI / 2;
  } else if (style.model === "animal") {
    const torso = add(new THREE.SphereGeometry(.11, 12, 10), body, -.025, .18, 0);
    torso.scale.set(1.35, .75, .72);
    add(new THREE.SphereGeometry(.065, 12, 10), accent, .13, .2, 0);
    [-.1, .02, .1].forEach((x) => add(new THREE.CylinderGeometry(.012, .016, .11, 6), dark, x, .09, x % .02));
    const tail = add(new THREE.CylinderGeometry(.009, .009, .14, 6), accent, -.18, .2, 0);
    tail.rotation.z = Math.PI / 3;
  } else if (style.model === "bridge") {
    add(new THREE.BoxGeometry(.38, .035, .08), accent, 0, .18, 0);
    [-.13, .13].forEach((x) => {
      add(new THREE.BoxGeometry(.035, .27, .055), body, x, .2, 0);
      add(new THREE.BoxGeometry(.07, .025, .07), accent, x, .34, 0);
    });
  } else if (style.model === "islands") {
    [[-.1,.12,.03],[.04,.1,-.04],[.12,.08,.05],[-.02,.07,.1]].forEach(([x,y,z], i) => {
      const island = add(new THREE.IcosahedronGeometry(.075 - i * .008, 1), i % 2 ? accent : body, x, y, z);
      island.scale.y = .45;
    });
  } else if (style.model === "boat") {
    const hull = add(new THREE.BoxGeometry(.32, .07, .1), body, 0, .12, 0);
    hull.rotation.z = -.08;
    add(new THREE.CylinderGeometry(.012, .012, .3, 6), dark, 0, .27, 0);
    const sail = add(new THREE.ConeGeometry(.15, .27, 3), accent, .07, .29, 0);
    sail.rotation.z = -.08;
    sail.rotation.y = Math.PI / 2;
    sail.scale.z = .16;
  } else if (style.model === "coral") {
    [-.09, 0, .09].forEach((x, i) => {
      const stem = add(new THREE.CylinderGeometry(.018, .026, .2 + i * .035, 7), i === 1 ? accent : body, x, .17, 0);
      stem.rotation.z = (i - 1) * .24;
      const branch = add(new THREE.CylinderGeometry(.013, .017, .12, 7), accent, x + (i - 1) * .035, .22, 0);
      branch.rotation.z = (i - 1) * -.8;
    });
  } else if (style.model === "flower") {
    add(new THREE.SphereGeometry(.065, 12, 8), accent, 0, .16, 0);
    for (let i = 0; i < 7; i += 1) {
      const angle = i / 7 * Math.PI * 2;
      const petal = add(new THREE.SphereGeometry(.075, 10, 7), body, Math.cos(angle) * .1, .16, Math.sin(angle) * .1);
      petal.scale.set(1.15, .45, .75);
    }
  } else if (style.model === "terrace") {
    [0, 1, 2].forEach((i) => {
      const level = add(new THREE.CylinderGeometry(.18 - i * .045, .2 - i * .045, .06, 18, 1, false, 0, Math.PI * 1.7), i === 2 ? accent : body, 0, .08 + i * .055, 0);
      level.scale.z = .7;
    });
  } else if (style.model === "stone") {
    [[-.09,.13,.02],[.04,.17,-.03],[.11,.11,.06]].forEach(([x,y,z], i) => {
      const stone = add(new THREE.DodecahedronGeometry(.075 + i * .012, 0), i === 1 ? accent : body, x, y, z);
      stone.scale.y = 1.5;
    });
  }

  group.traverse((child) => {
    if (child instanceof THREE.Mesh) child.userData.isMiniature = true;
  });
  group.scale.setScalar(.9);
  return group;
}