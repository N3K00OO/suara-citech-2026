"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { FALLBACK_STYLE, PROVINCE_STYLES, type ProvinceStyle } from "../provinceStyles";
import { createProvinceMiniature } from "../provinceMiniatures";
import { createTextileTexture } from "../provinceTextiles";
import { loadProvinceAnimal } from "../provinceAnimals";

type Position = [number, number];
type ProvinceFeature = {
  properties: { PROVINSI: string; KODE_PROV: number };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: Position[][] | Position[][][] };
};
type ProvinceCollection = { features: ProvinceFeature[] };

const CENTER = { lon: 118.2, lat: -2.4 };
const SCALE = 0.5;
const DEFAULT_PROVINCE = "DKI Jakarta";
const cities = [
  [106.8456, -6.2088], [98.6722, 3.5952], [112.7521, -7.2575],
  [119.4327, -5.1477], [140.7181, -2.5916],
] as Position[];
const beacons: Position[] = [
  ...cities,
  [104.455, 0.9186], [106.1169, -2.1291], [109.3425, -0.0263],
  [116.8312, -1.2379], [124.8421, 1.4748], [128.1814, -3.6954],
  [123.607, -10.1772],
];

function project([lon, lat]: Position) {
  return { x: (lon - CENTER.lon) * SCALE, y: (lat - CENTER.lat) * SCALE };
}
function featureRings(feature: ProvinceFeature): Position[][][] {
  return feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates as Position[][]]
    : feature.geometry.coordinates as Position[][][];
}
function makeShape(rings: Position[][]) {
  const shape = new THREE.Shape();
  rings[0]?.forEach((point, i) => {
    const p = project(point);
    if (i === 0) shape.moveTo(p.x, p.y); else shape.lineTo(p.x, p.y);
  });
  rings.slice(1).forEach((ring) => {
    const hole = new THREE.Path();
    ring.forEach((point, i) => {
      const p = project(point);
      if (i === 0) hole.moveTo(p.x, p.y); else hole.lineTo(p.x, p.y);
    });
    shape.holes.push(hole);
  });
  return shape;
}
function featureCenter(feature: ProvinceFeature) {
  const points = featureRings(feature).flatMap((polygon) => polygon[0] || []);
  if (!points.length) return new THREE.Vector3();
  const sum = points.reduce((acc, point) => {
    const p = project(point);
    return { x: acc.x + p.x, y: acc.y + p.y };
  }, { x: 0, y: 0 });
  return new THREE.Vector3(sum.x / points.length, 0, -sum.y / points.length);
}

