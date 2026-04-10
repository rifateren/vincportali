import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İlan Ver",
  description: "MakinePazarı'nda ücretsiz ilan verin. İş makinenizi hızlıca satışa çıkarın.",
};

export default function IlanVerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
