import React from "react";
import { useNavigate } from "react-router-dom";

export default function SkinDiseasesCardCompo({ text, path, comingSoon }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) navigate(path);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className="group relative flex h-48 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-[#00B4D8]/20 bg-[#0d1f33] p-6 text-center shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-[#00B4D8]/60"
    >
      {comingSoon && (
        <span className="absolute right-3 top-3 rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
          Soon
        </span>
      )}
      <span className="text-lg font-semibold text-white transition-colors group-hover:text-[#00B4D8]">
        {text}
      </span>
      <span className="text-xs text-slate-500">Tap to open scan module</span>
    </div>
  );
}
