"use client";

import { useState } from "react";

function digitsForTel(raw: string) {
  return raw.replace(/[^0-9+]/g, "");
}

type PhoneRevealProps = {
  contactPhone: string;
  className?: string;
};

export default function PhoneReveal({ contactPhone, className }: PhoneRevealProps) {
  const [showPhone, setShowPhone] = useState(false);
  const telHref = `tel:${digitsForTel(contactPhone)}`;

  if (showPhone && contactPhone) {
    return (
      <div className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className ?? ""}`}>
        <a
          href={telHref}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-[#f97316] px-4 py-3 text-center text-base font-semibold text-white"
        >
          Ara: {contactPhone}
        </a>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowPhone(true)}
      className={`min-h-[48px] w-full rounded-lg bg-[#f97316] px-4 py-3 text-base font-semibold text-white ${className ?? ""}`}
    >
      Telefonu göster
    </button>
  );
}
