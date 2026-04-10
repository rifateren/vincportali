import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "MakinePazarı'na ücretsiz kayıt olun. Bireysel veya kurumsal hesap oluşturun.",
};

export default function KayitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
