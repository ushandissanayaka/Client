import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeMelanoma, backendUrl } from "../../apis/melanomaApi";
import PsoriasisUpload from "../../components/module/PsoriasisUpload";

const FEATURES = [
  {
    title: "ABCD Analysis",
    description:
      "Clinical asymmetry, border, colour, and diameter indicators support melanoma risk screening.",
    icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5h15v15h-15v-15Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5M12 8.25v7.5" /></>,
  },
  {
    title: "Explainable AI",
    description:
      "Grad-CAM++ highlights the image areas that most influenced the model assessment.",
    icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" /></>,
  },
  {
    title: "Skin Tone Aware",
    description:
      "Skin tone analysis supports more equitable screening across diverse skin tones.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3-9 2 2 4-4" />,
  },
  {
    title: "Model Evaluation",
    description:
      "View performance metrics and evaluation graphs for the melanoma detection model.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 19.5h16.5M6.75 16.5v-4.5m5.25 4.5V6m5.25 10.5V9" />,
  },
];

function RiskTheme({ riskLevel }) {
  const high = riskLevel?.toUpperCase().includes("HIGH");
  const medium = riskLevel?.toUpperCase().includes("MEDIUM");
  return high
    ? { panel: "border-red-500/30 bg-red-500/10", text: "text-red-300" }
    : medium
    ? { panel: "border-amber-500/30 bg-amber-500/10", text: "text-amber-300" }
    : { panel: "border-emerald-500/30 bg-emerald-500/10", text: "text-emerald-300" };
}

function MelanomaResult({ result, onReset }) {
  const prediction = result.prediction || {};
  const abcd = result.abcd_scores || {};
  const skinTone = result.skin_tone_analysis || {};
  const theme = RiskTheme({ riskLevel: prediction.risk_level });
  const probability = Math.min(100, Math.max(0, Number(prediction.melanoma_probability) || 0));

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#00B4D8]/20 bg-[#0d1f33] p-6 shadow-lg shadow-black/40 md:p-8">
      <div className="flex justify-end">
        <button type="button" onClick={onReset} className="text-sm font-medium text-[#00B4D8] transition hover:text-[#00cfff]">
          ← New Scan
        </button>
      </div>

      <div className={`mt-2 rounded-2xl border p-5 ${theme.panel}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">AI screening result</p>
            <h2 className={`mt-1 text-xl font-bold ${theme.text}`}>{prediction.prediction_label || "Analysis Complete"}</h2>
          </div>
          <span className="rounded-full bg-[#0A1628] px-3 py-1 text-xs font-semibold text-white">{prediction.risk_level || "RESULT"}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{prediction.recommendation}</p>
      </div>

      <div className="mt-6 rounded-xl bg-[#0A1628] p-4">
        <div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-300">Melanoma probability</span><span className="font-semibold text-[#00B4D8]">{probability}%</span></div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-[#00B4D8] transition-all duration-700" style={{ width: `${probability}%` }} /></div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-white">AI Highlighted Areas</p>
        {result.urls?.heatmap_image ? <img src={backendUrl(result.urls.heatmap_image)} alt="AI highlighted melanoma areas" className="max-h-80 w-full rounded-xl border border-[#00B4D8]/20 bg-black object-contain" /> : <div className="flex h-52 items-center justify-center rounded-xl bg-[#0A1628] text-sm text-slate-500">Heatmap unavailable</div>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {Object.entries(abcd).map(([name, item]) => <div key={name} className="rounded-xl bg-[#0A1628] p-3"><p className="text-xs capitalize text-slate-400">{name.replace("_mm", " (mm)").replace("_", " ")}</p><p className="mt-1 font-semibold text-white">{item.score}</p><p className="text-xs text-[#00B4D8]">{item.status}</p></div>)}
      </div>

      <div className="mt-4 rounded-xl bg-[#0A1628] p-4 text-sm text-slate-300"><span className="font-medium text-white">{skinTone.detected_skin_tone || "Unspecified"} skin tone</span> detected · ITA score: {skinTone.ita_score ?? "—"} · Model accuracy: {skinTone.model_accuracy || "—"}</div>
      <a href={backendUrl(result.urls?.pdf_report)} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-lg border border-[#00B4D8]/50 px-4 py-2 text-sm font-medium text-[#00B4D8] transition hover:bg-[#00B4D8]/10">Download PDF report</a>
      <p className="mt-6 border-t border-[#00B4D8]/10 pt-4 text-center text-xs leading-relaxed text-slate-500">This is an AI screening tool, not a medical diagnosis. Always consult a certified dermatologist for a full evaluation.</p>
    </div>
  );
}

export default function MelanomaHome() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = useCallback(async (file) => {
    setLoading(true);
    setError("");
    try { setResult(await analyzeMelanoma(file)); }
    catch (err) { setError(err.message || "Analysis failed. Please try again."); }
    finally { setLoading(false); }
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#0A1628] text-white">
      {error && <div role="alert" className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-red-500/40 bg-[#1a0f0f] p-4 shadow-lg shadow-black/50 sm:right-6 sm:top-6"><p className="text-sm font-semibold text-red-400">Analysis Failed</p><p className="mt-1 text-sm text-slate-300">{error}</p></div>}
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-16 text-center sm:px-6 md:pt-24"><span className="inline-flex items-center gap-2 rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">XORA Module 3</span><h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Melanoma Detection</h1><p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">An explainable AI pipeline for melanoma risk screening with ABCD clinical scoring and skin tone analysis.</p></section>
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{FEATURES.map((feature) => <article key={feature.title} className="rounded-2xl border border-[#00B4D8]/15 bg-[#0d1f33] p-5 transition hover:border-[#00B4D8]/40"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00B4D8]/10"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00B4D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{feature.icon}</svg></div><h2 className="mt-4 text-sm font-semibold text-white">{feature.title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>{feature.title === "Model Evaluation" && <button type="button" onClick={() => navigate("/module-3/melanoma/evaluation")} className="mt-4 rounded-lg border border-[#00B4D8]/50 bg-[#00B4D8]/10 px-3 py-2 text-xs font-semibold text-[#00B4D8] transition hover:bg-[#00B4D8]/20">See evaluation</button>}</article>)}</div></section>
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">{result ? <MelanomaResult result={result} onReset={() => { setResult(null); setError(""); }} /> : <PsoriasisUpload onAnalyze={handleAnalyze} loading={loading} />}</section>
    </main>
  );
}
