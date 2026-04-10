import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda - MakinePazarı",
  description:
    "MakinePazarı hakkında bilgi edinin. Türkiye'nin iş makineleri alım satım platformu.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">Hakkımızda</h1>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
        <p>
          <strong className="text-[#1e3a5f]">MakinePazarı</strong>,
          Türkiye&apos;nin iş makineleri sektörüne özel olarak geliştirilen
          dijital alım satım platformudur. Forklift, istif makinesi, transpalet,
          platform, vinç, ekskavatör ve daha birçok kategoride sıfır ve ikinci
          el iş makinesi ilanlarını bir araya getiriyoruz.
        </p>

        <h2 className="text-xl font-bold text-[#1e3a5f]">Misyonumuz</h2>
        <p>
          İş makineleri sektöründe alıcı ve satıcıları güvenilir, şeffaf ve
          hızlı bir şekilde buluşturmak. Doğru makineyi doğru fiyatla bulmanızı
          kolaylaştırmak için teknolojiyi kullanıyoruz.
        </p>

        <h2 className="text-xl font-bold text-[#1e3a5f]">Vizyonumuz</h2>
        <p>
          Türkiye&apos;nin ve bölgenin en büyük iş makineleri pazarı olmak.
          Sektörün dijital dönüşümüne öncülük ederek, iş makineleri ticaretini
          herkes için erişilebilir ve güvenli kılmak.
        </p>

        <h2 className="text-xl font-bold text-[#1e3a5f]">Neler Sunuyoruz?</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Geniş Kategori Yelpazesi:</strong> Forklift, terminal
            çekici, platform, ekskavatör, dozer ve daha fazlası.
          </li>
          <li>
            <strong>Bireysel ve Kurumsal Hesaplar:</strong> Kendi adınıza veya
            şirketiniz adına ilan yayınlayın, mağaza vitrini oluşturun.
          </li>
          <li>
            <strong>Güvenli İletişim:</strong> Platform içi mesajlaşma ile
            alıcı ve satıcılar arasında doğrudan iletişim.
          </li>
          <li>
            <strong>Detaylı Filtreleme:</strong> Kategori, marka, şehir, fiyat,
            çalışma saati ve durum gibi filtrelerle aradığınız makineyi hızlıca
            bulun.
          </li>
          <li>
            <strong>Favori Listeleri:</strong> Beğendiğiniz ilanları
            listelerinize kaydedin, karşılaştırın.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[#1e3a5f]">İletişim</h2>
        <p>
          Sorularınız veya önerileriniz için{" "}
          <Link
            href="/iletisim"
            className="font-semibold text-[#f97316] hover:underline"
          >
            iletişim sayfamızı
          </Link>{" "}
          ziyaret edebilirsiniz.
        </p>
      </div>
    </main>
  );
}
