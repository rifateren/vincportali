"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function UnreadBadge() {
  const supabase = useMemo(() => createClient(), []);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data } = await supabase.rpc("get_unread_conversation_count", {
        p_user_id: user.id,
      });

      if (!cancelled && typeof data === "number") {
        setCount(data);
      }
    }

    fetchCount();

    const interval = setInterval(fetchCount, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [supabase]);

  return (
    <Link href="/mesajlar" className="site-nav-link desktop-only" style={{ position: "relative" }}>
      Mesajlar
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            minWidth: 18,
            height: 18,
            borderRadius: 999,
            background: "#ef4444",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
