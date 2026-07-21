import React, { useState, useCallback } from "react";
import { analyzePsoriasis } from "../../apis/psoriasisApi";
import PsoriasisUpload from "../../components/module/PsoriasisUpload";
import PsoriasisResult from "../../components/module/PsoriasisResult";

const RESEARCH_GAPS = [
  {
    title: "Color Dependence",
    description:
      "Conventional models over-rely on erythema (redness) cues, causing biased predictions across diverse skin tones.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21c4.5-4.2 7.5-8 7.5-11.5A7.5 7.5 0 0 0 4.5 9.5C4.5 13 7.5 16.8 12 21Z"
      />
    ),
  },
  {
    title: "Fine Texture",
    description:
      "Subtle scaling and lesion texture patterns are often missed by standard CNN architectures tuned for coarse features.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75h6v6h-6v-6Zm10.5 0h6v6h-6v-6Zm-10.5 10.5h6v6h-6v-6Zm10.5 0h6v6h-6v-6Z"
      />
    ),
  },
  {
    title: "Early Stage",
    description:
      "Early-stage psoriasis presents minimal visual symptoms, causing high false-negative rates in conventional detectors.",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75V12l3.75 2.25"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </>
    ),
  },
  {
    title: "Attention Mechanism",
    description:
      "XORA integrates attention-based mechanisms to localize lesion regions independent of underlying skin color bias.",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        />
      </>
    ),
  },
];

export default function PsoriasisHome() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzePsoriasis(file);
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return (
    <div className="min-h-screen w-full bg-[#0A1628] text-white">
      {error && (
        <div className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm animate-[fadeIn_0.4s_ease-out] rounded-xl border border-red-500/40 bg-[#1a0f0f] p-4 shadow-lg shadow-black/50 sm:right-6 sm:top-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              !
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400">
                Analysis Failed
              </p>
              <p className="mt-1 text-sm text-slate-300">{error}</p>
            </div>
            <button
              type="button"
              onClick={dismissError}
              className="text-slate-500 transition hover:text-slate-300"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-5xl px-4 pb-8 pt-16 text-center sm:px-6 md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
          XORA Module 2
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Psoriasis Detection
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
          An attention-driven deep learning pipeline for detecting psoriasis
          lesions and estimating severity across diverse skin tones.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESEARCH_GAPS.map((gap) => (
            <div
              key={gap.title}
              className="rounded-2xl border border-[#00B4D8]/15 bg-[#0d1f33] p-5 transition hover:border-[#00B4D8]/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00B4D8]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#00B4D8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {gap.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">
                {gap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {gap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {result ? (
          <PsoriasisResult result={result} onReset={handleReset} />
        ) : (
          <PsoriasisUpload onAnalyze={handleAnalyze} loading={loading} />
        )}
      </section>
    </div>
  );
}
