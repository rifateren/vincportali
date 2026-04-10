import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim - MakinePazarı",
  description:
    "MakinePazarı ile iletişime geçin. Sorularınız ve önerileriniz için bize ulaşın.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f]">İletişim</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sorularınız, önerileriniz veya şikayetleriniz için bizimle iletişime
        geçebilirsiniz.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f]">
            Bize Ulaşın
          </h2>
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-semibold text-[#1e3a5f]">E-posta</p>
              <p className="mt-1">destek@makinepazari.com</p>
            </div>
            <div>
              <p className="font-semibold text-[#1e3a5f]">Telefon</p>
              <p className="mt-1">+90 (212) 000 00 00</p>
            </div>
            <div>
              <p className="font-semibold text-[#1e3a5f]">Adres</p>
              <p className="mt-1">
                İstanbul, Türkiye
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#1e3a5f]">Çalışma Saatleri</p>
              <p className="mt-1">
                Pazartesi - Cuma: 09:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f]">
            Mesaj Gönderin
          </h2>
          <form className="mt-4 space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                Adınız
              </label>
              <input
                id="contact-name"
                type="text"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
                placeholder="Ad Soyad"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                E-posta
              </label>
              <input
                id="contact-email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                Konu
              </label>
              <select id="contact-subject" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f97316]">
                <option value="">Seçiniz</option>
                <option value="genel">Genel Bilgi</option>
                <option value="teknik">Teknik Destek</option>
                <option value="sikayet">Şikayet</option>
                <option value="oneri">Öneri</option>
                <option value="is-birligi">İş Birliği</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[#1e3a5f]">
                Mesajınız
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f97316]"
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ea580c]"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
