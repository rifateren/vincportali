"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type RealtimeMessageThreadProps = {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("tr-TR");
}

export default function RealtimeMessageThread({
  conversationId,
  currentUserId,
  initialMessages,
}: RealtimeMessageThreadProps) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "listing_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, conversationId]);

  async function handleSubmit() {
    const trimmedBody = body.trim();
    if (!trimmedBody) return;

    setIsSending(true);
    setError(null);

    try {
      const { error: messageError } = await supabase
        .from("listing_messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          body: trimmedBody,
        });

      if (messageError) throw messageError;
      setBody("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Mesaj gönderilemedi.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <div className="mt-6 space-y-3">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${
                  isOwnMessage
                    ? "bg-[#1e3a5f] text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                <p>{message.body}</p>
                <p
                  className={`mt-2 text-xs ${isOwnMessage ? "text-slate-200" : "text-slate-500"}`}
                >
                  {formatDate(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <label
          htmlFor="replyBody"
          className="text-sm font-semibold text-[#1e3a5f]"
        >
          Yanıt yazın
        </label>
        <textarea
          id="replyBody"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Mesajınızı yazın..."
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#f97316]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          type="button"
          disabled={isSending || !body.trim()}
          onClick={handleSubmit}
          className="mt-3 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSending ? "Gönderiliyor..." : "Mesajı gönder"}
        </button>
        {error ? (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        ) : null}
      </div>
    </>
  );
}
