import React from "react";
import { useNavigate } from "react-router-dom";

export default function ComingSoonPage({ moduleTag, title, description }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0A1628] px-4 text-center text-white">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
        {moduleTag}
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 sm:text-lg">
        {description}
      </p>
      <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-700/40 px-4 py-2 text-sm font-medium text-slate-300">
        Coming Soon
      </span>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-8 text-sm font-medium text-[#00B4D8] transition hover:text-[#00cfff]"
      >
        ← Back to Home
      </button>
    </div>
  );
}
