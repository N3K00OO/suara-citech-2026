import type { Metadata } from "next";
import { SuaraLanding } from "./components/SuaraLanding";

export const metadata: Metadata = {
  title: "Ikuti satu suara",
};

export default function Home() {
  return <SuaraLanding />;
}
