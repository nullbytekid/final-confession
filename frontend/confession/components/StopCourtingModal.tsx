"use client";

import { useEffect, useState } from "react";

interface StopCourtingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

type Step = "reason" | "confirm";

export default function StopCourtingModal({
  open,
  onClose,
  onSubmit,
}: StopCourtingModalProps) {
  const [step, setStep] = useState<Step>("reason");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("reason");
      setReason("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const handleReasonNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please write a reason");
      return;
    }
    setError("");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    await onSubmit(reason.trim());
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-3xl px-6 py-8 sm:px-8">
        {step === "reason" ? (
          <>
            <h3
              className="mb-2 text-center text-2xl text-pink-800"
              style={{ fontFamily: "var(--font-cedarville)" }}
            >
              Stop Courting 💔
            </h3>
            <p className="mb-5 text-center text-sm text-pink-600/80">
              Please share your reason — it will be sent with care. I know this
              one hurts but I will accept it with all my heart. Hope we can see
              each other again.
            </p>
            <form onSubmit={handleReasonNext} className="flex flex-col gap-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write your reason here..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-pink-200 bg-white/60 px-4 py-3 text-pink-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="nav-btn flex-1 rounded-full py-2.5 text-pink-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-no flex-1 rounded-full py-2.5 font-medium text-white"
                >
                  Continue 💔
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="mb-2 text-center text-4xl">⚠️</p>
            <h3
              className="mb-2 text-center text-2xl text-pink-800"
              style={{ fontFamily: "var(--font-cedarville)" }}
            >
              Are you sure?
            </h3>
            <p className="mb-4 text-center text-sm text-pink-600/80">
              This will send your message to Marlon and Kasandra. You cannot
              undo this.
            </p>
            <div className="reason-preview mb-5 rounded-2xl border border-pink-200/60 bg-white/50 px-4 py-3 text-left text-sm text-pink-900">
              <p className="mb-1 text-xs font-medium text-pink-500">Your reason:</p>
              <p className="italic">&ldquo;{reason.trim()}&rdquo;</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep("reason")}
                disabled={submitting}
                className="nav-btn flex-1 rounded-full py-2.5 text-pink-800"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="btn-no flex-1 rounded-full py-2.5 font-medium text-white disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Yes, I'm sure 💔"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
