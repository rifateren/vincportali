"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ConversationReplyFormProps = {
  conversationId: string;
};

export default function ConversationReplyForm({ conversationId }: ConversationReplyFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmedBody = body.trim();
    if (!trimmedBody) return;

    setIsSending(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/giris";
        return;
      }

      const { error: messageError } = await supabase.from("listing_messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: trimmedBody,
      });

      if (messageError) throw messageError;

      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <label htmlFor="replyBody" className="text-sm font-semibold text-[#1e3a5f]">
        Yanıt yazın
      </label>
      <textarea
        id="replyBody"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        placeholder="Mesajınızı yazın..."
        className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#f97316]"
      />
      <button
        type="button"
        disabled={isSending || !body.trim()}
        onClick={handleSubmit}
        className="mt-3 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSending ? "Gonderiliyor..." : "Mesajı gönder"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
