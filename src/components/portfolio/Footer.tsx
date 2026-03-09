"use client";
import type { Personal } from "@/lib/types";

export default function Footer({ personal, portfolioId }: { personal: Personal; portfolioId: string }) {
  return (
    <footer className="py-10 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-600 text-sm font-mono">
          © {new Date().getFullYear()} {personal.name} — Built with{" "}
          <a href="/" className="text-cyan-500 hover:text-cyan-400 transition-colors">PortfolioAI</a>
        </p>
        <a href={`/p/${portfolioId}/edit`}
          className="text-xs text-slate-600 hover:text-cyan-400 transition-colors font-mono border border-white/5 hover:border-cyan-400/20 px-3 py-1.5 rounded-lg">
          ✏️ Edit this portfolio
        </a>
      </div>
    </footer>
  );
}
