"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type ListingActionsProps = {
  listingId: string;
  isActive: boolean;
};

export default function ListingActions({
  listingId,
  isActive: initialIsActive,
}: ListingActionsProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function toggleActive() {
    setLoading(true);
    const { error } = await supabase
      .from("listings")
      .update({ is_active: !isActive })
      .eq("id", listingId);

    if (error) {
      toast.error(error.message || "Durum güncellenemedi.");
    } else {
      setIsActive(!isActive);
      toast.success(isActive ? "İlan pasife alındı." : "İlan yayına alındı.");
      router.refresh();
    }
    setLoading(false);
  }

  async function deleteListing() {
    setLoading(true);
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId);

    if (error) {
      toast.error(error.message || "İlan silinemedi.");
    } else {
      toast.success("İlan silindi.");
      router.refresh();
    }
    setLoading(false);
    setShowDeleteConfirm(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={toggleActive}
        className={`shrink-0 rounded-lg border px-3 py-2 text-center text-xs font-semibold transition disabled:opacity-50 ${
          isActive
            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
        }`}
      >
        {isActive ? "Pasife Al" : "Aktif Et"}
      </button>

      {showDeleteConfirm ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={loading}
            onClick={deleteListing}
            className="shrink-0 rounded-lg border border-red-400 bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            Evet, Sil
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600"
          >
            İptal
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-center text-xs font-semibold text-red-500 hover:border-red-400 hover:bg-red-50"
        >
          Sil
        </button>
      )}
    </div>
  );
}
