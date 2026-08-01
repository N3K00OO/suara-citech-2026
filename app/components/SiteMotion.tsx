"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type RouteState = {
  phase: "cover" | "reveal";
} | null;

const criticalAssets = [
  "/design/aged-paper-texture.webp",
  "/design/formal-stage-reference.webp",
  "/design/suara-border-ornament.webp",
  "/textures/provinces/dki-jakarta.webp",
  "/textures/provinces/jawa-barat.webp",
  "/textures/provinces/jawa-timur.webp",
];

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
    if (image.complete) resolve();
  });
}

export function SiteMotion() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loaderLeaving, setLoaderLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [routeState, setRouteState] = useState<RouteState>(null);
  const routeLocked = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();
    let completed = 0;

    const tasks = criticalAssets.map((src) => preloadImage(src).then(() => {
      completed += 1;
      if (!cancelled) setProgress(Math.round((completed / criticalAssets.length) * 100));
    }));

    Promise.all(tasks).then(() => {
      const remaining = Math.max(0, 900 - (Date.now() - startedAt));
      window.setTimeout(() => {
        if (cancelled) return;
        setProgress(100);
        setLoaderLeaving(true);
        window.setTimeout(() => setLoading(false), 760);
      }, remaining);
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const navigation = event as CustomEvent<{ href: string }>;
      const { href } = navigation.detail;
      if (!href || routeLocked.current) return;

      routeLocked.current = true;
      setRouteState({ phase: "cover" });
      document.documentElement.classList.add("route-is-whipping-out");

      window.setTimeout(() => router.push(href), 190);
      window.setTimeout(() => {
        document.documentElement.classList.remove("route-is-whipping-out");
        document.documentElement.classList.add("route-is-whipping-in");
      }, 205);
      window.setTimeout(() => setRouteState({ phase: "reveal" }), 225);
      window.setTimeout(() => document.documentElement.classList.remove("route-is-whipping-in"), 245);
      window.setTimeout(() => {
        setRouteState(null);
        routeLocked.current = false;
      }, 560);
    };

    window.addEventListener("suara:navigate", handleNavigate);
    return () => window.removeEventListener("suara:navigate", handleNavigate);
  }, [router]);

  return (
    <>
      {loading && (
        <div className={`suara-loader${loaderLeaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
          <div className="loader-mandala" aria-hidden="true"><i>S</i></div>
          <div className="loader-copy">
            <span>Menyiapkan ruang musyawarah</span>
            <strong>SUARA</strong>
            <p>Memuat tekstur, peta, dan jejak kebijakan.</p>
          </div>
          <div className="loader-meter" aria-label={`Memuat ${progress}%`}>
            <i style={{ width: `${progress}%` }} />
            <b>{String(progress).padStart(3, "0")}</b>
          </div>
        </div>
      )}

      {routeState && (
        <div className={`route-cinematic is-${routeState.phase}`} aria-hidden="true" />
      )}
    </>
  );
}
