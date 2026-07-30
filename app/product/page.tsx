import type { Metadata } from "next";
import { SuaraProduct } from "../components/SuaraProduct";

export const metadata: Metadata = {
  title: "Konsultasi aktif",
  description: "Baca rancangan, sampaikan dampak, dan telusuri perubahan kebijakan.",
};

export default function ProductPage() {
  return <SuaraProduct />;
}
