import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl, getMelanomaEvaluation } from "../../apis/melanomaApi";

function DataTable({ title, rows }) {
  if (!rows?.length) return null;
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-[#00B4D8]/20 bg-[#0d1f33]">
      <h2 className="border-b border-[#00B4D8]/15 px-5 py-4 text-lg font-semibold text-white">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0A1628] text-xs uppercase tracking-wide text-slate-400">
            <tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-5 py-3 font-medium">{column.replaceAll("_", " ")}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#00B4D8]/10 text-slate-200">
            {rows.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column} className="whitespace-nowrap px-5 py-3">{row[column] ?? "—"}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function MelanomaEvaluation() {
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMelanomaEvaluation().then((data) => {
      if (active) setEvaluation(data);
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load model evaluation.");
    });
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen bg-[#0A1628] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/module-3/melanoma" className="text-sm font-medium text-[#00B4D8] hover:text-[#62d9ee]">← Back to melanoma detection</Link>
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Model Evaluation</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Performance metrics and all plots generated for the melanoma detection model.</p>

        {!evaluation && !error && <div className="mt-10 rounded-2xl border border-[#00B4D8]/20 bg-[#0d1f33] p-8 text-slate-300">Loading evaluation results…</div>}
        {error && <div role="alert" className="mt-10 rounded-2xl border border-red-500/40 bg-red-950/30 p-5 text-red-200">{error}</div>}

        {evaluation && <>
          <DataTable title="Overall metrics" rows={evaluation.overall_metrics} />
          <DataTable title="Performance by skin tone" rows={evaluation.skin_tone_metrics} />
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Evaluation plots</h2>
            {evaluation.evaluation_plots?.length ? (
              <div className="mt-4 grid gap-8">
                {evaluation.evaluation_plots.map((plot, index) => (
                  <figure key={plot.url || index} className="overflow-hidden rounded-2xl border border-[#00B4D8]/20 bg-[#0d1f33] p-5">
                    <img src={backendUrl(plot.url)} alt={plot.name || `Evaluation plot ${index + 1}`} className="max-h-[850px] w-full rounded-xl bg-white object-contain" />
                    <figcaption className="px-2 pb-1 pt-4 text-base font-medium text-slate-200">{plot.name || `Evaluation plot ${index + 1}`}</figcaption>
                  </figure>
                ))}
              </div>
            ) : <p className="mt-3 rounded-xl bg-[#0d1f33] p-5 text-sm text-slate-400">No evaluation plots are available yet. Generate the evaluation outputs, then refresh this page.</p>}
          </section>
        </>}
      </div>
    </main>
  );
}
