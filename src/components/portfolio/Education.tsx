"use client";
import type { Education } from "@/lib/types";

export default function EducationSection({ education }: { education: Education[] }) {
  if (!education?.length) return null;
  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">{"// education"}</p>
        <h2 className="section-title">Academic Background</h2>
        <p className="section-sub">Degrees and certifications that built my foundation.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {education.map((ed, i) => (
            <div key={i} className="card p-6 group">
              <div className="text-4xl mb-4">{ed.icon || "🎓"}</div>
              <h3 className="font-bold text-white text-base mb-1">{ed.degree}</h3>
              <p className="text-cyan-400 text-sm font-medium mb-1">{ed.institution}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-xs font-mono text-slate-500">{ed.year}</span>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">{ed.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
