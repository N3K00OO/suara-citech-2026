import type { Metadata } from "next";
import { ConsultationsDirectory } from "../components/ConsultationsDirectory";

export const metadata: Metadata = {
  title: "Direktori konsultasi",
};

export default function ConsultationsPage() {
  return <ConsultationsDirectory />;
}
