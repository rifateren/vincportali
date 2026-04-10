"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FavoriteListOption = {
  id: string;
  title: string;
  containsListing: boolean;
};

type FavoriteButtonProps = {
  listingId: string;
  isLoggedIn: boolean;
  initialLists: FavoriteListOption[];
};

export default function FavoriteButton({
  listingId,
  isLoggedIn,
  initialLists,
}: FavoriteButtonProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [lists, setLists] = useState(initialLists);
  const [isOpen, setIsOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savedCount = lists.filter((list) => list.containsListing).length;
  const defaultListTitle = "Favori Listem";

  async function ensureDefaultList() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Favorilere eklemek için giriş yapmalısınız.");
    }

    const existingDefaultList = lists.find((list) => list.title === defaultListTitle);

    if (existingDefaultList) {
      return existingDefaultList;
    }

    const { data: listData, error: listError } = await supabase
      .from("favorite_lists")
      .insert({ title: defaultListTitle, user_id: user.id })
      .select("id, title")
      .single();

    if (listError || !listData) {
      throw listError ?? new Error("Varsayılan favori listesi oluşturulamadı.");
    }

    const createdList = {
      id: listData.id,
      title: listData.title,
      containsListing: false,
    };

    setLists((current) => [...current, createdList]);
    return createdList;
  }

  async function toggleList(listId: string, containsListing: boolean) {
    setIsSaving(true);
    setError(null);

    if (!isLoggedIn) {
      window.location.href = "/giris";
      return;
    }

    try {
      if (containsListing) {
        const { error: itemError } = await supabase
          .from("favorite_list_items")
          .delete()
          .eq("favorite_list_id", listId)
          .eq("listing_id", listingId);

        if (itemError) throw itemError;
      } else {
        const { error: itemError } = await supabase
          .from("favorite_list_items")
          .insert({ favorite_list_id: listId, listing_id: listingId });

        if (itemError) throw itemError;
      }

      setLists((current) =>
        current.map((list) =>
          list.id === listId ? { ...list, containsListing: !containsListing } : list,
        ),
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Favori güncellenemedi.");
    } finally {
      setIsSaving(false);
    }
  }

  async function createList() {
    const title = newListTitle.trim();
    if (!title) return;

    setIsSaving(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Liste oluşturmak için giriş yapmalısınız.");
      }

      const { data: listData, error: listError } = await supabase
        .from("favorite_lists")
        .insert({ title, user_id: user.id })
        .select("id, title")
        .single();

      if (listError || !listData) throw listError ?? new Error("Liste oluşturulamadı.");

      const { error: itemError } = await supabase
        .from("favorite_list_items")
        .insert({ favorite_list_id: listData.id, listing_id: listingId });

      if (itemError) throw itemError;

      setLists((current) => [
        ...current,
        { id: listData.id, title: listData.title, containsListing: true },
      ]);
      setNewListTitle("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Liste oluşturulamadı.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleQuickSave() {
    if (!isLoggedIn) {
      window.location.href = "/giris";
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const existingSavedList = lists.find((list) => list.containsListing);

      if (existingSavedList) {
        setIsOpen((value) => !value);
        return;
      }

      const targetList = await ensureDefaultList();
      const { error: itemError } = await supabase
        .from("favorite_list_items")
        .insert({ favorite_list_id: targetList.id, listing_id: listingId });

      if (itemError) throw itemError;

      setLists((current) =>
        current.map((list) =>
          list.id === targetList.id ? { ...list, containsListing: true } : list,
        ),
      );
      setIsOpen(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Favori kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">Favoriler</p>
      <button
        type="button"
        onClick={handleQuickSave}
        className="mt-3 min-h-[48px] w-full rounded-lg border border-[#f97316] px-4 py-2 text-sm font-semibold text-[#f97316] transition hover:bg-orange-50"
      >
        {isSaving ? "Kaydediliyor..." : savedCount > 0 ? `Kaydedildi (${savedCount})` : "Favorilere ekle"}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            {lists.length === 0 ? (
              <p className="text-sm text-slate-600">Henüz favori listeniz yok. Aşağıdan yeni bir liste oluşturun.</p>
            ) : (
              lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  disabled={isSaving}
                  onClick={() => toggleList(list.id, list.containsListing)}
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    list.containsListing
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{list.title}</span>
                  <span>{list.containsListing ? "Çıkar" : "Ekle"}</span>
                </button>
              ))
            )}
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <label className="block text-sm font-medium text-[#1e3a5f]" htmlFor="newFavoriteList">
              Yeni favori listesi
            </label>
            <input
              id="newFavoriteList"
              value={newListTitle}
              onChange={(event) => setNewListTitle(event.target.value)}
              placeholder="Ornek: Forklift Favorilerim"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#f97316]"
            />
            <button
              type="button"
              disabled={isSaving || !newListTitle.trim()}
              onClick={createList}
              className="w-full rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Liste oluştur ve kaydet
            </button>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      )}
    </div>
  );
}
