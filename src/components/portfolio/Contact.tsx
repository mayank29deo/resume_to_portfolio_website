"use client";
import type { Personal } from "@/lib/types";

export default function Contact({ personal }: { personal: Personal }) {
  const links = [
    personal.email    && { label:"Email",    value:personal.email,    href:`mailto:${personal.email}`,   color:"cyan"    },
    personal.linkedin && { label:"LinkedIn", value:"linkedin.com/in", href:personal.linkedin,            color:"purple"  },
    personal.github   && { label:"GitHub",   value:"github.com",      href:personal.github,              color:"emerald" },
    personal.phone    && { label:"Phone",    value:personal.phone,    href:`tel:${personal.phone}`,      color:"orange"  },
  ].filter(Boolean) as { label:string; value:string; href:string; color:string }[];

  const colorMap: Record<string,string> = {
    cyan:   "border-cyan-400/20 bg-cyan-400/10 text-cyan-400 group-hover:bg-cyan-400/20 group-hover:border-cyan-400/40",
    purple: "border-purple-400/20 bg-purple-400/10 text-purple-400 group-hover:bg-purple-400/20 group-hover:border-purple-400/40",
    emerald:"border-emerald-400/20 bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-400/20 group-hover:border-emerald-400/40",
    orange: "border-orange-400/20 bg-orange-400/10 text-orange-400 group-hover:bg-orange-400/20 group-hover:border-orange-400/40",
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">{"// contact"}</p>
        <h2 className="section-title">Let&apos;s Work Together</h2>
        <p className="text-slate-400 text-base mb-12 leading-relaxed">
          Open to new opportunities, collaborations, and exciting projects. My inbox is always open.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {links.map((l) => (
            <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer" className="card p-5 flex items-center gap-4 group text-left">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-200 ${colorMap[l.color]}`}>
                <span className="text-lg font-bold">{l.label[0]}</span>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">{l.label}</div>
                <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">{l.value}</div>
              </div>
            </a>
          ))}
        </div>
        {personal.email && (
          <a href={`mailto:${personal.email}`} className="btn-primary text-base inline-flex items-center gap-2">
            Say Hello 👋
          </a>
        )}
      </div>
    </section>
  );
}