export function IndonesiaMap() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x061815, 0.028);
    const camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 13.4, 18.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .94;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-label", "Peta 3D interaktif 38 provinsi Indonesia. Seret untuk menggeser, klik kanan untuk memutar, dan gulir untuk memperbesar.");
    renderer.domElement.tabIndex = 0;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
    controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
    controls.touches.ONE = THREE.TOUCH.PAN;
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
    controls.minDistance = 7;
    controls.maxDistance = 36;
    controls.maxPolarAngle = Math.PI / 2.1;

    const world = new THREE.Group();
    world.rotation.y = -0.025;
    scene.add(world);
    scene.add(new THREE.HemisphereLight(0xb8e9ce, 0x04100d, .78));
    const sun = new THREE.DirectionalLight(0xffcf82, 5.4);
    sun.position.set(-10, 18, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 55;
    sun.shadow.camera.left = -25;
    sun.shadow.camera.right = 25;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.bias = -.00045;
    sun.shadow.normalBias = .025;
    scene.add(sun, sun.target);
    const rim = new THREE.DirectionalLight(0x57d7aa, 2.35);
    rim.position.set(14, 9, -12);
    scene.add(rim);
    const warmFill = new THREE.PointLight(0xd47a32, 2.2, 30, 2);
    warmFill.position.set(-12, 7, 7);
    scene.add(warmFill);

    const ocean = new THREE.Mesh(
      new THREE.CircleGeometry(27, 96),
      new THREE.MeshPhysicalMaterial({ color: 0x092d29, transparent: true, opacity: 0.82, roughness: 0.35, clearcoat: 0.7 }),
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.07;
    ocean.receiveShadow = true;
    world.add(ocean);

    const scanRings = new THREE.Group();
    [8, 12, 17, 22].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius, radius + 0.018, 128),
        new THREE.MeshBasicMaterial({ color: index % 2 ? 0x1a5f4f : 0xbddf5b, transparent: true, opacity: index === 0 ? 0.22 : 0.1, side: THREE.DoubleSide }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.045;
      scanRings.add(ring);
    });
    world.add(scanRings);

    const dustCount = 550;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      const radius = 5 + Math.random() * 25;
      const angle = Math.random() * Math.PI * 2;
      dustPositions[i * 3] = Math.cos(angle) * radius;
      dustPositions[i * 3 + 1] = Math.random() * 4 + 0.1;
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x8be7b2, size: 0.026, transparent: true, opacity: 0.48 }));
    scene.add(dust);

    const meshes: THREE.Mesh[] = [];
    const textures: THREE.Texture[] = [];
    const boundaryGeometries: LineGeometry[] = [];
    const routeGeometries: THREE.BufferGeometry[] = [];
    const routeCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcf77,
      transparent: true,
      opacity: .76,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const routeGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa45,
      transparent: true,
      opacity: .12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const routePulseGeometry = new THREE.SphereGeometry(.052, 14, 14);
    const routePulseMaterial = new THREE.MeshBasicMaterial({
      color: 0xffe2a0,
      transparent: true,
      opacity: .94,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const routePulses: Array<{
      mesh: THREE.Mesh;
      curve: THREE.QuadraticBezierCurve3;
      offset: number;
    }> = [];
    const provinceBoundaryMaterial = new LineMaterial({
      color: 0xd1a252,
      linewidth: 1.1,
      transparent: true,
      opacity: .68,
      depthWrite: false,
      toneMapped: false,
      alphaToCoverage: true,
    });
    provinceBoundaryMaterial.resolution.set(container.clientWidth, container.clientHeight);
    const centers = new Map<string, THREE.Vector3>();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(20, 20);
    let hovered: THREE.Mesh | null = null;
    let selected: THREE.Mesh | null = null;
    let targetCamera = camera.position.clone();
    let targetLookAt = controls.target.clone();
    let cameraTransitionActive = false;
    let pointerIsDown = false;
    let dragged = false;
    const dragStart = new THREE.Vector2();
    let disposed = false;
    const onControlsStart = () => { cameraTransitionActive = false; };
    const onControlsEnd = () => {
      targetCamera.copy(camera.position);
      targetLookAt.copy(controls.target);
    };
    controls.addEventListener("start", onControlsStart);
    controls.addEventListener("end", onControlsEnd);
    const resetMaterial = (mesh: THREE.Mesh | null) => {
      if (!mesh) return;
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      const style = (mesh.userData.style as ProvinceStyle) ?? FALLBACK_STYLE;
      const baseColor = new THREE.Color(mesh.userData.baseColor ?? style.color);
      material.color.copy(baseColor);
      if (mesh === selected) material.color.offsetHSL(0, .03, .1);
      material.emissive.copy(baseColor);
      material.emissiveIntensity = mesh === selected ? .22 : .06;
      material.clearcoat = mesh === selected ? .68 : .28;
    };
    const selectProvince = (name: string, moveCamera = true) => {
      const mesh = meshes.find((item) => item.userData.name === name);
      if (!mesh) return;
      if (selected && selected !== mesh) resetMaterial(selected);
      selected = mesh;
      resetMaterial(selected);
      if (moveCamera) {
        const center = centers.get(name) || new THREE.Vector3();
        targetLookAt = center.clone();
        targetCamera = new THREE.Vector3(center.x, 7.5, center.z + 10.5);
        cameraTransitionActive = true;
      }
    };

    fetch("/indonesia-provinces.geojson")
      .then((response) => response.json() as Promise<ProvinceCollection>)
      .then((data) => {
        if (disposed) return;
        const names = data.features.map((f) => f.properties.PROVINSI).sort((a, b) => a.localeCompare(b, "id"));
        data.features.forEach((feature, index) => {
          const name = feature.properties.PROVINSI;
          const style = PROVINCE_STYLES[name] ?? FALLBACK_STYLE;
          const geometry = new THREE.ExtrudeGeometry(featureRings(feature).map(makeShape), {
            depth: style.depth, bevelEnabled: true, bevelSize: 0.035,
            bevelThickness: 0.045, bevelSegments: 2, curveSegments: 2,
          });
          geometry.rotateX(-Math.PI / 2);
          const material = new THREE.MeshPhysicalMaterial({
            color: style.color,
            roughness: style.category === "Bahari" ? .46 : .62,
            metalness: style.category === "Kota" ? .14 : .025,
            clearcoat: .28,
            emissive: style.emissive,
            emissiveIntensity: .06,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData.name = name;
          mesh.userData.style = style;
          world.add(mesh);
          meshes.push(mesh);
          const textileTexture = createTextileTexture(name, (color) => {
            if (disposed) return;
            mesh.userData.baseColor = color.getHex();
            resetMaterial(mesh);
          });
          textures.push(textileTexture);
          if (textileTexture) {
            const textileTop = new THREE.Mesh(
              new THREE.ShapeGeometry(featureRings(feature).map(makeShape)),
              new THREE.MeshStandardMaterial({
                color: 0xffffff,
                map: textileTexture,
                transparent: true,
                opacity: .72,
                roughness: .82,
                metalness: .015,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: -2,
              }),
            );
            textileTop.geometry.rotateX(-Math.PI / 2);
            textileTop.position.y = style.depth + .052;
            textileTop.receiveShadow = true;
            world.add(textileTop);
          }
          featureRings(feature).forEach((polygon) => {
            const ring = polygon[0];
            if (!ring || ring.length < 3) return;
            const projectedRing = ring.map(project);
            let twiceArea = 0;
            projectedRing.forEach((point, pointIndex) => {
              const next = projectedRing[(pointIndex + 1) % projectedRing.length];
              twiceArea += point.x * next.y - next.x * point.y;
            });
            if (Math.abs(twiceArea) < .002) return;
            const positions: number[] = [];
            projectedRing.forEach((point) => {
              positions.push(point.x, style.depth + .06, -point.y);
            });
            const first = projectedRing[0];
            positions.push(first.x, style.depth + .06, -first.y);
            const outlineGeometry = new LineGeometry();
            outlineGeometry.setPositions(positions);
            boundaryGeometries.push(outlineGeometry);
            const outline = new Line2(outlineGeometry, provinceBoundaryMaterial);
            outline.renderOrder = 5;
            world.add(outline);
          });
          const center = featureCenter(feature);
          centers.set(name, center);

          const miniature = createProvinceMiniature(style);
          miniature.position.set(center.x, style.depth + .055, center.z);
          miniature.scale.multiplyScalar(name === "DKI Jakarta" ? .72 : .9 + (index % 3) * .06);
          miniature.userData.provinceMiniature = true;
          miniature.userData.baseY = style.depth + .055;
          miniature.userData.offset = index * .47;
          miniature.traverse((child) => {
            child.userData.provinceName = name;
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          world.add(miniature);
          loadProvinceAnimal(name).then((animal) => {
            if (!animal || disposed) return;
            animal.userData.provinceAnimal = true;
            animal.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            miniature.add(animal);
          }).catch(() => undefined);

          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry, 14),
            new THREE.LineBasicMaterial({ color: 0xd8ae63, transparent: true, opacity: .48, toneMapped: false }),
          );
          edges.position.y = .006;
          world.add(edges);
        });
        beacons.forEach((beacon, index) => {
          const p = project(beacon);
          const marker = new THREE.Group();
          marker.position.set(p.x, 0.4, -p.y);
          const base = new THREE.Mesh(
            new THREE.CylinderGeometry(.11, .19, .16, 24),
            new THREE.MeshStandardMaterial({ color: 0xb27a25, emissive: 0xff9f32, emissiveIntensity: .42, roughness: .48, metalness: .35 }),
          );
          base.position.y = .08;
          const core = new THREE.Mesh(
            new THREE.OctahedronGeometry(.075, 0),
            new THREE.MeshBasicMaterial({ color: 0xffe0a0, toneMapped: false }),
          );
          core.position.y = .24;
          const halo = new THREE.Mesh(
            new THREE.RingGeometry(.16, .21, 32),
            new THREE.MeshBasicMaterial({ color: 0xffc762, transparent: true, opacity: .62, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
          );
          const beamGlow = new THREE.Mesh(
            new THREE.CylinderGeometry(.035, .065, 1.24, 12),
            new THREE.MeshBasicMaterial({ color: 0xffa941, transparent: true, opacity: .1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
          );
          beamGlow.position.y = .82;
          const beam = new THREE.Mesh(
            new THREE.CylinderGeometry(.006, .016, 1.18, 8),
            new THREE.MeshBasicMaterial({ color: 0xffd88a, transparent: true, opacity: .78, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
          );
          beam.position.y = .82;
          const tip = new THREE.Mesh(
            new THREE.SphereGeometry(.035, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xffedbc, blending: THREE.AdditiveBlending, toneMapped: false }),
          );
          tip.position.y = 1.43;
          const markerLight = new THREE.PointLight(0xffb854, index < cities.length ? 2.2 : 1.45, 2.8, 2);
          markerLight.position.y = .28;
          halo.rotation.x = -Math.PI / 2;
          halo.position.y = .012;
          marker.add(base, halo, core, beamGlow, beam, tip, markerLight);
          marker.userData.offset = Math.random() * Math.PI * 2;
          world.add(marker);
        });
        const routes = [
          [1, 0],
          [0, 2],
          [0, 3],
          [2, 3],
          [3, 4],
        ] as const;
        routes.forEach(([fromIndex, toIndex], index) => {
          const from = project(cities[fromIndex]);
          const to = project(cities[toIndex]);
          const start = new THREE.Vector3(from.x, .67, -from.y);
          const end = new THREE.Vector3(to.x, .67, -to.y);
          const distance = start.distanceTo(end);
          const control = start.clone().lerp(end, .5);
          control.y = 1.04 + distance * .09;
          const curve = new THREE.QuadraticBezierCurve3(start, control, end);
          const coreGeometry = new THREE.TubeGeometry(curve, 56, .012, 5, false);
          const glowGeometry = new THREE.TubeGeometry(curve, 56, .04, 6, false);
          routeGeometries.push(coreGeometry, glowGeometry);
          world.add(
            new THREE.Mesh(glowGeometry, routeGlowMaterial),
            new THREE.Mesh(coreGeometry, routeCoreMaterial),
          );
          const pulse = new THREE.Mesh(routePulseGeometry, routePulseMaterial);
          pulse.position.copy(curve.getPointAt(index / routes.length));
          world.add(pulse);
          routePulses.push({ mesh: pulse, curve, offset: index / routes.length });
        });
        const initial = meshes.some((mesh) => mesh.userData.name === DEFAULT_PROVINCE) ? DEFAULT_PROVINCE : names[0];
        selectProvince(initial, false);
      })
      .catch(() => undefined);

    const onPointerDown = (event: PointerEvent) => {
      pointerIsDown = true;
      dragged = false;
      dragStart.set(event.clientX, event.clientY);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      if (pointerIsDown && deltaX * deltaX + deltaY * deltaY > 25) dragged = true;
    };
    const onPointerUp = () => { pointerIsDown = false; };
    const onPointerLeave = () => {
      pointerIsDown = false;
      pointer.set(20, 20);
      if (hovered && hovered !== selected) resetMaterial(hovered);
      hovered = null;
      renderer.domElement.style.cursor = "grab";
    };
    const onClick = () => {
      if (!dragged && hovered) selectProvince(hovered.userData.name);
      dragged = false;
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("click", onClick);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      dust.rotation.y = elapsed * 0.012;
      scanRings.rotation.y = elapsed * -0.006;
      routePulses.forEach(({ mesh, curve, offset }, index) => {
        const t = (elapsed * .075 + offset) % 1;
        mesh.position.copy(curve.getPointAt(t));
        mesh.scale.setScalar(.82 + Math.sin(elapsed * 5 + index) * .16);
      });
      world.children.forEach((child) => {
        if (!(child instanceof THREE.Group)) return;
        if (child.userData.provinceMiniature) {
          child.position.y = child.userData.baseY + Math.sin(elapsed * 1.2 + child.userData.offset) * .014;
          child.rotation.y = Math.sin(elapsed * .55 + child.userData.offset) * .08;
          const towerPulse = 1 + Math.sin(elapsed * 3.1 + child.userData.offset) * .22;
          child.traverse((node) => {
            if (node.userData.towerBeacon) node.scale.setScalar(towerPulse);
          });
        } else if (child.userData.offset !== undefined) {
          const pulse = 1 + Math.sin(elapsed * 2.2 + child.userData.offset) * .24;
          child.children[1]?.scale.setScalar(pulse);
          child.children[2]?.scale.setScalar(.9 + (pulse - 1) * .5);
          child.children[5]?.scale.setScalar(.84 + (pulse - 1) * .7);
        }
      });
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes, false)[0]?.object as THREE.Mesh | undefined;
      if (hit !== hovered) {
        if (hovered && hovered !== selected) resetMaterial(hovered);
        hovered = hit || null;
        if (hovered && hovered !== selected) {
          const material = hovered.material as THREE.MeshPhysicalMaterial;
          const style = (hovered.userData.style as ProvinceStyle) ?? FALLBACK_STYLE;
          const baseColor = new THREE.Color(hovered.userData.baseColor ?? style.color);
          material.color.copy(baseColor).offsetHSL(0, .04, .1);
          material.emissive.copy(baseColor);
          material.emissiveIntensity = .2;
        }
        renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
      }
      if (cameraTransitionActive) {
        camera.position.lerp(targetCamera, .045);
        controls.target.lerp(targetLookAt, .045);
        if (camera.position.distanceToSquared(targetCamera) < .0001 && controls.target.distanceToSquared(targetLookAt) < .0001) {
          cameraTransitionActive = false;
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      provinceBoundaryMaterial.resolution.set(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("start", onControlsStart);
      controls.removeEventListener("end", onControlsEnd);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("click", onClick);
      controls.dispose();
      textures.forEach((texture) => texture.dispose());
      boundaryGeometries.forEach((geometry) => geometry.dispose());
      routeGeometries.forEach((geometry) => geometry.dispose());
      provinceBoundaryMaterial.dispose();
      routeCoreMaterial.dispose();
      routeGlowMaterial.dispose();
      routePulseGeometry.dispose();
      routePulseMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="map-experience">
      <div className="map-stage" ref={mountRef} />
    </section>
  );
}
