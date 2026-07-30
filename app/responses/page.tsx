import type { Metadata } from "next";
import { ResponsesPage } from "../components/ResponsesPage";

export const metadata: Metadata = {
  title: "Partisipasi saya",
};

export default function MyResponsesPage() {
  return <ResponsesPage />;
}
