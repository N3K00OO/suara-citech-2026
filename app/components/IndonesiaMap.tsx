"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FALLBACK_STYLE, PROVINCE_STYLES, type ProvinceStyle } from "../provinceStyles";
import { createProvinceMiniature } from "../provinceMiniatures";
import { createTextileTexture, FALLBACK_TEXTILE, PROVINCE_TEXTILES, PROVINCE_TEXTURE_KEYS } from "../provinceTextiles";
import { getProvinceAnimalCredit, loadProvinceAnimal } from "../provinceAnimals";

type Position = [number, number];
type ProvinceFeature = {
  properties: { PROVINSI: string; KODE_PROV: number };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: Position[][] | Position[][][] };
};
type ProvinceCollection = { features: ProvinceFeature[] };

const CENTER = { lon: 118.2, lat: -2.4 };
const SCALE = 0.5;
const DEFAULT_PROVINCE = "DKI Jakarta";
const presets = [
  { label: "Nusantara", target: [0, 0, 0], camera: [0, 15, 21] },
  { label: "Jawa", target: [-2.4, 0, 1.6], camera: [-2.4, 7, 10] },
  { label: "Papua", target: [9.5, 0, -0.2], camera: [9.5, 8, 11] },
];
const cities = [
  [106.8456, -6.2088], [98.6722, 3.5952], [112.7521, -7.2575],
  [119.4327, -5.1477], [140.7181, -2.5916],
] as Position[];

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
  const api = useRef<{
    focus: (target: number[], camera: number[]) => void;
    select: (name: string) => void;
  } | null>(null);
  const [provinceNames, setProvinceNames] = useState<string[]>([]);
  const [activeProvince, setActiveProvince] = useState(DEFAULT_PROVINCE);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const activeIndex = useMemo(
    () => Math.max(0, provinceNames.indexOf(activeProvince)),
    [activeProvince, provinceNames],
  );
  const activeStyle = PROVINCE_STYLES[activeProvince] ?? FALLBACK_STYLE;
  const activeTextile = PROVINCE_TEXTILES[activeProvince] ?? FALLBACK_TEXTILE;
  const activeTextureKey = PROVINCE_TEXTURE_KEYS[activeProvince] ?? "papua";
  const activeAnimalCredit = getProvinceAnimalCredit(activeProvince);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x061815, 0.028);
    const camera = new THREE.PerspectiveCamera(34, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 15, 21);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.setAttribute("aria-label", "Peta 3D interaktif 38 provinsi Indonesia. Seret untuk memutar dan gulir untuk memperbesar.");
    renderer.domElement.tabIndex = 0;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 36;
    controls.maxPolarAngle = Math.PI / 2.1;

    const world = new THREE.Group();
    world.rotation.y = -0.025;
    scene.add(world);
    scene.add(new THREE.HemisphereLight(0xc5ffe2, 0x09221d, 2.3));
    const sun = new THREE.DirectionalLight(0xfff1bd, 4.2);
    sun.position.set(-8, 18, 11);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x55ffc4, 2.1);
    rim.position.set(13, 8, -10);
    scene.add(rim);

    const ocean = new THREE.Mesh(
      new THREE.CircleGeometry(27, 96),
      new THREE.MeshPhysicalMaterial({ color: 0x092d29, transparent: true, opacity: 0.82, roughness: 0.35, clearcoat: 0.7 }),
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.07;
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
    const centers = new Map<string, THREE.Vector3>();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(20, 20);
    let hovered: THREE.Mesh | null = null;
    let selected: THREE.Mesh | null = null;
    let targetCamera = camera.position.clone();
    let targetLookAt = controls.target.clone();
    let disposed = false;
    const resetMaterial = (mesh: THREE.Mesh | null) => {
      if (!mesh) return;
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      const style = (mesh.userData.style as ProvinceStyle) ?? FALLBACK_STYLE;
      material.color.set(mesh === selected ? style.accent : style.color);
      material.emissive.set(style.emissive);
      material.emissiveIntensity = mesh === selected ? 0.9 : 0.34;
      material.clearcoat = mesh === selected ? 0.8 : 0.35;
    };
    const selectProvince = (name: string, moveCamera = true) => {
      const mesh = meshes.find((item) => item.userData.name === name);
      if (!mesh) return;
      if (selected && selected !== mesh) resetMaterial(selected);
      selected = mesh;
      resetMaterial(selected);
      setActiveProvince(name);
      if (moveCamera) {
        const center = centers.get(name) || new THREE.Vector3();
        targetLookAt = center.clone();
        targetCamera = new THREE.Vector3(center.x, 7.5, center.z + 10.5);
      }
    };

    fetch("/indonesia-provinces.geojson")
      .then((response) => response.json() as Promise<ProvinceCollection>)
      .then((data) => {
        if (disposed) return;
        const names = data.features.map((f) => f.properties.PROVINSI).sort((a, b) => a.localeCompare(b, "id"));
        setProvinceNames(names);
        data.features.forEach((feature, index) => {
          const name = feature.properties.PROVINSI;
          const style = PROVINCE_STYLES[name] ?? FALLBACK_STYLE;
          const geometry = new THREE.ExtrudeGeometry(featureRings(feature).map(makeShape), {
            depth: style.depth, bevelEnabled: true, bevelSize: 0.035,
            bevelThickness: 0.045, bevelSegments: 2, curveSegments: 2,
          });
          geometry.rotateX(-Math.PI / 2);
          const textile = PROVINCE_TEXTILES[name] ?? FALLBACK_TEXTILE;
          const textileTexture = createTextileTexture(textile, index, name);
          if (textileTexture) textures.push(textileTexture);
          const material = new THREE.MeshPhysicalMaterial({
            color: style.color,
            roughness: style.category === "Bahari" ? .42 : .72,
            metalness: style.category === "Kota" ? .3 : .06,
            clearcoat: .35,
            emissive: style.emissive,
            emissiveIntensity: .34,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.userData.name = name;
          mesh.userData.style = style;
          world.add(mesh);
          meshes.push(mesh);
          if (textileTexture) {
            const textileTop = new THREE.Mesh(
              new THREE.ShapeGeometry(featureRings(feature).map(makeShape)),
              new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: textileTexture,
                transparent: true,
                opacity: .68,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: -2,
              }),
            );
            textileTop.geometry.rotateX(-Math.PI / 2);
            textileTop.position.y = style.depth + .052;
            world.add(textileTop);
          }
          const center = featureCenter(feature);
          centers.set(name, center);

          const miniature = createProvinceMiniature(style);
          miniature.position.set(center.x, style.depth + .055, center.z);
          miniature.scale.multiplyScalar(name === "DKI Jakarta" ? .72 : .9 + (index % 3) * .06);
          miniature.userData.provinceMiniature = true;
          miniature.userData.baseY = style.depth + .055;
          miniature.userData.offset = index * .47;
          miniature.traverse((child) => { child.userData.provinceName = name; });
          world.add(miniature);
          loadProvinceAnimal(name).then((animal) => {
            if (!animal || disposed) return;
            animal.userData.provinceAnimal = true;
            miniature.add(animal);
          }).catch(() => undefined);

          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry, 14),
            new THREE.LineBasicMaterial({ color: style.accent, transparent: true, opacity: .52 }),
          );
          edges.position.y = .006;
          world.add(edges);
        });
        cities.forEach((city) => {
          const p = project(city);
          const marker = new THREE.Group();
          marker.position.set(p.x, 0.4, -p.y);
          const core = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffe566 }));
          const halo = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.16, 28), new THREE.MeshBasicMaterial({ color: 0xffe566, transparent: true, opacity: 0.65, side: THREE.DoubleSide }));
          halo.rotation.x = -Math.PI / 2;
          marker.add(core, halo);
          marker.userData.offset = Math.random() * Math.PI * 2;
          world.add(marker);
        });
        const initial = meshes.some((mesh) => mesh.userData.name === DEFAULT_PROVINCE) ? DEFAULT_PROVINCE : names[0];
        selectProvince(initial, false);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onPointerLeave = () => {
      pointer.set(20, 20);
      if (hovered && hovered !== selected) resetMaterial(hovered);
      hovered = null;
      renderer.domElement.style.cursor = "grab";
    };
    const onClick = () => { if (hovered) selectProvince(hovered.userData.name); };
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("click", onClick);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      dust.rotation.y = elapsed * 0.012;
      scanRings.rotation.y = elapsed * -0.006;
      world.children.forEach((child) => {
        if (!(child instanceof THREE.Group)) return;
        if (child.userData.provinceMiniature) {
          child.position.y = child.userData.baseY + Math.sin(elapsed * 1.2 + child.userData.offset) * .014;
          child.rotation.y = Math.sin(elapsed * .55 + child.userData.offset) * .08;
        } else if (child.userData.offset !== undefined) {
          const pulse = 1 + Math.sin(elapsed * 2.2 + child.userData.offset) * .24;
          child.children[1]?.scale.setScalar(pulse);
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
          material.color.set(style.accent);
          material.emissive.set(style.emissive);
          material.emissiveIntensity = .78;
        }
        renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
      }
      camera.position.lerp(targetCamera, 0.045);
      controls.target.lerp(targetLookAt, 0.045);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    api.current = {
      focus: (target, nextCamera) => {
        targetLookAt = new THREE.Vector3(target[0], target[1], target[2]);
        targetCamera = new THREE.Vector3(nextCamera[0], nextCamera[1], nextCamera[2]);
      },
      select: (name) => selectProvince(name),
    };
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("click", onClick);
      controls.dispose();
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="map-experience">
      <div className="map-stage" ref={mountRef} />
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="Tanah Air, kembali ke tampilan utama">
          <span className="brand-mark">TA</span><span>Tanah Air</span>
        </a>
        <div className="live-status"><span className="status-dot" />Peta nasional aktif</div>
        <button className="icon-button" type="button" aria-label={muted ? "Aktifkan suara ambient" : "Matikan suara ambient"} onClick={() => setMuted((value) => !value)}>
          {muted ? "Senyap" : "Ambient"}
        </button>
      </header>
      <aside className="hero-panel">
        <p className="eyebrow">05° LU — 11° LS</p>
        <h1>Jelajahi<span>Nusantara</span></h1>
        <p className="hero-copy">Setiap provinsi kini punya diorama hidup: rumah adat, bentang alam, budaya, dan cita rasa yang berbeda.</p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => api.current?.focus(presets[0].target, presets[0].camera)}>
            Lihat seluruh kepulauan <span>?</span>
          </button>
          <span className="drag-hint">Seret untuk memutar</span>
        </div>
      </aside>
      <nav className="island-nav" aria-label="Fokus wilayah peta">
        {presets.map((preset, index) => (
          <button type="button" key={preset.label} className={index === 0 ? "active" : ""} onClick={(event) => {
            event.currentTarget.parentElement?.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
            event.currentTarget.classList.add("active");
            api.current?.focus(preset.target, preset.camera);
          }}><span>0{index + 1}</span>{preset.label}</button>
        ))}
      </nav>
      <div className="province-card" style={{ "--province-accent": "#" + activeStyle.accent.toString(16).padStart(6, "0") } as React.CSSProperties}>
        <div className="province-meta"><span>Provinsi terpilih</span><span>{String(activeIndex + 1).padStart(2, "0")} / 38</span></div>
        <div className="province-heading"><span className="province-swatch" /><strong>{activeProvince}</strong></div>
        <div className="signature-block">
          <span className="category-pill">{activeStyle.category}</span>
          <h2>{activeStyle.signature}</h2>
          <p>{activeStyle.detail}</p>
        </div>
        <div
          className="fabric-sample"
          style={{ backgroundImage: `linear-gradient(90deg,rgba(5,23,19,.03),rgba(5,23,19,.42)),url(/textures/provinces/${activeTextureKey}.webp)` }}
        >
          <span>Tekstil daerah</span>
          <b>{activeTextile.textile}</b>
        </div>
        <div className="identity-grid">
          <div><span>Busana adat</span><b>{activeTextile.attire}</b><small>{activeTextile.textile}</small></div>
          <div><span>Kuliner</span><b>{activeStyle.food}</b></div>
          <div><span>Warisan</span><b>{activeStyle.culture}</b></div>
          {activeAnimalCredit && <div className="asset-credit"><span>Fauna 3D</span><b>{activeAnimalCredit.label}</b><small>{activeAnimalCredit.license} · {activeAnimalCredit.creator}</small></div>}
        </div>
        <label htmlFor="province-select">Jelajahi provinsi lain</label>
        <select id="province-select" value={activeProvince} onChange={(event) => api.current?.select(event.target.value)}>
          {provinceNames.map((province) => <option value={province} key={province}>{province}</option>)}
        </select>
      </div>
      <div className={loading ? "loading-state visible" : "loading-state"} aria-live="polite"><span />Membentuk kepulauan…</div>
      <footer className="map-footer"><span>38 tekstur busana adat</span><span>Rumah • budaya • fauna berlisensi</span><a href="/asset-credits.txt" target="_blank" rel="noreferrer">Kredit aset</a></footer>
    </section>
  );
}

