"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type State = "idle" | "uploading" | "parsing" | "linkedin" | "done" | "error";

export default function UploadSection() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [linkedinNote, setLinkedinNote] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext !== "pdf" && ext !== "docx") {
        setError("Please upload a PDF or DOCX file.");
        return;
      }
      setError("");
      setState("uploading");
      try {
        const formData = new FormData();
        formData.append("resume", file);

        setState("parsing");
        const res = await fetch("/api/parse", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Something went wrong");

        // Show LinkedIn status briefly if applicable
        if (json.linkedIn) {
          const { added, status } = json.linkedIn;
          const totalAdded = (added?.experience ?? 0) + (added?.projects ?? 0);
          if (totalAdded > 0) {
            setLinkedinNote(
              `✓ LinkedIn: added ${added.experience} experience and ${added.projects} project(s)`
            );
          } else {
            setLinkedinNote(status ?? "LinkedIn checked — resume is already up to date");
          }
        }

        setState("done");
        localStorage.setItem(`portfolio_owner_${json.id}`, "true");

        // Brief pause so user can see the status before redirect
        setTimeout(() => {
          router.push(`/p/${json.id}`);
        }, json.linkedIn ? 1800 : 800);
      } catch (e: unknown) {
        setState("error");
        setError(
          e instanceof Error ? e.message : "Upload failed. Please try again."
        );
      }
    },
    [router]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isLoading =
    state === "uploading" || state === "parsing" || state === "linkedin";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center w-full min-h-56 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${
            dragging
              ? "border-cyan-400 bg-cyan-400/10 scale-[1.02]"
              : "border-white/15 bg-white/3 hover:border-cyan-400/50 hover:bg-cyan-400/5"
          }
          ${isLoading ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={onInputChange}
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
            <div className="flex flex-col gap-1">
              <p className="text-cyan-400 font-mono text-sm">
                {state === "uploading"
                  ? "Uploading your resume…"
                  : "AI is reading your resume…"}
              </p>
            </div>
            <p className="text-slate-500 text-xs">
              This takes about 10–20 seconds
            </p>
          </div>
        ) : state === "done" ? (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="text-5xl">✅</div>
            <p className="text-emerald-400 font-semibold">
              Portfolio created! Redirecting…
            </p>
            {linkedinNote && (
              <p className="text-cyan-400/80 text-xs font-mono">{linkedinNote}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-3xl">
              📄
            </div>
            <div>
              <p className="text-white font-semibold text-base mb-1">
                Drop your resume here
              </p>
              <p className="text-slate-400 text-sm">
                or{" "}
                <span className="text-cyan-400 underline underline-offset-2">
                  click to browse
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                PDF
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                DOCX
              </span>
            </div>
          </div>
        )}
      </label>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
