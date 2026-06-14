"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FloatingHearts from "@/components/FloatingHearts";
import PageTransition from "@/components/PageTransition";
import StopCourtingModal from "@/components/StopCourtingModal";
import YesSinceMessage from "@/components/YesSinceMessage";
import { useSiteStatus } from "@/components/SiteProvider";
import { sendYes, setPassword, stopCourting } from "@/lib/api";

type Phase = "lights-off" | "question" | "set-password" | "done";

export default function FinalPage() {
  const { status, refresh } = useSiteStatus();
  const [lightsOn, setLightsOn] = useState(false);
  const [phase, setPhase] = useState<Phase>("lights-off");
  const [password, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [yesLoading, setYesLoading] = useState(false);

  useEffect(() => {
    if (!status?.said_yes) return;
    setLightsOn(true);
    setPhase(status.password_set ? "done" : "set-password");
  }, [status]);

  const handleLightsOn = () => {
    setLightsOn(true);
    if (status?.said_yes) {
      setPhase(status.password_set ? "done" : "set-password");
    } else {
      setPhase("question");
    }
  };

  const handleYes = async () => {
    setYesLoading(true);
    const result = await sendYes();
    await refresh();
    setYesLoading(false);
    if (result.ok) {
      setPhase("set-password");
    } else if (result.error) {
      alert(result.error);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const result = await setPassword(password);
    setSubmitting(false);
    if (result.ok) {
      await refresh();
      setPhase("done");
    } else {
      setPasswordError(result.error || "Could not save password");
    }
  };

  const handleStopCourting = async (reason: string) => {
    setSubmitting(true);
    const result = await stopCourting(reason);
    setSubmitting(false);
    if (result.ok) {
      setShowStopModal(false);
      await refresh();
    }
  };

  return (
    <PageTransition
      className={`relative flex min-h-screen flex-col items-center justify-center px-4 py-8 ${
        lightsOn ? "lights-on-bg" : "lights-off-bg"
      }`}
    >
      {!lightsOn && (
        <div className="cinematic-fog pointer-events-none absolute inset-0" />
      )}

      {lightsOn && <FloatingHearts count={10} />}

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 text-center sm:gap-8">
        {phase === "lights-off" && (
          <>
            <p className="text-sm text-white/20 sm:text-base">
              it&apos;s dark in here...
            </p>
            <button
              onClick={handleLightsOn}
              className="lights-btn rounded-full px-8 py-3 text-base font-medium sm:text-lg"
            >
              Turn on the lights 💡
            </button>
          </>
        )}

        {lightsOn && phase === "question" && (
          <>
            <h1 className="neon-text lights-on font-bold animate-[fadeInLine_0.8s_ease-out_both]">
              MAY I COURT YOU?
            </h1>
            <div className="flex flex-col items-center gap-3 animate-[fadeInLine_0.8s_ease-out_both] sm:flex-row sm:gap-4">
              <button
                onClick={handleYes}
                disabled={yesLoading}
                className="btn-yes w-full max-w-[200px] rounded-full px-8 py-3 text-base font-medium text-white disabled:opacity-60 sm:w-auto"
              >
                {yesLoading ? "Sending..." : "YES 💖"}
              </button>
              <button
                disabled
                aria-disabled="true"
                className="btn-no btn-no-disabled w-full max-w-[200px] cursor-not-allowed rounded-full px-8 py-3 text-base font-medium text-white/50 sm:w-auto"
              >
                NO 💔
              </button>
            </div>
          </>
        )}

        {lightsOn && phase === "set-password" && (
          <div className="glass-card w-full animate-[fadeInLine_0.8s_ease-out_both] rounded-3xl px-6 py-8 sm:px-10">
            <p className="mb-1 text-3xl">💖</p>
            <h2
              className="mb-2 text-2xl text-pink-800"
              style={{ fontFamily: "var(--font-cedarville)" }}
            >
              You said YES!
            </h2>
            {status?.said_yes_at && (
              <div className="mb-4">
                <YesSinceMessage saidYesAt={status.said_yes_at} />
              </div>
            )}
            <p className="mb-6 text-sm text-pink-600/80">
              Create a password to protect this site — you&apos;ll need it every
              time you visit.
            </p>
            <form onSubmit={handleSetPassword} className="flex flex-col gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Create password"
                className="rounded-full border border-pink-200 bg-white/60 px-5 py-3 text-center text-pink-900 outline-none focus:border-pink-400"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="rounded-full border border-pink-200 bg-white/60 px-5 py-3 text-center text-pink-900 outline-none focus:border-pink-400"
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-continue mt-2 rounded-full py-3 font-medium text-white disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Password 🔒"}
              </button>
            </form>
          </div>
        )}

        {lightsOn && phase === "done" && (
          <div className="flex flex-col items-center gap-6 animate-[fadeInLine_0.8s_ease-out_both]">
            <h1 className="neon-text lights-on font-bold">
              {status?.stop_courting
                ? "Goodbye for now..."
                : "Together at last 💖"}
            </h1>
            <p
              className="text-xl text-pink-800 sm:text-2xl"
              style={{ fontFamily: "var(--font-cedarville)" }}
            >
              {status?.stop_courting
                ? "Your message has been sent."
                : "You said yes. This moment is yours forever."}
            </p>

            {status?.said_yes_at && !status.stop_courting && (
              <YesSinceMessage saidYesAt={status.said_yes_at} />
            )}

            {!status?.stop_courting && (
              <button
                onClick={() => setShowStopModal(true)}
                disabled={submitting}
                className="btn-no rounded-full px-8 py-3 text-base font-medium text-white"
              >
                Stop Courting 💔
              </button>
            )}

            <Link
              href="/"
              className="nav-btn rounded-full px-6 py-2.5 text-sm text-pink-800 transition-all hover:shadow-md"
            >
              Back to the beginning 💌
            </Link>
          </div>
        )}
      </div>

      <StopCourtingModal
        open={showStopModal}
        onClose={() => setShowStopModal(false)}
        onSubmit={handleStopCourting}
      />
    </PageTransition>
  );
}
