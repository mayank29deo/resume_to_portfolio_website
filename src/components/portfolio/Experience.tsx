"use client";
import type { ExperienceItem } from "@/lib/types";

const colorMap: Record<string, { border:string; bg:string; bgHover:string; dot:string; badge:string; text:string }> = {
  cyan:    { border:"border-cyan-400",    bg:"bg-cyan-400/10",    bgHover:"group-hover:bg-cyan-400/30",    dot:"bg-cyan-400",    badge:"bg-cyan-400/10 text-cyan-400 border border-cyan-400/20",    text:"text-cyan-400" },
  purple:  { border:"border-purple-400",  bg:"bg-purple-400/10",  bgHover:"group-hover:bg-purple-400/30",  dot:"bg-purple-400",  badge:"bg-purple-400/10 text-purple-400 border border-purple-400/20",  text:"text-purple-400" },
  emerald: { border:"border-emerald-400", bg:"bg-emerald-400/10", bgHover:"group-hover:bg-emerald-400/30", dot:"bg-emerald-400", badge:"bg-emerald-400/10 text-emerald-400 border border-emerald-400/20", text:"text-emerald-400" },
};

export default function Experience({ experience }: { experience: ExperienceItem[] }) {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">{"// work experience"}</p>
        <h2 className="section-title">Where I&apos;ve Worked</h2>
        <p className="section-sub">Real-world roles that shaped my thinking and craft.</p>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-cyan-500/40 to-transparent hidden md:block" />
          <div className="space-y-8">
            {experience.map((job, i) => {
              const c = colorMap[job.color] ?? colorMap.cyan;
              return (
                <div key={i} className="relative md:pl-16 group">
                  <div className={`absolute left-3.5 top-8 w-5 h-5 rounded-full border-2 hidden md:flex items-center justify-center transition-all duration-300 ${c.border} ${c.bg} ${c.bgHover}`}>
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                  </div>
                  <div className="card p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full inline-block mb-1 ${c.badge}`}>{job.type}</span>
                        <h3 className="text-lg font-bold text-white">{job.role}</h3>
                        <p className={`font-semibold text-sm mt-0.5 ${c.text}`}>{job.company}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm text-slate-400 font-mono">{job.duration}</div>
                        <div className="text-xs text-slate-600 mt-1">{job.location}</div>
                      </div>
                    </div>
                    <ul className="space-y-2.5 mb-5">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />{b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {job.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
