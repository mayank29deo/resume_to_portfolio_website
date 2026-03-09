"use client";
import { useEffect, useState } from "react";
import type { Personal, Education } from "@/lib/types";

export default function Hero({ personal, education }: { personal: Personal; education: Education[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const taglines = personal.taglines?.length ? personal.taglines : [personal.title];

  useEffect(() => {
    const current = taglines[idx];
    let t: NodeJS.Timeout;
    if (!deleting && displayed.length < current.length) {
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      t = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else {
      setDeleting(false);
      setIdx((i) => (i + 1) % taglines.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, idx, taglines]);

  const edColors = ["from-cyan-400/20 to-cyan-600/10 border-cyan-400/20","from-purple-400/20 to-purple-600/10 border-purple-400/20","from-emerald-400/20 to-emerald-600/10 border-emerald-400/20"];
  const edAccents = ["text-cyan-400","text-purple-400","text-emerald-400"];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="glow-dot" />
              <span className="text-sm font-mono text-slate-400 tracking-widest uppercase">Available for opportunities</span>
            </div>
            <div>
              <p className="text-cyan-400 font-mono text-sm mb-3 tracking-widest">Hello, World! 👋</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="text-white">I&apos;m </span>
                <span className="text-gradient">{personal.name.split(" ")[0]}</span>
                <br />
                <span className="text-white">{personal.name.split(" ").slice(1).join(" ")}</span>
              </h1>
            </div>
            <div className="h-10 flex items-center">
              <span className="text-xl md:text-2xl font-light text-slate-300">
                {displayed}<span className="inline-block w-0.5 h-6 bg-cyan-400 ml-1 animate-pulse" />
              </span>
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-lg">{personal.bio}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#projects" className="btn-primary cursor-pointer">View Projects →</a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              {personal.github && (
                <a href={personal.github} target="_blank" rel="noopener noreferrer" title="GitHub"
                  className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.7 10.7 0 015.72 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.79.55A11.52 11.52 0 0023.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                  className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.37 4.25 5.44l.03 6.3ZM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>
                </a>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-72 md:w-80">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 blur-2xl animate-pulse" />
              <div className="relative space-y-3">
                {education.slice(0, 3).map((ed, i) => (
                  <div key={i} className={`rounded-2xl border bg-gradient-to-br ${edColors[i]} backdrop-blur-sm p-4 transition-all duration-300 hover:scale-[1.02]`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{ed.icon || "🎓"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-mono font-bold ${edAccents[i]}`}>{ed.year}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 ${edAccents[i]}`}>{ed.score}</span>
                        </div>
                        <h4 className="text-white font-bold text-sm mt-1 leading-snug">{ed.degree}</h4>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">{ed.institution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior:"smooth" }); }}
            className="flex flex-col items-center gap-2 text-slate-600 hover:text-cyan-400 transition-colors group">
            <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 rounded-full border border-slate-700 group-hover:border-cyan-400/40 flex items-start justify-center pt-2 transition-colors">
              <div className="w-1 h-2 bg-slate-500 rounded-full animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
