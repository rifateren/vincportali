import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Conversation = {
  id: string;
  listing_id: string;
  seller_id: string;
  buyer_id: string;
  last_message_at: string;
};

type Message = {
  conversation_id: string;
  body: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("tr-TR");
}

export default async function MessagesPage() {
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/giris");
  }

  const [{ data: conversationsData }, { data: messagesData }] = await Promise.all([
    supabase
      .from("listing_conversations")
      .select("id, listing_id, seller_id, buyer_id, last_message_at")
      .or(`seller_id.eq.${authData.user.id},buyer_id.eq.${authData.user.id}`)
      .order("last_message_at", { ascending: false }),
    supabase
      .from("listing_messages")
      .select("conversation_id, body")
      .order("created_at", { ascending: false }),
  ]);

  const conversations = (conversationsData ?? []) as Conversation[];
  const messages = (messagesData ?? []) as Message[];
  const latestMessageByConversation = new Map<string, string>();
  messages.forEach((message) => {
    if (!latestMessageByConversation.has(message.conversation_id)) {
      latestMessageByConversation.set(message.conversation_id, message.body);
    }
  });

  const listingIds = Array.from(new Set(conversations.map((conversation) => conversation.listing_id)));
  const listingMap = new Map<string, { id: string; title: string }>();

  if (listingIds.length > 0) {
    const { data: listingsData } = await supabase.from("listings").select("id, title").in("id", listingIds);
    (listingsData ?? []).forEach((listing) => {
      listingMap.set(listing.id as string, {
        id: listing.id as string,
        title: listing.title as string,
      });
    });
  }

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-5xl px-4 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Mesajlarım</h1>
          <Link href="/hesabim?sekme=mesajlar" className="text-sm font-semibold text-[#f97316] hover:underline">
            Hesabımda özetle
          </Link>
        </div>

        {conversations.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Henüz bir konuşmanız yok.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/mesajlar/${conversation.id}`}
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-[#f97316]"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#1e3a5f]">
                      {listingMap.get(conversation.listing_id)?.title ?? "İlan"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {latestMessageByConversation.get(conversation.id) ?? "Henüz mesaj yok."}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">{formatDate(conversation.last_message_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
