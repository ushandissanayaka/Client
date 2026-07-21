import React from "react";
import SkinDiseasesCardCompo from "../components/SkinDiseasesCardCompo";

const MODULES = [
  { text: "Acne", path: "/module-1/acne", comingSoon: true },
  { text: "Psoriasis", path: "/module-2/psoriasis" },
  { text: "Melanoma", path: "/module-3/melanoma", comingSoon: true },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0A1628] px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
          XORA
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Dermatology AI Modules
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
          Select a skin condition below to run an AI-assisted scan.
        </p>
      </div>

      <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6">
        {MODULES.map((module) => (
          <SkinDiseasesCardCompo key={module.text} {...module} />
        ))}
      </div>
    </div>
  );
}
