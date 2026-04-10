import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "MakinePazarı hesabınızın şifresini sıfırlayın.",
};

export default function SifremiUnuttumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
