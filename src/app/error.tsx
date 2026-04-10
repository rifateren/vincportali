"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-extrabold text-[#1e3a5f]">Bir hata oluştu</h1>
      <p className="mt-4 max-w-md text-sm text-slate-500">
        Beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#1e3a5f] transition hover:border-[#f97316] hover:text-[#f97316]"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </main>
  );
}
