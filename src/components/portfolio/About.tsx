"use client";
import type { Personal, Position } from "@/lib/types";

export default function About({ personal, positions }: { personal: Personal; positions: Position[] }) {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">{"// about me"}</p>
            <h2 className="section-title">Who Am I?</h2>
            <p className="section-sub">Professional. Builder. Problem Solver.</p>
            <p className="text-slate-400 leading-relaxed mb-8">{personal.bio}</p>
            <div className="flex flex-wrap gap-4">
              {personal.email && (
                <a href={`mailto:${personal.email}`} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span className="text-cyan-500">✉</span>{personal.email}
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span className="text-cyan-500">in</span>LinkedIn
                </a>
              )}
            </div>
          </div>

          {positions?.length > 0 && (
            <div className="space-y-4">
              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-6">Positions of Responsibility</p>
              {positions.map((p, i) => (
                <div key={i} className="card p-5 flex items-center gap-4 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-cyan-400/20 transition-all">
                    {p.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{p.role}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{p.org}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
