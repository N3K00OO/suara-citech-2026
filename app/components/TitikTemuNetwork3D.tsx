"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { NetworkNode } from "./titikTemuNetworkData";

type Props = {
  nodes: NetworkNode[];
  visibleNodes: NetworkNode[];
  activeNode: NetworkNode;
  onSelectNode: (node: NetworkNode) => void;
  soundOn: boolean;
};

type AnimatedParticle = {
  mesh: THREE.Mesh;
  curve: THREE.QuadraticBezierCurve3;
  offset: number;
  speed: number;
  nodeId: string;
};

const colors = {
  agreement: 0xffb94e,
  difference: 0xff5b32,
  unheard: 0x48d5d2,
};

function makeCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,216,143,.9)");
  gradient.addColorStop(0.55, "rgba(255,159,61,.18)");
  gradient.addColorStop(1, "rgba(255,159,61,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function RadialNetwork({
  nodes,
  visibleNodes,
  activeNode,
  onSelectNode,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef(activeNode.id);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    frame: number;
    lines: Map<string, THREE.Object3D[]>;
    markers: Map<string, THREE.Mesh>;
    particles: AnimatedParticle[];
    pointer: THREE.Vector2;
    raycaster: THREE.Raycaster;
    root: THREE.Group;
    clock: THREE.Clock;
    resizeObserver: ResizeObserver;
    onPointerMove: (event: PointerEvent) => void;
    onClick: (event: PointerEvent) => void;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.58;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020912, 0.032);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 15);

    const root = new THREE.Group();
    root.rotation.x = -0.03;
    scene.add(root);

    const texture = makeCircleTexture();
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const warm = new THREE.Color(0xff9b35);
    const cool = new THREE.Color(0x2f6978);
    for (let index = 0; index < starCount; index += 1) {
      const radius = 4 + Math.pow(Math.random(), 0.5) * 10;
      const angle = Math.random() * Math.PI * 2;
      starPositions[index * 3] = Math.cos(angle) * radius;
      starPositions[index * 3 + 1] = Math.sin(angle) * radius * 0.72;
      starPositions[index * 3 + 2] = -1.8 + Math.random() * 1.5;
      const tint = Math.random() > 0.28 ? warm : cool;
      starColors[index * 3] = tint.r;
      starColors[index * 3 + 1] = tint.g;
      starColors[index * 3 + 2] = tint.b;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.06,
      map: texture ?? undefined,
      transparent: true,
      opacity: 0.62,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    root.add(stars);

    const gridGroup = new THREE.Group();
    for (let ring = 0; ring < 14; ring += 1) {
      const radius = 1.72 + ring * 0.45;
      const ringGeometry = new THREE.RingGeometry(radius, radius + 0.008, 192);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: ring % 3 === 0 ? 0x9b672a : 0x36515a,
        transparent: true,
        opacity: ring % 3 === 0 ? 0.22 : 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.position.z = -0.75;
      gridGroup.add(ringMesh);
    }

    for (let ray = 0; ray < 64; ray += 1) {
      const angle = (ray / 64) * Math.PI * 2;
      const points = [
        new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, -0.76),
        new THREE.Vector3(Math.cos(angle) * 8.2, Math.sin(angle) * 8.2, -0.76),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: ray % 4 === 0 ? 0xa46825 : 0x244450,
        transparent: true,
        opacity: ray % 4 === 0 ? 0.13 : 0.07,
      });
      gridGroup.add(new THREE.Line(geometry, material));
    }
    root.add(gridGroup);

    const mandalaGroup = new THREE.Group();
    mandalaGroup.position.z = -0.62;
    const roseConfigs = [
      { base: 2.0, amplitude: 0.34, petals: 8, opacity: 0.2 },
      { base: 2.48, amplitude: 0.4, petals: 12, opacity: 0.18 },
      { base: 3.02, amplitude: 0.5, petals: 16, opacity: 0.16 },
      { base: 3.64, amplitude: 0.42, petals: 24, opacity: 0.15 },
      { base: 4.25, amplitude: 0.56, petals: 32, opacity: 0.13 },
      { base: 5.0, amplitude: 0.46, petals: 40, opacity: 0.11 },
    ];
    roseConfigs.forEach(({ base, amplitude, petals, opacity }, roseIndex) => {
      const rosePoints: THREE.Vector3[] = [];
      for (let step = 0; step <= 720; step += 1) {
        const angle = (step / 720) * Math.PI * 2;
        const radius = base + Math.cos(angle * petals) * amplitude;
        rosePoints.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            roseIndex * -0.004,
          ),
        );
      }
      const roseGeometry = new THREE.BufferGeometry().setFromPoints(rosePoints);
      const roseMaterial = new THREE.LineBasicMaterial({
        color: roseIndex % 2 === 0 ? 0xb9782f : 0x49636a,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      mandalaGroup.add(new THREE.LineLoop(roseGeometry, roseMaterial));
    });

    for (let petal = 0; petal < 48; petal += 1) {
      const baseAngle = (petal / 48) * Math.PI * 2;
      const petalPoints: THREE.Vector3[] = [];
      for (let step = 0; step <= 40; step += 1) {
        const t = step / 40;
        const radius = 2.18 + Math.sin(Math.PI * t) * 3.45;
        const spread = Math.sin(Math.PI * 2 * t) * 0.055;
        const angle = baseAngle + spread;
        petalPoints.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            -0.08,
          ),
        );
      }
      const petalGeometry = new THREE.BufferGeometry().setFromPoints(petalPoints);
      mandalaGroup.add(
        new THREE.Line(
          petalGeometry,
          new THREE.LineBasicMaterial({
            color: petal % 3 === 0 ? 0xbf7830 : 0x315966,
            transparent: true,
            opacity: petal % 3 === 0 ? 0.16 : 0.09,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        ),
      );
    }

    const fractalGroup = new THREE.Group();
    fractalGroup.position.z = -0.7;
    const branchPositions: number[] = [];
    const growBranch = (
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number,
      direction: number,
    ) => {
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      branchPositions.push(x, y, 0, endX, endY, 0);
      if (depth <= 0) return;
      const turn = 0.18 + depth * 0.028;
      growBranch(endX, endY, angle + turn, length * 0.74, depth - 1, direction);
      growBranch(endX, endY, angle - turn, length * 0.69, depth - 1, -direction);
      if (depth > 2) {
        growBranch(
          endX,
          endY,
          angle + direction * 0.045,
          length * 0.61,
          depth - 2,
          direction,
        );
      }
    };

    for (let branch = 0; branch < 36; branch += 1) {
      const angle = (branch / 36) * Math.PI * 2;
      const radius = 4.58 + Math.sin(branch * 2.4) * 0.18;
      growBranch(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        angle + Math.sin(branch) * 0.05,
        0.72,
        4,
        branch % 2 === 0 ? 1 : -1,
      );
      growBranch(
        Math.cos(angle) * (radius - 0.15),
        Math.sin(angle) * (radius - 0.15),
        angle + Math.PI + Math.cos(branch) * 0.08,
        0.54,
        3,
        branch % 2 === 0 ? -1 : 1,
      );
    }
    const branchGeometry = new THREE.BufferGeometry();
    branchGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(branchPositions, 3),
    );
    fractalGroup.add(
      new THREE.LineSegments(
        branchGeometry,
        new THREE.LineBasicMaterial({
          color: 0xb56f29,
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );

    const ornamentCount = 950;
    const ornamentPositions = new Float32Array(ornamentCount * 3);
    for (let index = 0; index < ornamentCount; index += 1) {
      const track = index % 9;
      const angle =
        (index / ornamentCount) * Math.PI * 2 * (5 + (track % 3)) +
        track * 0.37;
      const radius =
        2.2 + track * 0.5 + Math.sin(angle * (3 + (track % 5))) * 0.12;
      ornamentPositions[index * 3] = Math.cos(angle) * radius;
      ornamentPositions[index * 3 + 1] = Math.sin(angle) * radius;
      ornamentPositions[index * 3 + 2] = -0.04;
    }
    const ornamentGeometry = new THREE.BufferGeometry();
    ornamentGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(ornamentPositions, 3),
    );
    mandalaGroup.add(
      new THREE.Points(
        ornamentGeometry,
        new THREE.PointsMaterial({
          color: 0xd99439,
          size: 0.022,
          transparent: true,
          opacity: 0.66,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );

    root.add(mandalaGroup, fractalGroup);

    // The HTML roundtable is the sole focal disc. A second opaque WebGL disc
    // created the oversized black duplicate beside the 72% readout.

    const lineMap = new Map<string, THREE.Object3D[]>();
    const markers = new Map<string, THREE.Mesh>();
    const particles: AnimatedParticle[] = [];

    nodes.forEach((node) => {
      const color = colors[node.category];
      const coreColor = new THREE.Color(color).lerp(
        new THREE.Color(0xfff2ce),
        node.category === "agreement" ? 0.5 : 0.28,
      );
      const start = new THREE.Vector3(0, 0, 0.03);
      const end = new THREE.Vector3(...node.position);
      const midpoint = start.clone().lerp(end, 0.5);
      const perpendicular = new THREE.Vector3(-end.y, end.x, 0)
        .normalize()
        .multiplyScalar(node.bend);
      const control = midpoint.add(perpendicular).add(new THREE.Vector3(0, 0, 0.25));
      const curve = new THREE.QuadraticBezierCurve3(start, control, end);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 72, 0.019, 6, false),
        new THREE.MeshBasicMaterial({
          color: coreColor,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      const halo = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 72, 0.068, 6, false),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.24,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      const aura = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 72, 0.15, 6, false),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.065,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      root.add(tube, halo, aura);

      const auxiliaryPaths: THREE.Mesh[] = [];
      for (let pathIndex = 0; pathIndex < 4; pathIndex += 1) {
        const laneOffset = (pathIndex - 1.5) * 0.16;
        const laneEnd = end
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 0, 1), laneOffset * 0.055);
        const laneMidpoint = start.clone().lerp(laneEnd, 0.5);
        const lanePerpendicular = new THREE.Vector3(-laneEnd.y, laneEnd.x, 0)
          .normalize()
          .multiplyScalar(node.bend + laneOffset);
        const laneCurve = new THREE.QuadraticBezierCurve3(
          start,
          laneMidpoint.add(lanePerpendicular),
          laneEnd,
        );
        const lane = new THREE.Mesh(
          new THREE.TubeGeometry(laneCurve, 52, 0.008, 5, false),
          new THREE.MeshBasicMaterial({
            color: coreColor,
            transparent: true,
            opacity: pathIndex % 2 === 0 ? 0.5 : 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        root.add(lane);
        auxiliaryPaths.push(lane);
      }

      const nodeRing = new THREE.Mesh(
        new THREE.RingGeometry(0.51, 0.56, 96),
        new THREE.MeshBasicMaterial({
          color: coreColor,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        }),
      );
      nodeRing.position.copy(end);
      root.add(nodeRing);
      const nodeHalo = new THREE.Mesh(
        new THREE.RingGeometry(0.43, 0.64, 96),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      nodeHalo.position.copy(end);
      root.add(nodeHalo);

      const hitArea = new THREE.Mesh(
        new THREE.CircleGeometry(0.66, 48),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.015,
          depthWrite: false,
        }),
      );
      hitArea.position.copy(end);
      hitArea.position.z += 0.02;
      hitArea.userData.nodeId = node.id;
      root.add(hitArea);
      markers.set(node.id, hitArea);
      lineMap.set(node.id, [
        tube,
        halo,
        nodeRing,
        hitArea,
        aura,
        nodeHalo,
        ...auxiliaryPaths,
      ]);

      for (let index = 0; index < 12; index += 1) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(index % 3 === 0 ? 0.072 : 0.04, 10, 10),
          new THREE.MeshBasicMaterial({
            color: coreColor,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        root.add(particle);
        particles.push({
          mesh: particle,
          curve,
          offset: index / 12 + Math.random() * 0.08,
          speed: 0.035 + Math.random() * 0.035,
          nodeId: node.id,
        });
      }
    });

    const ambient = new THREE.PointLight(0xffa849, 10, 8, 2);
    ambient.position.set(0, 0, 2);
    scene.add(ambient);

    const pointer = new THREE.Vector2(4, 4);
    const raycaster = new THREE.Raycaster();
    const clock = new THREE.Clock();
    let hoveredId = "";
    const networkUi = document.querySelector<HTMLElement>(".network-ui");
    const siteShell = mount.closest<HTMLElement>(".site-shell");
    const centerReadout =
      document.querySelector<HTMLElement>("[data-center-readout]");
    const nodeLabels = new Map<string, HTMLElement>();
    nodes.forEach((node) => {
      const label = document.querySelector<HTMLElement>(
        `[data-node-id="${node.id}"]`,
      );
      if (label) nodeLabels.set(node.id, label);
    });
    const anchoredCards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-world-x][data-world-y]"),
    ).map((element) => ({
      element,
      position: new THREE.Vector3(
        Number(element.dataset.worldX ?? 0),
        Number(element.dataset.worldY ?? 0),
        0,
      ),
    }));
    const projectedPoint = new THREE.Vector3();

    const projectLocalPoint = (
      localPoint: THREE.Vector3,
      containerRect: DOMRect,
      stageRect: DOMRect,
    ) => {
      projectedPoint
        .copy(localPoint)
        .applyMatrix4(root.matrixWorld)
        .project(camera);
      return {
        x:
          stageRect.left -
          containerRect.left +
          (projectedPoint.x * 0.5 + 0.5) * stageRect.width,
        y:
          stageRect.top -
          containerRect.top +
          (-projectedPoint.y * 0.5 + 0.5) * stageRect.height,
      };
    };

    const updateHtmlPositions = () => {
      if (!networkUi || !siteShell) return;
      root.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const stageRect = mount.getBoundingClientRect();
      const uiRect = networkUi.getBoundingClientRect();
      const shellRect = siteShell.getBoundingClientRect();
      const labelOffset = Math.min(
        62,
        Math.max(34, stageRect.height * 0.065),
      );

      nodes.forEach((node) => {
        const label = nodeLabels.get(node.id);
        if (!label) return;
        const point = projectLocalPoint(
          new THREE.Vector3(...node.position),
          uiRect,
          stageRect,
        );
        const halfWidth = label.offsetWidth * 0.5;
        const halfHeight = label.offsetHeight * 0.5;
        const safeX = Math.min(
          uiRect.width - halfWidth - 10,
          Math.max(halfWidth + 10, point.x),
        );
        const safeY = Math.min(
          uiRect.height - halfHeight - 10,
          Math.max(halfHeight + 10, point.y + labelOffset),
        );
        label.style.left = `${safeX}px`;
        label.style.top = `${safeY}px`;
      });

      if (centerReadout) {
        const center = projectLocalPoint(
          new THREE.Vector3(0, 0, 0),
          uiRect,
          stageRect,
        );
        centerReadout.style.left = `${center.x}px`;
        centerReadout.style.top = `${center.y}px`;
      }

      anchoredCards.forEach(({ element, position }) => {
        const point = projectLocalPoint(position, shellRect, stageRect);
        const halfWidth = element.offsetWidth * 0.5;
        const halfHeight = element.offsetHeight * 0.5;
        const safeX = Math.min(
          shellRect.width - halfWidth - 14,
          Math.max(halfWidth + 14, point.x),
        );
        const safeY = Math.min(
          shellRect.height - halfHeight - 66,
          Math.max(68 + halfHeight, point.y),
        );
        element.style.left = `${safeX}px`;
        element.style.top = `${safeY}px`;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onClick = (event: PointerEvent) => {
      onPointerMove(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([...markers.values()]);
      const nodeId = hits[0]?.object.userData.nodeId as string | undefined;
      const node = nodes.find((item) => item.id === nodeId);
      if (node) onSelectNode(node);
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("click", onClick);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.position.z = width < 760 ? 18.5 : 15;
      camera.updateProjectionMatrix();
      requestAnimationFrame(updateHtmlPositions);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frame = 0;
    let layoutTick = 0;
    let isInViewport = true;
    let isPageVisible = !document.hidden;
    const markerMeshes = [...markers.values()];
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting;
      syncAnimation();
    }, { rootMargin: "0px", threshold: 0.01 });
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      syncAnimation();
    };
    visibilityObserver.observe(mount);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const animate = () => {
      frame = 0;
      if (!isInViewport || !isPageVisible) return;
      frame = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      root.rotation.z = Math.sin(elapsed * 0.08) * 0.012;
      root.rotation.x += ((pointer.y * 0.025 - 0.03) - root.rotation.x) * 0.035;
      root.rotation.y += (pointer.x * 0.035 - root.rotation.y) * 0.035;
      gridGroup.rotation.z = elapsed * 0.006;
      mandalaGroup.rotation.z = -elapsed * 0.009;
      fractalGroup.rotation.z = Math.sin(elapsed * 0.09) * 0.018;
      stars.rotation.z = -elapsed * 0.003;

      particles.forEach((particle) => {
        const t = (elapsed * particle.speed + particle.offset) % 1;
        particle.mesh.position.copy(particle.curve.getPoint(t));
        const pulse = 0.65 + Math.sin((t + elapsed) * Math.PI * 4) * 0.35;
        particle.mesh.scale.setScalar(pulse);
      });

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(markerMeshes)[0];
      hoveredId = (hit?.object.userData.nodeId as string | undefined) ?? "";
      renderer.domElement.style.cursor = hoveredId ? "pointer" : "crosshair";

      markers.forEach((marker, id) => {
        const target = id === hoveredId || id === activeIdRef.current ? 1.12 : 1;
        marker.scale.setScalar(marker.scale.x + (target - marker.scale.x) * 0.12);
      });
      layoutTick += 1;
      if (layoutTick % 6 === 0) updateHtmlPositions();
      renderer.render(scene, camera);
    };
    const syncAnimation = () => {
      if (isInViewport && isPageVisible && !frame) frame = requestAnimationFrame(animate);
      if ((!isInViewport || !isPageVisible) && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    syncAnimation();

    stateRef.current = {
      renderer,
      scene,
      camera,
      frame,
      lines: lineMap,
      markers,
      particles,
      pointer,
      raycaster,
      root,
      clock,
      resizeObserver,
      onPointerMove,
      onClick,
    };

    return () => {
      cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("click", onClick);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          object.geometry?.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material?.dispose();
        }
      });
      texture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    const visibleIds = new Set(visibleNodes.map((node) => node.id));
    state.lines.forEach((objects, id) => {
      const isVisible = visibleIds.has(id);
      objects.forEach((object) => {
        object.visible = isVisible;
      });
    });
    state.particles.forEach((particle) => {
      particle.mesh.visible = visibleIds.has(particle.nodeId);
    });
  }, [visibleNodes]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    activeIdRef.current = activeNode.id;
    state.lines.forEach((objects, id) => {
      const selected = id === activeNode.id;
      objects.forEach((object, index) => {
        if (!(object instanceof THREE.Mesh)) return;
        const material = object.material;
        if (material instanceof THREE.MeshBasicMaterial && index < 3) {
          material.opacity = selected
            ? index === 0
              ? 1
              : index === 1
                ? 0.18
                : 0.95
            : index === 0
              ? 0.52
              : index === 1
                ? 0.06
                : 0.46;
        }
      });
    });
  }, [activeNode]);

  return <div className="webgl-stage" ref={mountRef} aria-hidden="true" />;
}
