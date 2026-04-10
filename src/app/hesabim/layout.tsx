import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesabım",
  description: "MakinePazarı hesap yönetimi. İlanlarınızı, favorilerinizi ve mesajlarınızı yönetin.",
};

export default function HesabimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
