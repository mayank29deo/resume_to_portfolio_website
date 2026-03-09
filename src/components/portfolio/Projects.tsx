"use client";
import type { Project } from "@/lib/types";

export default function Projects({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">{"// projects"}</p>
        <h2 className="section-title">Things I&apos;ve Built</h2>
        <p className="section-sub">A selection of projects across different domains.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div key={i} className="card p-6 flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{p.emoji || "🚀"}</div>
                <div className="flex gap-2">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-white/10 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.7 10.7 0 015.72 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.79.55A11.52 11.52 0 0023.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg border border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-400/30 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  {p.highlight && <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">Featured</span>}
                </div>
                {p.duration && <p className="text-xs font-mono text-slate-600 mb-3">{p.duration}</p>}
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{p.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
