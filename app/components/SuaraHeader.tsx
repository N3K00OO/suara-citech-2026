"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

type SuaraHeaderProps = {
  active?: "home" | "product" | "consultations" | "responses";
  dark?: boolean;
};

const navItems = [
  { id: "consultations", label: "Konsultasi", href: "/consultations" },
  { id: "product", label: "Hasil", href: "/product?step=6" },
  { id: "home", label: "Cara kerja", href: "/#perjalanan" },
  { id: "responses", label: "Partisipasi saya", href: "/responses" },
] as const;

export function SuaraHeader({ active = "home", dark = true }: SuaraHeaderProps) {
  const navigateWithMotion = (event: MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(href, window.location.href);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (`${destination.pathname}${destination.search}${destination.hash}` === current) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("suara:navigate", { detail: { href, label } }));
  };

  return (
    <header className={`suara-header ${dark ? "is-dark" : "is-light"}`}>
      <Link className="suara-brand" href="/" aria-label="SUARA, kembali ke beranda">
        <span className="suara-mark" aria-hidden="true" />
        <span>
          <strong>SUARA</strong>
          <small>Catatan kebijakan publik</small>
        </span>
      </Link>

      <p className="prototype-note">Prototipe CITECH 2026 · bukan layanan resmi pemerintah</p>

      <nav className="primary-nav" aria-label="Navigasi utama">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active === item.id ? "page" : undefined}
            onClick={(event) => navigateWithMotion(event, item.href, item.label)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="intro-link" href="/#perjalanan">Lihat pengantar</Link>
    </header>
  );
}
