"use client";
import type { Skills } from "@/lib/types";

const PALETTE = [
  { card: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20", tag: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20 hover:bg-cyan-400/20" },
  { card: "from-purple-500/20 to-purple-500/5 border-purple-500/20", tag: "bg-purple-400/10 text-purple-300 border-purple-400/20 hover:bg-purple-400/20" },
  { card: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20", tag: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20 hover:bg-emerald-400/20" },
  { card: "from-orange-500/20 to-orange-500/5 border-orange-500/20", tag: "bg-orange-400/10 text-orange-300 border-orange-400/20 hover:bg-orange-400/20" },
  { card: "from-pink-500/20 to-pink-500/5 border-pink-500/20", tag: "bg-pink-400/10 text-pink-300 border-pink-400/20 hover:bg-pink-400/20" },
];

export default function Skills({ skills }: { skills: Skills }) {
  const entries = Object.entries(skills).filter(([, v]) => v.length > 0);
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">{"// technical skills"}</p>
        <h2 className="section-title">What I Work With</h2>
        <p className="section-sub">Technologies and tools I use to build and analyze.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {entries.map(([category, items], i) => {
            const { card, tag } = PALETTE[i % PALETTE.length];
            return (
              <div key={category} className={`card p-6 bg-gradient-to-br ${card}`}>
                <h3 className="font-semibold text-sm mb-4 text-white/80 tracking-wide">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={skill} className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200 cursor-default select-none ${tag}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
