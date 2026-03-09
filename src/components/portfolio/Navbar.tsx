"use client";
import { useState, useEffect } from "react";
import type { Personal } from "@/lib/types";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ personal, portfolioId }: { personal: Personal; portfolioId: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const initials = personal.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault(); setActive(href);
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 bg-[#080810]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "py-5"}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            {initials}
          </div>
          <span className="font-bold text-white text-sm hidden sm:block tracking-wide">
            {personal.name.split(" ")[0]}<span className="text-gradient"> {personal.name.split(" ").slice(1).join(" ")}</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active === l.href ? "text-cyan-400 bg-cyan-400/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {personal.openToWork && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Open to Work
            </span>
          )}
          <a href={`/p/${portfolioId}/edit`} className="btn-outline text-xs">Edit Portfolio</a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
          <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-5 h-0.5 bg-current mb-1.5 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 pt-2 bg-[#080810]/95 backdrop-blur-xl border-b border-white/5">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => { scrollTo(e, l.href); setMenuOpen(false); }}
              className="block py-3 text-sm text-slate-400 hover:text-white border-b border-white/5 last:border-0">{l.label}</a>
          ))}
          <a href={`/p/${portfolioId}/edit`} className="btn-outline inline-block mt-4 text-xs">Edit Portfolio</a>
        </div>
      )}
    </nav>
  );
}
