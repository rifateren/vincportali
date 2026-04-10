import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "./SignOutButton";
import StoreProfileForm from "@/components/StoreProfileForm";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import ListingActions from "@/components/ListingActions";

type Profile = {
  id: string;
  user_type: "bireysel" | "kurumsal";
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  city: string | null;
  store_slug: string | null;
  store_description: string | null;
  store_logo_url: string | null;
  store_banner_url: string | null;
};

type Listing = {
  id: string;
  title: string;
  created_at: string;
  price: number | null;
  is_active: boolean;
  favorite_count: number | null;
  message_count: number | null;
  view_count: number | null;
};

type FavoriteList = {
  id: string;
  title: string;
  created_at: string;
};

type FavoriteItem = {
  favorite_list_id: string;
  listing_id: string;
  created_at: string;
};

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
  sender_id: string;
  created_at: string;
};

function formatPrice(price: number | null) {
  if (price === null) return "Fiyat sorunuz";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR");
}

function getAccountTabs(userType: Profile["user_type"]) {
  const tabs = [
    { key: "ozet", label: "Özet" },
    { key: "profil", label: "Profilim" },
    { key: "ilanlar", label: "İlanlarım" },
    { key: "favoriler", label: "Favorilerim" },
    { key: "mesajlar", label: "Mesajlarım" },
  ];

  if (userType === "kurumsal") {
    tabs.push({ key: "magaza", label: "Mağaza" });
  }

  return tabs;
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: { sekme?: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/giris");
  }

  const [{ data: profileData }, { data: listingsData }, { data: favoriteListsData }, { data: favoriteItemsData }, { data: conversationsData }, { data: messagesData }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, user_type, full_name, company_name, phone, city, store_slug, store_description, store_logo_url, store_banner_url",
        )
        .eq("id", userData.user.id)
        .single(),
      supabase
        .from("listings")
        .select("id, title, created_at, price, is_active, favorite_count, message_count, view_count")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("favorite_lists")
        .select("id, title, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("favorite_list_items")
        .select("favorite_list_id, listing_id, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("listing_conversations")
        .select("id, listing_id, seller_id, buyer_id, last_message_at")
        .or(`seller_id.eq.${userData.user.id},buyer_id.eq.${userData.user.id}`)
        .order("last_message_at", { ascending: false }),
      supabase
        .from("listing_messages")
        .select("conversation_id, body, sender_id, created_at")
        .order("created_at", { ascending: false }),
    ]);

  const profile = profileData as Profile | null;
  const listings = (listingsData ?? []) as Listing[];
  const favoriteLists = (favoriteListsData ?? []) as FavoriteList[];
  const favoriteItems = (favoriteItemsData ?? []) as FavoriteItem[];
  const conversations = (conversationsData ?? []) as Conversation[];
  const messages = (messagesData ?? []) as Message[];

  const activeTab = (() => {
    const allowedTabs = new Set(getAccountTabs(profile?.user_type ?? "bireysel").map((tab) => tab.key));
    const requestedTab = searchParams?.sekme ?? "ozet";
    return allowedTabs.has(requestedTab) ? requestedTab : "ozet";
  })();

  const favoriteListingIds = Array.from(new Set(favoriteItems.map((item) => item.listing_id)));
  const favoriteListingsMap = new Map<string, { id: string; title: string; price: number | null; images: string[] | null }>();
  const conversationListingIds = Array.from(new Set(conversations.map((conversation) => conversation.listing_id)));
  const listingIdsToLoad = Array.from(new Set([...favoriteListingIds, ...conversationListingIds]));

  if (listingIdsToLoad.length > 0) {
    const { data: relatedListings } = await supabase
      .from("listings")
      .select("id, title, price, images")
      .in("id", listingIdsToLoad);

    (relatedListings ?? []).forEach((listing) => {
      favoriteListingsMap.set(listing.id as string, {
        id: listing.id as string,
        title: listing.title as string,
        price: (listing.price as number | null) ?? null,
        images: (listing.images as string[] | null) ?? null,
      });
    });
  }

  const favoriteItemsByList = favoriteLists.map((list) => ({
    ...list,
    items: favoriteItems
      .filter((item) => item.favorite_list_id === list.id)
      .map((item) => ({
        listing: favoriteListingsMap.get(item.listing_id),
        created_at: item.created_at,
      }))
      .filter((item) => item.listing),
  }));

  const latestMessageByConversation = new Map<string, Message>();
  messages.forEach((message) => {
    if (!latestMessageByConversation.has(message.conversation_id)) {
      latestMessageByConversation.set(message.conversation_id, message);
    }
  });

  const messagePreviewRows = conversations.map((conversation) => {
    const listing = favoriteListingsMap.get(conversation.listing_id);
    const latestMessage = latestMessageByConversation.get(conversation.id);
    const roleLabel = conversation.seller_id === userData.user.id ? "Gelen talep" : "Gönderdiğiniz mesaj";
    return {
      ...conversation,
      listing,
      latestMessage,
      roleLabel,
    };
  });

  const totalViews = listings.reduce((sum, listing) => sum + (listing.view_count ?? 0), 0);
  const totalFavorites = listings.reduce((sum, listing) => sum + (listing.favorite_count ?? 0), 0);
  const totalMessages = listings.reduce((sum, listing) => sum + (listing.message_count ?? 0), 0);
  const displayName =
    profile?.user_type === "kurumsal"
      ? profile.company_name || profile.full_name || "-"
      : profile?.full_name || "-";
  const tabs = getAccountTabs(profile?.user_type ?? "bireysel");

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a5f]">Hesabım</h1>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-[#1e3a5f]">E-posta:</span> {userData.user.email}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Kullanıcı tipi:</span> {profile?.user_type ?? "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Ad / Şirket:</span> {displayName}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Şehir:</span> {profile?.city ?? "-"}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <SignOutButton />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Toplam ilan</p>
            <p className="mt-2 text-2xl font-bold text-[#1e3a5f]">{listings.length}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Toplam görüntülenme</p>
            <p className="mt-2 text-2xl font-bold text-[#1e3a5f]">{totalViews}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Toplam favori</p>
            <p className="mt-2 text-2xl font-bold text-[#1e3a5f]">{totalFavorites}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Toplam mesaj</p>
            <p className="mt-2 text-2xl font-bold text-[#1e3a5f]">{totalMessages}</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/hesabim?sekme=${tab.key}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeTab === tab.key
                ? "bg-[#1e3a5f] text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "ozet" ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f]">Hızlı durum</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>{favoriteLists.length} favori listeniz bulunuyor.</p>
              <p>{messagePreviewRows.length} aktif konuşmanız bulunuyor.</p>
              <p>
                Kurumsal mağaza sayfanız{" "}
                {profile?.user_type === "kurumsal" ? (
                  <Link href={`/magaza/${profile?.store_slug || userData.user.id}`} className="font-semibold text-[#f97316] hover:underline">
                    yayında
                  </Link>
                ) : (
                  "kurumsal üyelikte açılır"
                )}
                .
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f]">Kısayollar</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/ilan-ver" className="rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white">
                Yeni ilan ver
              </Link>
              <Link href="/hesabim?sekme=favoriler" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#1e3a5f]">
                Favorilerim
              </Link>
              <Link href="/mesajlar" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-[#1e3a5f]">
                Mesaj kutusu
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "profil" ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ProfileSettingsForm
            initialValues={{
              full_name: profile?.full_name ?? null,
              phone: profile?.phone ?? null,
              city: profile?.city ?? null,
              email: userData.user.email ?? null,
            }}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f]">Profil özeti</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-[#1e3a5f]">Ad soyad:</span> {profile?.full_name || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Telefon:</span> {profile?.phone || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Şehir:</span> {profile?.city || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">E-posta:</span> {userData.user.email || "-"}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "ilanlar" ? (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">İlanlarım</h2>
            <Link href="/ilan-ver" className="text-sm font-semibold text-[#f97316] hover:underline">
              Yeni ilan ver
            </Link>
          </div>
          {listings.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Henüz ilanınız yok.{" "}
              <Link href="/ilan-ver" className="font-semibold text-[#f97316] hover:underline">
                İlk ilanı ver
              </Link>
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={`/ilan/${listing.id}`} className="block flex-1 hover:text-[#f97316]">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#1e3a5f]">{listing.title}</p>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            listing.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {listing.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatPrice(listing.price)} - {formatDate(listing.created_at)}
                      </p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ilan/${listing.id}/duzenle`}
                        className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-[#1e3a5f] hover:border-[#f97316]"
                      >
                        Düzenle
                      </Link>
                      <ListingActions listingId={listing.id} isActive={listing.is_active} />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">
                      <p className="text-slate-500">Görüntülenme</p>
                      <p className="mt-1 text-lg font-semibold text-[#1e3a5f]">{listing.view_count ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">
                      <p className="text-slate-500">Favoriye alınma</p>
                      <p className="mt-1 text-lg font-semibold text-[#1e3a5f]">{listing.favorite_count ?? 0}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">
                      <p className="text-slate-500">Mesaj alma</p>
                      <p className="mt-1 text-lg font-semibold text-[#1e3a5f]">{listing.message_count ?? 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "favoriler" ? (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-[#1e3a5f]">Favori listelerim</h2>
          {favoriteItemsByList.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Henüz favori listeniz yok. İlan detaylarından liste oluşturmaya başlayabilirsiniz.</p>
          ) : (
            <div className="mt-5 space-y-5">
              {favoriteItemsByList.map((list) => (
                <div key={list.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1e3a5f]">{list.title}</h3>
                      <p className="text-sm text-slate-500">{list.items.length} ilan</p>
                    </div>
                  </div>
                  {list.items.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">Bu listede henüz ilan yok.</p>
                  ) : (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {list.items.map((item) => (
                        <Link
                          key={`${list.id}-${item.listing?.id}`}
                          href={`/ilan/${item.listing?.id}`}
                          className="rounded-lg border border-slate-200 p-3 transition hover:border-[#f97316]"
                        >
                          <p className="font-semibold text-[#1e3a5f]">{item.listing?.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{formatPrice(item.listing?.price ?? null)}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "mesajlar" ? (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Mesajlarım</h2>
            <Link href="/mesajlar" className="text-sm font-semibold text-[#f97316] hover:underline">
              Tümünü aç
            </Link>
          </div>
          {messagePreviewRows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Henüz mesaj konuşmanız yok.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {messagePreviewRows.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/mesajlar/${conversation.id}`}
                  className="block rounded-xl border border-slate-200 p-4 transition hover:border-[#f97316]"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#f97316]">
                        {conversation.roleLabel}
                      </p>
                      <p className="mt-1 font-semibold text-[#1e3a5f]">
                        {conversation.listing?.title ?? "İlan"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {conversation.latestMessage?.body ?? "Henüz mesaj görünmüyor."}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {formatDate(conversation.last_message_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "magaza" && profile?.user_type === "kurumsal" ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <StoreProfileForm
            initialValues={{
              company_name: profile.company_name,
              phone: profile.phone,
              city: profile.city,
              store_slug: profile.store_slug,
              store_description: profile.store_description,
              store_logo_url: profile.store_logo_url,
              store_banner_url: profile.store_banner_url,
            }}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f]">Mağaza yayını</h2>
            <p className="mt-3 text-sm text-slate-600">
              Kurumsal profiliniz mağaza vitrini olarak kullanılır. Aktif mağaza sayfanızı aşağıdan açabilirsiniz.
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-[#1e3a5f]">Görünen ad:</span> {displayName}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Şehir:</span> {profile.city || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Telefon:</span> {profile.phone || "-"}
              </p>
              <p>
                <span className="font-semibold text-[#1e3a5f]">Slug:</span> {profile.store_slug || "-"}
              </p>
            </div>
            <Link
              href={`/magaza/${profile.store_slug || userData.user.id}`}
              className="mt-5 inline-flex rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-white"
            >
              Mağaza sayfamı aç
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
