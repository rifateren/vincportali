import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası - MakinePazarı",
  description:
    "MakinePazarı gizlilik politikası. Kişisel verilerinizin nasıl işlendiğini öğrenin.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">
        Gizlilik Politikası
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Son güncelleme: 31 Mart 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            1. Veri Sorumlusu
          </h2>
          <p className="mt-2">
            Bu gizlilik politikası, MakinePazarı platformu (&quot;Platform&quot;)
            tarafından toplanan kişisel verilerin işlenmesine ilişkin esasları
            belirler. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
            kapsamında veri sorumlusu olarak hareket etmekteyiz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            2. Toplanan Veriler
          </h2>
          <p className="mt-2">
            Platformumuzu kullanırken aşağıdaki kişisel veriler toplanabilir:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              <strong>Kimlik Bilgileri:</strong> Ad, soyad, şirket adı, vergi
              numarası
            </li>
            <li>
              <strong>İletişim Bilgileri:</strong> E-posta adresi, telefon
              numarası, şehir
            </li>
            <li>
              <strong>Hesap Bilgileri:</strong> Kullanıcı tipi, şifre (şifreli
              olarak saklanır)
            </li>
            <li>
              <strong>İlan Bilgileri:</strong> İlan içerikleri, fotoğraflar,
              fiyat bilgileri
            </li>
            <li>
              <strong>İletişim Kayıtları:</strong> Platform içi mesajlaşma
              içerikleri
            </li>
            <li>
              <strong>Kullanım Verileri:</strong> Sayfa görüntülenme, ilan
              favori ve görüntülenme sayıları
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            3. Verilerin İşlenme Amaçları
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Hesap oluşturma ve kimlik doğrulama</li>
            <li>İlan yayınlama ve yönetim hizmetlerinin sağlanması</li>
            <li>Alıcı ve satıcılar arasında iletişimin sağlanması</li>
            <li>Platform güvenliğinin sağlanması ve dolandırıcılığın önlenmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Hizmet kalitesinin iyileştirilmesi ve istatistiksel analizler</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            4. Verilerin Paylaşımı
          </h2>
          <p className="mt-2">
            Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla
            paylaşılmaz:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Yasal zorunluluk halinde yetkili kamu kurumlarıyla</li>
            <li>
              Hizmet sağlayıcılarımızla (barındırma, e-posta hizmeti) yalnızca
              hizmetin gerektirdiği ölçüde
            </li>
            <li>
              İlan bilgileriniz (iletişim bilgileri hariç) platformda herkese
              açık olarak yayınlanır
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            5. Veri Güvenliği
          </h2>
          <p className="mt-2">
            Kişisel verilerinizin güvenliği için endüstri standartlarında teknik
            ve idari tedbirler uygulamaktayız. Verileriniz şifreli bağlantılar
            (SSL/TLS) üzerinden iletilir ve güvenli sunucularda saklanır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            6. Çerezler (Cookies)
          </h2>
          <p className="mt-2">
            Platformumuz, oturum yönetimi ve kullanıcı deneyimini iyileştirmek
            amacıyla çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerez
            tercihlerinizi yönetebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            7. KVKK Kapsamındaki Haklarınız
          </h2>
          <p className="mt-2">
            6698 sayılı KVKK&apos;nın 11. maddesi kapsamında aşağıdaki haklara
            sahipsiniz:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>
              İşlenmişse buna ilişkin bilgi talep etme
            </li>
            <li>
              İşlenme amacını ve bunların amacına uygun kullanılıp
              kullanılmadığını öğrenme
            </li>
            <li>
              Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
            </li>
            <li>
              Eksik veya yanlış işlenmişse düzeltilmesini isteme
            </li>
            <li>
              KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde
              silinmesini isteme
            </li>
            <li>
              İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz
              edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz
              etme
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            8. İletişim
          </h2>
          <p className="mt-2">
            Gizlilik politikamız hakkında sorularınız veya KVKK kapsamındaki
            talepleriniz için{" "}
            <Link
              href="/iletisim"
              className="font-semibold text-[#f97316] hover:underline"
            >
              iletişim sayfamızdan
            </Link>{" "}
            bize ulaşabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1e3a5f]">
            9. Değişiklikler
          </h2>
          <p className="mt-2">
            Bu gizlilik politikası zaman zaman güncellenebilir. Önemli
            değişiklikler platformda duyurulacaktır. Güncel sürümü bu sayfada
            yayınlanır.
          </p>
        </section>
      </div>
    </main>
  );
}
