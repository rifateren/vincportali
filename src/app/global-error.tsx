"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
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
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1e3a5f" }}>
            Bir hata oluştu
          </h1>
          <p style={{ marginTop: "1rem", color: "#64748b", maxWidth: "28rem" }}>
            Beklenmeyen bir sorun oluştu. Lütfen sayfayı yenileyin.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#f97316",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Tekrar Dene
          </button>
        </main>
      </body>
    </html>
  );
}
