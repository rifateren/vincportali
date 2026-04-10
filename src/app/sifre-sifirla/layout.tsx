import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle",
  description: "MakinePazarı hesabınız için yeni şifre belirleyin.",
};

export default function SifreSifirlaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
