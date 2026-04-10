import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidMessageBody, sanitizeText } from "@/lib/validation";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }

  return "Mesaj gönderilemedi.";
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Önce giriş yapmalısınız." }, { status: 401 });
    }

    const body = (await request.json()) as {
      listingId?: string;
      message?: string;
    };

    const listingId = body.listingId?.trim();
    const rawMessage = body.message?.trim();

    if (!listingId || !rawMessage) {
      return NextResponse.json({ error: "Mesaj ve ilan bilgisi zorunludur." }, { status: 400 });
    }

    const message = sanitizeText(rawMessage);

    if (!isValidMessageBody(message)) {
      return NextResponse.json(
        { error: "Mesaj 1-2000 karakter arasında olmalıdır." },
        { status: 400 },
      );
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, user_id, is_active")
      .eq("id", listingId)
      .maybeSingle();

    if (listingError) {
      return NextResponse.json({ error: "İlan bilgisi alınamadı." }, { status: 400 });
    }

    if (!listing || !listing.is_active) {
      return NextResponse.json({ error: "İlan artık aktif değil." }, { status: 404 });
    }

    if (listing.user_id === user.id) {
      return NextResponse.json({ error: "Kendi ilanınıza mesaj gönderemezsiniz." }, { status: 400 });
    }

    let conversationId: string | null = null;

    const { data: existingConversation, error: existingConversationError } = await supabase
      .from("listing_conversations")
      .select("id")
      .eq("listing_id", listing.id)
      .eq("buyer_id", user.id)
      .maybeSingle();

    if (existingConversationError) {
      return NextResponse.json({ error: "Mevcut konuşma kontrol edilemedi." }, { status: 400 });
    }

    if (existingConversation?.id) {
      conversationId = existingConversation.id;
    } else {
      const { data: createdConversation, error: conversationError } = await supabase
        .from("listing_conversations")
        .insert({
          listing_id: listing.id,
          seller_id: listing.user_id,
          buyer_id: user.id,
        })
        .select("id")
        .single();

      if (conversationError || !createdConversation) {
        const normalizedMessage =
          conversationError?.code === "23505"
            ? "Bu ilan için konuşma zaten mevcut. Sayfa yenilenip tekrar deneyin."
            : conversationError?.message?.toLowerCase().includes("policy")
              ? "Bu ilan için konuşma başlatılamadı."
              : "Konuşma oluşturulamadı.";

        return NextResponse.json({ error: normalizedMessage }, { status: 400 });
      }

      conversationId = createdConversation.id;
    }

    const { error: messageError } = await supabase.from("listing_messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: message,
    });

    if (messageError) {
      const normalizedMessage =
        messageError.message?.toLowerCase().includes("policy")
          ? "Bu konuşmaya mesaj gönderme izniniz yok."
          : "Mesaj kaydedilemedi.";

      return NextResponse.json({ error: normalizedMessage }, { status: 400 });
    }

    return NextResponse.json({ conversationId });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
