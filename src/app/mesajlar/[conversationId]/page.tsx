import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import RealtimeMessageThread from "@/components/RealtimeMessageThread";

type Conversation = {
  id: string;
  listing_id: string;
  seller_id: string;
  buyer_id: string;
  created_at: string;
  last_message_at: string;
};

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export default async function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/giris");
  }

  const { data: conversationData } = await supabase
    .from("listing_conversations")
    .select("id, listing_id, seller_id, buyer_id, created_at, last_message_at")
    .eq("id", params.conversationId)
    .maybeSingle();

  if (!conversationData) {
    notFound();
  }

  const conversation = conversationData as Conversation;

  // Mark this conversation as read for the current user
  await supabase.rpc("mark_conversation_read", {
    p_conversation_id: conversation.id,
  });

  const [{ data: listingData }, { data: messagesData }, { data: sellerProfile }] = await Promise.all([
    supabase.from("listings").select("id, title").eq("id", conversation.listing_id).single(),
    supabase
      .from("listing_messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("profiles")
      .select("full_name, company_name, user_type")
      .eq("id", conversation.seller_id)
      .maybeSingle(),
  ]);

  const listingTitle = listingData?.title ?? "İlan";
  const sellerDisplayName =
    sellerProfile?.user_type === "kurumsal"
      ? sellerProfile.company_name || sellerProfile.full_name || "Satıcı"
      : sellerProfile?.full_name || "Satıcı";
  const messages = (messagesData ?? []) as Message[];

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-5xl px-4 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#f97316]">İlan konuşması</p>
            <h1 className="mt-1 text-3xl font-bold text-[#1e3a5f]">{listingTitle}</h1>
            <p className="mt-2 text-sm text-slate-600">Satıcı: {sellerDisplayName}</p>
          </div>
          <Link href={`/ilan/${conversation.listing_id}`} className="text-sm font-semibold text-[#f97316] hover:underline">
            İlana dön
          </Link>
        </div>

        <RealtimeMessageThread
          conversationId={conversation.id}
          currentUserId={authData.user.id}
          initialMessages={messages}
        />
      </div>
    </main>
  );
}
