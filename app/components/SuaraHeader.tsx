import Link from "next/link";

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
  return (
    <header className={`suara-header ${dark ? "is-dark" : "is-light"}`}>
      <Link className="suara-brand" href="/" aria-label="SUARA, kembali ke beranda">
        <span className="suara-mark" aria-hidden="true"><i>S</i></span>
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
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="intro-link" href="/#perjalanan">Lihat pengantar</Link>
    </header>
  );
}
