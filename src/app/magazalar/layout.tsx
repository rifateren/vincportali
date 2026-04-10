import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kurumsal Mağazalar",
  description:
    "MakinePazarı'ndaki kurumsal mağazaları inceleyin. Güvenilir satıcılardan iş makinesi satın alın.",
};

export default function MagazalarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
