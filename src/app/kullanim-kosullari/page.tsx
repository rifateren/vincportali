import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları - MakinePazarı",
  description:
    "MakinePazarı kullanım koşulları ve şartları. Platform kurallarını inceleyin.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">
        Kullanım Koşulları
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Son güncelleme: 31 Mart 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            1. Genel Hükümler
          </h2>
          <p className="mt-2">
            Bu kullanım koşulları, MakinePazarı platformunu (&quot;Platform&quot;)
            kullanan tüm bireysel ve kurumsal kullanıcılar (&quot;Kullanıcı&quot;)
            için geçerlidir. Platformu kullanarak bu koşulları kabul etmiş
            sayılırsınız.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            2. Hesap Oluşturma ve Güvenlik
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Kullanıcılar, kayıt sırasında doğru ve güncel bilgi vermekle
              yükümlüdür.
            </li>
            <li>
              Hesap güvenliğinden kullanıcı sorumludur. Şifrenizi üçüncü
              kişilerle paylaşmayınız.
            </li>
            <li>
              Kurumsal hesaplar için geçerli şirket bilgileri ve vergi numarası
              gereklidir.
            </li>
            <li>
              Platform, şüpheli veya kurallara aykırı hesapları askıya alma
              veya kapatma hakkını saklı tutar.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            3. İlan Yayınlama Kuralları
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              İlanlar yalnızca iş makineleri ve ilgili ekipmanlar için
              yayınlanabilir.
            </li>
            <li>
              İlan içeriği doğru, eksiksiz ve güncel olmalıdır. Yanıltıcı
              bilgi içeren ilanlar kaldırılır.
            </li>
            <li>
              Yüklenen fotoğraflar ilana konu olan makineye ait olmalıdır.
            </li>
            <li>
              Aynı makine için birden fazla ilan yayınlamak yasaktır.
            </li>
            <li>
              İlan başlığı ve açıklamasında uygunsuz, hakaret içeren veya
              yasalara aykırı ifadeler kullanılamaz.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            4. Alım Satım ve Sorumluluk
          </h2>
          <p className="mt-2">
            MakinePazarı, alıcı ve satıcı arasındaki işlemlerde aracı değildir.
            Platform yalnızca ilan yayınlama ve iletişim hizmeti sağlar.
            İşlemlerin yasal uygunluğu, ödeme ve teslimat süreçleri tamamen
            tarafların sorumluluğundadır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            5. Fikri Mülkiyet
          </h2>
          <p className="mt-2">
            Platform üzerindeki tüm içerik, tasarım, logo ve yazılım
            MakinePazarı&apos;na aittir. İzinsiz kopyalama, dağıtma veya
            değiştirme yasaktır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            6. Mesajlaşma Kuralları
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Platform içi mesajlaşma yalnızca ilan ile ilgili iletişim için
              kullanılmalıdır.
            </li>
            <li>
              Spam, reklam, tehdit veya hakaret içeren mesajlar yasaktır.
            </li>
            <li>
              Platform, mesaj içeriklerini güvenlik ve moderasyon amacıyla
              inceleme hakkını saklı tutar.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            7. Hizmet Değişiklikleri
          </h2>
          <p className="mt-2">
            MakinePazarı, platformun özelliklerini, işlevlerini ve bu kullanım
            koşullarını önceden bildirimde bulunarak değiştirme hakkını saklı
            tutar. Değişiklikler yayınlandığı tarihte yürürlüğe girer.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            8. Uyuşmazlık Çözümü
          </h2>
          <p className="mt-2">
            Bu koşullardan doğan uyuşmazlıklarda İstanbul Mahkemeleri ve İcra
            Daireleri yetkilidir. Türkiye Cumhuriyeti yasaları uygulanır.
          </p>
        </section>
      </div>
    </main>
  );
}
