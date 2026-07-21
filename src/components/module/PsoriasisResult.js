import React, { useState, useCallback, useEffect, useMemo } from "react";

const SEVERITY_INFO = {
  Normal: {
    heading: "No Signs of Psoriasis Found",
    message:
      "Your skin looks healthy in this scan. XORA did not find patterns that usually indicate psoriasis.",
    recommendation:
      "No action needed right now. If you notice new redness, scaling, or itching later on, feel free to scan again.",
    theme: {
      banner: "bg-emerald-500/10 border border-emerald-500/25",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      heading: "text-emerald-300",
      tipBg: "bg-emerald-500/5 border border-emerald-500/15",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  "Early Psoriasis": {
    heading: "Early Signs Detected",
    message:
      "XORA spotted some early patterns that can be associated with psoriasis. This is a heads-up, not a diagnosis.",
    recommendation:
      "Keep an eye on the area over the next few weeks. If it spreads, changes, or bothers you, it's worth showing a dermatologist.",
    theme: {
      banner: "bg-amber-500/10 border border-amber-500/25",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      heading: "text-amber-300",
      tipBg: "bg-amber-500/5 border border-amber-500/15",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0 3.75h.008M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.3 2.25h17.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
      />
    ),
  },
  Psoriasis: {
    heading: "Signs of Psoriasis Detected",
    message:
      "XORA found patterns that closely match psoriasis in this scan. It's a good idea to get this checked properly.",
    recommendation:
      "Please book a visit with a certified dermatologist. They can confirm the result and walk you through treatment options.",
    theme: {
      banner: "bg-red-500/10 border border-red-500/25",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      heading: "text-red-300",
      tipBg: "bg-red-500/5 border border-red-500/15",
    },
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
};

const DEFAULT_SEVERITY_INFO = {
  heading: "Scan Complete",
  message: "XORA finished analyzing your photo.",
  recommendation:
    "If you have any concerns about your skin, a certified dermatologist can give you a proper assessment.",
  theme: {
    banner: "bg-slate-500/10 border border-slate-500/25",
    iconBg: "bg-slate-500/20",
    iconColor: "text-slate-300",
    heading: "text-slate-200",
    tipBg: "bg-slate-500/5 border border-slate-500/15",
  },
  icon: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25h.008v.008h-.008v-.008ZM12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-.75-6h1.5v-4.5h-1.5v4.5Zm.75-6.75h.008v.008H12v-.008Z"
    />
  ),
};

const SKIN_TONE_CLASSES = {
  Light: "bg-[#F5D0A9]",
  Medium: "bg-[#C8956C]",
  Dark: "bg-[#5C3317]",
};
const DEFAULT_SKIN_TONE_CLASS = "bg-[#94A3B8]";

function toPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return 0;
  const num = Number(value);
  const asPercent = num <= 1 ? num * 100 : num;
  return Math.min(100, Math.max(0, Math.round(asPercent)));
}

function confidenceWording(pct) {
  if (pct >= 85) return "Very confident";
  if (pct >= 70) return "Confident";
  if (pct >= 50) return "Somewhat confident";
  return "Low confidence";
}

function coverageWording(pct) {
  if (pct >= 60) return "Extensive";
  if (pct >= 30) return "Moderate";
  if (pct >= 10) return "Mild";
  return "Minimal";
}

export default function PsoriasisResult({ result, onReset }) {
  const [activeTab, setActiveTab] = useState("original");
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    setBarsReady(false);
    const id = requestAnimationFrame(() => {
      setTimeout(() => setBarsReady(true), 50);
    });
    return () => cancelAnimationFrame(id);
  }, [result]);

  const confidencePercent = useMemo(
    () => toPercent(result?.confidence),
    [result]
  );
  const coveragePercent = useMemo(
    () => toPercent(result?.coverage_percent),
    [result]
  );

  const severity = SEVERITY_INFO[result?.label] || DEFAULT_SEVERITY_INFO;
  const skinToneClass =
    SKIN_TONE_CLASSES[result?.skin_tone_group] || DEFAULT_SKIN_TONE_CLASS;
  const hasMask = Boolean(result?.mask_overlay_base64);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (!result) return null;

  const displayedImageBase64 =
    activeTab === "mask" && hasMask
      ? result.mask_overlay_base64
      : result.original_image_base64;

  return (
    <div className="mx-auto w-full max-w-2xl animate-[fadeIn_0.6s_ease-out] rounded-2xl border border-[#00B4D8]/20 bg-[#0d1f33] p-6 shadow-lg shadow-black/40 md:p-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-[#00B4D8] transition hover:text-[#00cfff]"
        >
          ← New Scan
        </button>
      </div>

      <div className={`mt-2 flex items-start gap-4 rounded-2xl p-5 ${severity.theme.banner}`}>
        <span
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${severity.theme.iconBg}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${severity.theme.iconColor}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {severity.icon}
          </svg>
        </span>
        <div>
          <h2 className={`text-lg font-bold sm:text-xl ${severity.theme.heading}`}>
            {severity.heading}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">
            {severity.message}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => handleTabChange("original")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "original"
              ? "bg-[#00B4D8] text-[#0A1628]"
              : "bg-[#0A1628] text-slate-300 hover:bg-[#0A1628]/70"
          }`}
        >
          Your Photo
        </button>
        <button
          type="button"
          onClick={() => hasMask && handleTabChange("mask")}
          disabled={!hasMask}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "mask"
              ? "bg-[#00B4D8] text-[#0A1628]"
              : hasMask
              ? "bg-[#0A1628] text-slate-300 hover:bg-[#0A1628]/70"
              : "cursor-not-allowed bg-[#0A1628]/50 text-slate-600"
          }`}
        >
          AI Highlighted Areas
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center overflow-hidden rounded-xl border border-[#00B4D8]/20 bg-black">
        {displayedImageBase64 ? (
          <img
            src={`data:image/png;base64,${displayedImageBase64}`}
            alt={
              activeTab === "mask"
                ? "Areas the AI flagged on your skin photo"
                : "Your uploaded skin photo"
            }
            className="max-h-96 w-full object-contain"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center text-sm text-slate-500">
            Image unavailable
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-[#0A1628] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">
              How sure is XORA?
            </span>
            <span className="font-semibold text-[#00B4D8]">
              {confidencePercent}%
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full bg-[#00B4D8] transition-all duration-1000 ease-out w-[${
                barsReady ? confidencePercent : 0
              }%]`}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {confidenceWording(confidencePercent)} in this result.
          </p>
        </div>

        <div className="rounded-xl bg-[#0A1628] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">
              How much skin is affected?
            </span>
            <span className="font-semibold text-purple-400">
              {coveragePercent}%
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full bg-purple-500 transition-all duration-1000 ease-out w-[${
                barsReady ? coveragePercent : 0
              }%]`}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {coverageWording(coveragePercent)} coverage of the scanned area.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#0A1628] px-4 py-3">
        <span
          className={`h-6 w-6 flex-shrink-0 rounded-full ring-2 ring-white/20 ${skinToneClass}`}
        />
        <p className="text-sm text-slate-300">
          <span className="font-medium text-white">
            {result.skin_tone_group || "Unspecified"} skin tone
          </span>{" "}
          detected — XORA uses this to keep results fair and accurate for
          every skin tone.
        </p>
      </div>

      <div className={`mt-4 rounded-xl p-4 ${severity.theme.tipBg}`}>
        <p className="text-sm font-semibold text-white">What should I do?</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-300">
          {severity.recommendation}
        </p>
      </div>

      <p className="mt-6 border-t border-[#00B4D8]/10 pt-4 text-center text-xs leading-relaxed text-slate-500">
        This is an AI screening tool, not a medical diagnosis. Always consult
        a certified dermatologist for a full evaluation.
      </p>
    </div>
  );
}
