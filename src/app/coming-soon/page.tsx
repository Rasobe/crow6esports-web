import type { Metadata } from "next";
import { ComingSoonPage } from "@/features/coming-soon";

export const metadata: Metadata = {
  title: "Crow 6 eSports — Próximamente",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ComingSoonPage />;
}
