import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesajlar",
  description: "MakinePazarı mesaj kutunuz. Alıcı ve satıcılarla iletişim kurun.",
};

export default function MesajlarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
