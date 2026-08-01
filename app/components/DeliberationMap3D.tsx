"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type DeliberationMap3DProps = {
  activeView: "common" | "difference" | "minority";
};

const palette = {
  common: new THREE.Color("#efb94f"),
  difference: new THREE.Color("#ef6b48"),
  minority: new THREE.Color("#58d8cc"),
};

export function DeliberationMap3D({ activeView }: DeliberationMap3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.25, 10.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    world.rotation.x = -0.28;
    scene.add(world);

    const gold = new THREE.Color("#efb94f");
    const rust = new THREE.Color("#ef6b48");
    const teal = new THREE.Color("#58d8cc");
    const lineColors = [gold, gold, gold, rust, teal, teal];

    for (let index = 0; index < 5; index += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.45 + index * 0.48, 0.012, 8, 128),
        new THREE.MeshBasicMaterial({
          color: index % 2 ? "#5f4b2a" : "#95703a",
          transparent: true,
          opacity: 0.25 - index * 0.025,
        }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.z = -0.18;
      world.add(ring);
    }

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.55, 0.16, 64),
      new THREE.MeshStandardMaterial({
        color: "#5d471f",
        emissive: "#c18425",
        emissiveIntensity: 0.34,
        metalness: 0.35,
        roughness: 0.44,
      }),
    );
    hub.rotation.x = Math.PI / 2;
    hub.position.z = 0.02;
    world.add(hub);

    const hubHalo = new THREE.Mesh(
      new THREE.RingGeometry(0.56, 0.68, 64),
      new THREE.MeshBasicMaterial({
        color: "#ffd36f",
        transparent: true,
        opacity: 0.58,
        side: THREE.DoubleSide,
      }),
    );
    hubHalo.position.z = 0.14;
    world.add(hubHalo);

    const nodes: THREE.Mesh[] = [];
    const paths: THREE.Line[] = [];
    const sparks: THREE.Mesh[] = [];

    for (let index = 0; index < 6; index += 1) {
      const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
      const radius = 3.45;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const color = lineColors[index];

      const node = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.22, 0.12, 32),
        new THREE.MeshStandardMaterial({
          color: "#102b38",
          emissive: color,
          emissiveIntensity: 0.18,
          metalness: 0.5,
          roughness: 0.4,
        }),
      );
      node.rotation.x = Math.PI / 2;
      node.position.set(x, y, 0.08);
      world.add(node);
      nodes.push(node);

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.72 * Math.cos(angle), 0.72 * Math.sin(angle), 0.12),
        new THREE.Vector3(x * 0.47, y * 0.47, 0.24 + (index % 2) * 0.08),
        new THREE.Vector3(x, y, 0.12),
      ]);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(72));
      const path = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.82,
        }),
      );
      world.add(path);
      paths.push(path);

      for (let sparkIndex = 0; sparkIndex < 5; sparkIndex += 1) {
        const spark = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 12, 12),
          new THREE.MeshBasicMaterial({ color }),
        );
        const t = 0.18 + sparkIndex * 0.16;
        spark.position.copy(curve.getPoint(t));
        spark.userData = { curve, offset: t, speed: 0.055 + index * 0.004 };
        world.add(spark);
        sparks.push(spark);
      }
    }

    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(240 * 3);
    for (let index = 0; index < dustPositions.length; index += 3) {
      const radius = 1.5 + Math.random() * 3.5;
      const angle = Math.random() * Math.PI * 2;
      dustPositions[index] = Math.cos(angle) * radius;
      dustPositions[index + 1] = Math.sin(angle) * radius;
      dustPositions[index + 2] = -0.12 + Math.random() * 0.32;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: "#d6a74e",
        size: 0.025,
        transparent: true,
        opacity: 0.36,
      }),
    );
    world.add(dust);

    scene.add(new THREE.AmbientLight("#89aab1", 1.2));
    const hubLight = new THREE.PointLight("#efb94f", 8, 10, 2);
    hubLight.position.set(0, 0, 2.2);
    scene.add(hubLight);

    let pointerX = 0;
    let pointerY = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncAnimation();
    }, { threshold: 0.05 });
    observer.observe(mount);
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      syncAnimation();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const animate = (time: number) => {
      frame = 0;
      if (!isVisible || !isPageVisible) return;
      frame = requestAnimationFrame(animate);
      const seconds = time * 0.001;
      world.rotation.z += (pointerX * 0.035 - world.rotation.z) * 0.035;
      world.rotation.x += (-0.28 - pointerY * 0.025 - world.rotation.x) * 0.035;
      hub.rotation.y = seconds * 0.22;
      hubHalo.rotation.z = -seconds * 0.16;
      dust.rotation.z = seconds * 0.015;
      sparks.forEach((spark) => {
        const next = (spark.userData.offset + seconds * spark.userData.speed) % 1;
        spark.position.copy(spark.userData.curve.getPoint(next));
      });
      renderer.render(scene, camera);
    };
    const syncAnimation = () => {
      if (isVisible && isPageVisible && !frame) frame = requestAnimationFrame(animate);
      if ((!isVisible || !isPageVisible) && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    syncAnimation();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      mount.removeEventListener("pointermove", onPointerMove);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    mount.style.setProperty("--active-network", palette[activeView].getStyle());
  }, [activeView]);

  return <div ref={mountRef} className="assembly-webgl" aria-hidden="true" />;
}
