"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingHearts from "@/components/FloatingHearts";
import PageTransition from "@/components/PageTransition";

const LINES = [
  "Hi, miss KC! Kumusta? I hope you are doing well and happy!",
  "Bai, I dont know where I should start pero maybe this letter kay magtuyok2 lang HAHAHAHAHAHAHA",
  "Let me say this again, you 're so cute and gwapa jud bai 🥺",
  "If maybe you might still ask bai, nganong ikaw?",
  "Ikaw ang reason bai nganong naa koy nachange sa akoang self pero in a good way bai",
  "You made me realize nga I can do it pala, and I want to thank you for that. And,",
  "Aside ana bai, I really asked and prayed to God to meet a person like pareha sa imoha jud like pareha jud sa imoha, God-fearing or someone who knows God bai",
  "Kay as you know bai, ambot dili jud ko ganahan sa uban bai, ikaw jud akong gakakita sa akong future (I know sa akoa rani, but I hope sa imoha pod (medyo demading and assuming ra noh? HAHAHAHAHAHA))",
  "I really hope and pray na God will make a way para sa atong duha in the future. And akong balikon ni",
  "kung dili ikaw, dili na ko, I will be forever single na. Promise to you and promise to God.",
  "Kay ngano nag promise ko kay God? God knows me and my heart jud bai.",
  "Also becuase I know dili ko gwapo pareha sa uban but always nako ginadala akong pure intentions para dili makasakit sa tao and you know me nga ako jud iingon akong feelings HAHAHAHAHAHA",
  "No pressure sa imong side bai, ako jud na nga decision but promise me lang bai na throughout our journey unta honest ta sa atoang feelings bai.",
  "Pero bai, dili sa ingon nga dili ka honest ah kay I know you want to protect your heart and also mine, pareha man ta but dili jud nako mapugngan bai, gusto jud nako maingon man gud",
  "Kay mao lagi dili ko ganahan magmahay. Basta bai no pressure. I love you and will always love you for who and what you are.",
  "Basta promise me bai basta dili naka sa akins, just say it in a way nga gusto nimo iingon, and by that time, please hurt my feelings",
  "Pero bisan unsoan og hurt nimo bai, ikaw raman gihapon. Promise na HAHAHAHAHAHAHAHAHA",
  "But enough of that bai, I already said my feelings, unta ikaw pod hehe but....",
  "This is the last thing I want to ask...",
];

export default function ConfessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  const isLast = step === LINES.length - 1;

  const goTo = (next: number) => {
    setFadeKey((k) => k + 1);
    setStep(next);
  };

  return (
    <PageTransition className="parchment-bg relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <FloatingHearts count={12} />

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-card rounded-3xl px-6 py-10 sm:px-10 sm:py-14">
          <p
            key={fadeKey}
            className="confession-line text-center text-2xl leading-relaxed text-amber-900 sm:text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-cedarville)" }}
          >
            {LINES[step]}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => goTo(Math.max(0, step - 1))}
              disabled={step === 0}
              className="nav-btn rounded-full px-5 py-2 text-sm text-pink-800 sm:px-6 sm:py-2.5 sm:text-base"
            >
              ← Previous
            </button>
            <span className="text-sm text-amber-700/60">
              {step + 1} / {LINES.length}
            </span>
            {!isLast ? (
              <button
                onClick={() => goTo(step + 1)}
                className="nav-btn rounded-full px-5 py-2 text-sm text-pink-800 sm:px-6 sm:py-2.5 sm:text-base"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => router.push("/final/")}
                className="btn-continue rounded-full px-5 py-2 text-sm font-medium text-white sm:px-6 sm:py-2.5 sm:text-base"
              >
                Continue 💌
              </button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
