"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FloatingHearts from "@/components/FloatingHearts";
import HeartBurst from "@/components/HeartBurst";
import PageTransition from "@/components/PageTransition";
import { startConfessionMusic } from "@/components/BackgroundMusic";
import { notifyOpened } from "@/lib/api";

const ENVELOPE_GIF =
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2ZucXl3ZHNzcm9hcmV5Y2hubDNiMThqNWlnZ3BmMWdmYzM2YTZ5NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MFbHKafrEkofDG3y14/giphy.gif";

export default function LandingPage() {
  const router = useRouter();
  const [burst, setBurst] = useState(false);
  const [opening, setOpening] = useState(false);

  const handleEnvelopeClick = async () => {
    if (opening) return;
    setOpening(true);

    setBurst(true);
    void startConfessionMusic();
    await notifyOpened();

    setTimeout(() => {
      router.push("/confession/");
    }, 2000);
  };

  return (
    <PageTransition className="pastel-bg relative flex min-h-screen flex-col items-center justify-center px-4">
      <FloatingHearts />
      <HeartBurst active={burst} />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:gap-8">
        <p className="glow-text max-w-xs text-xl font-medium text-pink-800 sm:max-w-md sm:text-2xl md:text-3xl">
          There is something i want to confess 💌
        </p>

        <button
          onClick={handleEnvelopeClick}
          disabled={opening}
          className="envelope-btn cursor-pointer rounded-2xl bg-white/30 p-3 backdrop-blur-sm transition-all disabled:cursor-wait disabled:opacity-70 sm:p-4"
          aria-label="Open envelope"
        >
          <Image
            src={ENVELOPE_GIF}
            alt="Love envelope"
            width={200}
            height={200}
            unoptimized
            className="h-auto w-[clamp(140px,40vw,220px)]"
            priority
          />
        </button>

        <p className="text-sm text-pink-600/70 animate-pulse">
          tap the envelope ✨
        </p>
      </div>
    </PageTransition>
  );
}
