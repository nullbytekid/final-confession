"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getSiteStatus,
  verifyPassword,
  type SiteStatus,
} from "@/lib/api";

interface SiteContextValue {
  status: SiteStatus | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteContext = createContext<SiteContextValue>({
  status: null,
  loading: true,
  refresh: async () => {},
});

export function useSiteStatus() {
  return useContext(SiteContext);
}

function PasswordScreen({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await verifyPassword(password);
    setSubmitting(false);
    if (result.ok) {
      onSuccess();
    } else {
      setError(result.error || "Incorrect password");
    }
  };

  return (
    <div className="pastel-bg fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-sm rounded-3xl px-8 py-10 text-center">
        <p className="mb-2 text-3xl">🔒</p>
        <h2
          className="mb-2 text-2xl text-pink-800"
          style={{ fontFamily: "var(--font-cedarville)" }}
        >
          Welcome back, Kasandra
        </h2>
        <p className="mb-6 text-sm text-pink-600/80">
          Enter your password to open the confession
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="rounded-full border border-pink-200 bg-white/60 px-5 py-3 text-center text-pink-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting || !password}
            className="btn-continue rounded-full px-6 py-3 font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Checking..." : "Enter 💖"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SiteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<SiteStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  const refresh = useCallback(async () => {
    const data = await getSiteStatus();
    setStatus(data);
    if (data?.authenticated) setUnlocked(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const needsPassword =
    status?.password_set && !status.authenticated && !unlocked;

  if (loading) {
    return (
      <div className="pastel-bg flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-pink-400">Loading...</p>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <PasswordScreen
        onSuccess={() => {
          setUnlocked(true);
          refresh();
        }}
      />
    );
  }

  return (
    <SiteContext.Provider value={{ status, loading, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}
