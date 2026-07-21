import React, { useState, useCallback, useRef, useEffect } from "react";

export default function PsoriasisUpload({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const acceptFile = useCallback(
    (candidate) => {
      if (!candidate || !candidate.type.startsWith("image/")) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(candidate);
      setPreviewUrl(URL.createObjectURL(candidate));
    },
    [previewUrl]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      acceptFile(dropped);
    },
    [acceptFile]
  );

  const handleFileChange = useCallback(
    (e) => {
      const selected = e.target.files?.[0];
      acceptFile(selected);
    },
    [acceptFile]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [previewUrl]
  );

  const handleRunAnalysis = useCallback(() => {
    if (file && !loading) onAnalyze(file);
  }, [file, loading, onAnalyze]);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-[#00B4D8]/20 bg-[#0d1f33] p-6 shadow-lg shadow-black/40 md:p-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!previewUrl ? handleBrowseClick : undefined}
        className={`relative flex min-h-[16rem] w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors duration-300 ${
          previewUrl ? "cursor-default p-2" : "cursor-pointer p-8"
        } ${
          isDragging
            ? "border-[#00B4D8] bg-[#00B4D8]/10"
            : "border-[#00B4D8]/30 bg-[#0A1628] hover:border-[#00B4D8]/60"
        }`}
      >
        {previewUrl ? (
          <div className="relative h-full w-full">
            <img
              src={previewUrl}
              alt="Selected skin scan preview"
              className="mx-auto max-h-80 w-full rounded-lg object-contain"
            />

            {loading && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg bg-[#0A1628]/20">
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00B4D8] to-transparent shadow-[0_0_12px_2px_#00B4D8] animate-[scanDown_2s_linear_infinite]" />
              </div>
            )}

            {!loading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                aria-label="Remove selected image"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00B4D8]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#00B4D8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 16.5 17.25v-1.5m.75-11.25 3 3m0 0-3 3m3-3h-9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 9.75 9 5.25m0 0 4.5 4.5M9 5.25v9"
                />
              </svg>
            </div>
            <p className="text-base font-medium text-white">
              Drag &amp; drop a skin image here
            </p>
            <p className="text-sm text-slate-400">or</p>
            <button
              type="button"
              onClick={handleBrowseClick}
              className="rounded-lg border border-[#00B4D8]/50 bg-[#00B4D8]/10 px-4 py-2 text-sm font-medium text-[#00B4D8] transition hover:bg-[#00B4D8]/20"
            >
              Browse Files
            </button>
            <p className="text-xs text-slate-500">PNG, JPG up to ~10MB</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleRunAnalysis}
        disabled={!file || loading}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-all duration-300 ${
          !file || loading
            ? "cursor-not-allowed bg-slate-700/50 text-slate-400"
            : "bg-[#00B4D8] text-[#0A1628] hover:bg-[#00cfff] active:scale-[0.98]"
        }`}
      >
        {loading ? (
          <>
            <span>Analyzing</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
            </span>
          </>
        ) : (
          "Run XORA Analysis"
        )}
      </button>
    </div>
  );
}
