"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FloatingHearts from "@/components/FloatingHearts";
import ImageLightbox from "@/components/ImageLightbox";
import PageTransition from "@/components/PageTransition";
import {
  preloadWheresaMusic,
  startWheresaMusic,
} from "@/components/WheresaMusic";
import {
  submitWheresaDateConfirm,
  submitWheresaWellness,
} from "@/lib/api";

const ROUTE_IMAGES = [
  { src: "/picture/route(1).png", alt: "Our route — part 1" },
  { src: "/picture/route(2).png", alt: "Our route — part 2" },
  { src: "/picture/route(3).png", alt: "Our route — part 3" },
];

const STOPOVERS = [
  {
    number: 1,
    name: "Claveria View Deck",
    description:
      "We'll breathe in the mountains together — quiet moments, pretty views, and just us under the sky.",
  },
  {
    number: 2,
    name: "Dragon's Tail Tambayan",
    description:
      "Then we'll eat their best-selling sisig and sip their best sikwate — warm, cozy, and made for two.",
  },
];

export default function WheresaPage() {
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);
  const [wellnessWords, setWellnessWords] = useState("");
  const [finalWords, setFinalWords] = useState("");
  const [saidYes, setSaidYes] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    preloadWheresaMusic();
  }, []);

  const goTo = (next: number) => {
    setFadeKey((k) => k + 1);
    setStep(next);
  };

  const handlePage1Next = async () => {
    if (!wellnessWords.trim() || submitting) return;
    setSubmitting(true);
    startWheresaMusic();
    const result = await submitWheresaWellness(wellnessWords.trim());
    setSubmitting(false);
    if (!result.ok) {
      alert(result.error || "Could not send your message. Please try again.");
      return;
    }
    goTo(2);
  };

  const handleYes = async () => {
    if (!finalWords.trim() || submitting) return;
    setSubmitting(true);
    const result = await submitWheresaDateConfirm(finalWords.trim());
    setSubmitting(false);
    if (!result.ok) {
      alert(result.error || "Could not send your response. Please try again.");
      return;
    }
    setSaidYes(true);
  };

  return (
    <PageTransition className="wheresa-bg relative min-h-screen">
      <FloatingHearts count={14} />

      <div className="wheresa-overlay relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div
          key={fadeKey}
          className="wheresa-card confession-line w-full max-w-xl rounded-3xl px-6 py-8 sm:max-w-2xl sm:px-10 sm:py-12"
        >
          {step === 1 && (
            <>
              <p
                className="text-center text-2xl leading-relaxed text-pink-900 sm:text-3xl"
                style={{ fontFamily: "var(--font-cedarville)" }}
              >
                My dearest Kasandra... 💕
              </p>
              <p className="mt-4 text-center text-base leading-relaxed text-pink-800/90 sm:text-lg">
                Before anything else, I just want to know — are you okay,
                physically and mentally? Your heart matters so much to me, and I
                hope you&apos;re taking care of yourself, bai.
              </p>
              <p className="mt-3 text-center text-sm text-pink-700/80 sm:text-base">
                If you have words for me, even just a little, I&apos;d love to
                hear them... 🥺
              </p>
              <textarea
                value={wellnessWords}
                onChange={(e) => setWellnessWords(e.target.value)}
                placeholder="Type your words here, Kasandra..."
                rows={4}
                className="wheresa-input mt-6 w-full resize-none rounded-2xl px-4 py-3 text-pink-900 placeholder:text-pink-400/70"
              />
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handlePage1Next}
                  disabled={!wellnessWords.trim() || submitting}
                  className="btn-continue rounded-full px-8 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Sending..." : "Next →"}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p
                className="text-center text-2xl leading-relaxed text-pink-900 sm:text-3xl md:text-4xl"
                style={{ fontFamily: "var(--font-cedarville)" }}
              >
                If ever... can I hiram your time this Saturdayyyyy? 🥹
              </p>
              <p className="mt-3 text-center text-sm text-pink-700/80 sm:text-base">
                I&apos;ve been thinking about you, and I&apos;d really love to
                spend a little slice of the day with you...
              </p>
              <div className="mt-6 flex justify-center">
                <div className="rounded-2xl bg-white/40 p-3 shadow-lg backdrop-blur-sm">
                  <Image
                    src="/picture/shydog.gif"
                    alt="Shy dog"
                    width={220}
                    height={220}
                    unoptimized
                    className="h-auto w-[clamp(160px,50vw,240px)] rounded-xl"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => goTo(3)}
                  className="btn-continue rounded-full px-6 py-3 text-center text-sm font-medium text-white sm:px-8 sm:text-base"
                >
                  I want to take you to the PROVINCE OF CLAVERIA 💌
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p
                className="text-center text-2xl text-pink-900 sm:text-3xl"
                style={{ fontFamily: "var(--font-cedarville)" }}
              >
                Our little adventure route
              </p>
              <p className="mt-2 text-center text-sm text-pink-700/80 sm:text-base">
                Tap any picture to take a closer look — I planned this with you
                in mind.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ROUTE_IMAGES.map((img) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setLightbox(img.src)}
                    className="route-thumb group overflow-hidden rounded-xl border-2 border-pink-200/60 bg-white/30 shadow-md transition-all hover:scale-[1.03] hover:border-pink-400 hover:shadow-lg"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={400}
                      height={300}
                      unoptimized
                      className="h-auto w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="block py-1.5 text-xs text-pink-700/70">
                      Tap to view ✨
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-center text-lg text-pink-800 sm:text-xl">
                  Our stopovers along the way...
                </p>
                {STOPOVERS.map((stop) => (
                  <div
                    key={stop.number}
                    className="rounded-2xl border border-pink-200/50 bg-white/35 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-sm font-medium text-pink-600">
                      Stopover {stop.number}
                    </p>
                    <p
                      className="mt-1 text-xl text-pink-900"
                      style={{ fontFamily: "var(--font-cedarville)" }}
                    >
                      {stop.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-pink-800/85 sm:text-base">
                      {stop.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => goTo(4)}
                  className="btn-continue rounded-full px-8 py-3 text-base font-medium text-white"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 4 && !saidYes && (
            <>
              <p
                className="text-center text-2xl text-pink-900 sm:text-3xl"
                style={{ fontFamily: "var(--font-cedarville)" }}
              >
                The details, just for you 💌
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-pink-200/50 bg-white/35 px-5 py-5 backdrop-blur-sm">
                <DetailRow label="WHO" value="MARLON AND KASANDRA" />
                <DetailRow
                  label="WHY"
                  value="To have a time with you hehe"
                />
                <DetailRow label="WHERE" value="PROVINCE OF CLAVERIA" />
                <DetailRow
                  label="WHEN"
                  value="Saturday, June 4, 2026 at 2:00 PM"
                />
              </div>

              <p className="mt-6 text-center text-lg text-pink-800 sm:text-xl">
                Are you okay with the date and time? 🥺
              </p>

              <textarea
                value={finalWords}
                onChange={(e) => setFinalWords(e.target.value)}
                placeholder="Say anything you want, Kasandra..."
                rows={3}
                className="wheresa-input mt-4 w-full resize-none rounded-2xl px-4 py-3 text-pink-900 placeholder:text-pink-400/70"
              />

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleYes}
                  disabled={!finalWords.trim() || submitting}
                  className="btn-yes rounded-full px-10 py-3 text-lg font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Sending..." : "YES 💕"}
                </button>
                <button
                  type="button"
                  disabled
                  className="btn-no btn-no-disabled rounded-full px-10 py-3 text-lg font-medium text-white"
                  title="This button is not an option 😌"
                >
                  NO
                </button>
              </div>
            </>
          )}

          {step === 4 && saidYes && (
            <div className="text-center">
              <p className="text-5xl">💕</p>
              <p
                className="mt-4 text-3xl text-pink-900 sm:text-4xl"
                style={{ fontFamily: "var(--font-cedarville)" }}
              >
                See you Saturday, my love!
              </p>
              <p className="mt-4 text-base leading-relaxed text-pink-800/90 sm:text-lg">
                Thank you for saying yes. I can&apos;t wait to share Claveria
                with you — the views, the sisig, the sikwate, and every little
                moment in between. You just made my whole week brighter. 🥹✨
              </p>
              <p className="mt-3 text-sm text-pink-600/80">
                Province of Claveria, 2:00 PM — it&apos;s a date. 💌
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-pink-700/50">
          {step} / 4
        </p>
      </div>

      {lightbox && (
        <ImageLightbox
          src={lightbox}
          alt="Route preview"
          onClose={() => setLightbox(null)}
        />
      )}
    </PageTransition>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <span className="min-w-[4.5rem] text-sm font-semibold tracking-wide text-pink-600">
        {label}:
      </span>
      <span
        className="text-base text-pink-900 sm:text-lg"
        style={{ fontFamily: "var(--font-cedarville)" }}
      >
        {value}
      </span>
    </div>
  );
}
