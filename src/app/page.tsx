import UploadSection from "@/components/landing/UploadSection";

const steps = [
  { icon: "📄", title: "Upload Resume", desc: "Drop your PDF or DOCX — any format works." },
  { icon: "🤖", title: "AI Parses It", desc: "Claude AI extracts every detail in seconds." },
  { icon: "🌐", title: "Get Live Portfolio", desc: "Instant, shareable link. No signup needed." },
];

const features = [
  { icon: "⚡", title: "Instant Generation", desc: "From upload to live portfolio in under 20 seconds." },
  { icon: "✏️", title: "Fully Editable", desc: "Edit every section — name, skills, projects, experience." },
  { icon: "🎨", title: "Beautiful Design", desc: "Dark theme with cyan & purple accents. Looks great everywhere." },
  { icon: "🔗", title: "Shareable URL", desc: "Send your unique link to recruiters, clients, or anyone." },
  { icon: "📱", title: "Mobile Friendly", desc: "Responsive layout that looks perfect on all screen sizes." },
  { icon: "🆓", title: "Free to Use", desc: "No account required. Just upload and share." },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#080810]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* ── Navbar ── */}
        <nav className="py-5 px-6 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">P</div>
            <span className="font-bold text-white tracking-wide">Portfolio<span className="text-gradient">AI</span></span>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">GitHub →</a>
        </nav>

        {/* ── Hero ── */}
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Mayank and AI
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            <span className="text-white">Your Resume.</span>
            <br />
            <span className="text-gradient">Your Portfolio.</span>
            <br />
            <span className="text-white">Instantly.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Upload your resume and get a beautiful, live portfolio website in seconds.
            No coding. No signup. Just drop your PDF or DOCX and share your link.
          </p>
          <UploadSection />
          <p className="text-slate-600 text-xs mt-6 font-mono">Supports PDF and DOCX · Free · No account needed</p>
        </section>

        {/* ── How it works ── */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3 text-center">{"// how it works"}</p>
          <h2 className="section-title text-center mx-auto">Three steps. That&apos;s it.</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {steps.map((s, i) => (
              <div key={i} className="card p-8 text-center group">
                <div className="text-5xl mb-5">{s.icon}</div>
                <div className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold flex items-center justify-center mx-auto mb-4">{i + 1}</div>
                <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3 text-center">{"// features"}</p>
          <h2 className="section-title text-center mx-auto">Everything you need</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {features.map((f, i) => (
              <div key={i} className="card p-6 group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to stand out?</h2>
          <p className="text-slate-400 mb-10">Your portfolio is 20 seconds away.</p>
          <UploadSection />
        </section>

        {/* ── Footer ── */}
        <footer className="py-8 px-6 border-t border-white/5 text-center">
          <p className="text-slate-600 text-sm font-mono">
            Built with ❤️ by Mayank using <span className="text-cyan-500">Next.js</span> &{" "}
            <span className="text-purple-400">Claude AI</span>
          </p>
        </footer>
      </div>
    </main>
  );
}


