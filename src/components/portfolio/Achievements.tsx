"use client";
import type { Achievement } from "@/lib/types";

export default function Achievements({ achievements }: { achievements: Achievement[] }) {
  if (!achievements?.length) return null;
  return (
    <section id="achievements" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">{"// achievements"}</p>
        <h2 className="section-title">Wins & Milestones</h2>
        <p className="section-sub">Recognition, competitions, and personal bests.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a, i) => (
            <div key={i} className="card p-6 group">
              <div className="text-4xl mb-4">{a.icon}</div>
              <h3 className="font-bold text-white text-base mb-2">{a.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
