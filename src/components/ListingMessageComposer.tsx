"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MESSAGE_TEMPLATES: { label: string; body: string }[] = [
  { label: "Son fiyat?", body: "Merhaba, ilanınız için son fiyatınız nedir?" },
  { label: "Yerinde görmek", body: "Merhaba, makineyi yerinde görebilir miyim? Uygun bir zaman önerebilir misiniz?" },
  { label: "Teknik servis", body: "Merhaba, bakım / servis geçmişi hakkında bilgi paylaşabilir misiniz?" },
  { label: "Nakliye", body: "Merhaba, teslimat veya nakliye konusunda yardımcı oluyor musunuz?" },
];

type ListingMessageComposerProps = {
  listingId: string;
  sellerId: string;
  isLoggedIn: boolean;
  isOwner: boolean;
  initialConversationId: string | null;
};

export default function ListingMessageComposer({
  listingId,
  sellerId,
  isLoggedIn,
  isOwner,
  initialConversationId,
}: ListingMessageComposerProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function normalizeErrorMessage(message: string) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("not authenticated") || lowerMessage.includes("giriş")) {
      return "Önce giriş yapmalısınız.";
    }
    if (lowerMessage.includes("policy")) {
      return "Bu ilan için konuşma başlatılamadı.";
    }
    if (lowerMessage.includes("aktif değil")) {
      return "İlan artık aktif değil.";
    }
    if (lowerMessage.includes("kendi ilan")) {
      return "Kendi ilanınıza mesaj gönderemezsiniz.";
    }

    return message;
  }

  async function handleSend() {
    if (!isLoggedIn) {
      window.location.href = "/giris";
      return;
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      setError("Mesaj alanı boş bırakılamaz.");
      return;
    }
    if (!sellerId) {
      setError("Satıcı bilgisi bulunamadı.");
      return;
    }
    if (isOwner) {
      setError("Kendi ilanınıza mesaj gönderemezsiniz.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          message: trimmedBody,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        conversationId?: string;
      };

      if (!response.ok || !payload.conversationId) {
        throw new Error(normalizeErrorMessage(payload.error ?? "Mesaj gönderilemedi."));
      }

      setBody("");
      toast.success("Mesajınız gönderildi");
      router.push(`/mesajlar/${payload.conversationId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi.");
    } finally {
      setIsSending(false);
    }
  }

  if (isOwner) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm text-slate-600">Bu ilan size ait. Mesaj akışını `Mesajlarım` alanından takip edebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div id="listing-message-form" className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">İlan üzerinden mesaj gönder</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {MESSAGE_TEMPLATES.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => {
              setBody(t.body);
              setError(null);
            }}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-[#1e3a5f] hover:border-[#f97316] hover:text-[#f97316]"
          >
            {t.label}
          </button>
        ))}
      </div>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Satıcıya kısa bir mesaj yazın..."
        rows={4}
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-[#f97316]"
      />
      <button
        type="button"
        disabled={isSending || !body.trim()}
        onClick={handleSend}
        className="mt-3 min-h-[48px] w-full rounded-lg bg-[#1e3a5f] px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSending ? "Gönderiliyor..." : "Mesaj gönder"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
