"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PortfolioData, ExperienceItem, Project, Achievement, Position, Education } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "error";

// ── Reusable small components ──────────────────────────────────────────────

function Field({ label, value, onChange, textarea, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; type?: string;
}) {
  const base = "w-full bg-[#0f0f1a] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all placeholder:text-slate-600";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">{label}</label>
      {textarea
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${base} resize-none`} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      }
    </div>
  );
}

function TagsInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2 mb-1">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="text-slate-500 hover:text-red-400 ml-1">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Type and press Enter" className="flex-1 bg-[#0f0f1a] border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-400/50 transition-all placeholder:text-slate-600" />
        <button onClick={add} className="px-4 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm hover:bg-cyan-400/20 transition-all">Add</button>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function EditForm({ initial, portfolioId }: { initial: PortfolioData; portfolioId: string }) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData>(initial);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal",     label: "Personal",    icon: "👤" },
    { id: "skills",       label: "Skills",      icon: "🛠️" },
    { id: "experience",   label: "Experience",  icon: "💼" },
    { id: "projects",     label: "Projects",    icon: "🚀" },
    { id: "education",    label: "Education",   icon: "🎓" },
    { id: "achievements", label: "Achievements",icon: "🏆" },
  ];

  const set = (path: string[], value: unknown) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as PortfolioData;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cur: any = next;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  const save = async () => {
    setSaveState("saving");
    try {
      const res = await fetch(`/api/portfolio/${portfolioId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#080810]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-slate-500 hover:text-white transition-colors text-sm">← Home</a>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300 text-sm font-mono">Editing Portfolio</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={`/p/${portfolioId}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs">
              👁 Preview
            </a>
            <button onClick={save} disabled={saveState === "saving"}
              className={`btn-primary text-xs ${saveState === "saving" ? "opacity-60 cursor-not-allowed" : ""}`}>
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved!" : saveState === "error" ? "⚠ Error" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gradient mb-1">Edit Your Portfolio</h1>
          <p className="text-slate-400 text-sm">Changes are saved to your live portfolio at <a href={`/p/${portfolioId}`} className="text-cyan-400 hover:underline">/p/{portfolioId}</a></p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === t.id ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30" : "text-slate-400 border border-white/5 hover:text-white hover:border-white/15"}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── Personal ── */}
        {activeTab === "personal" && (
          <div className="card p-8 space-y-6">
            <SectionHeader title="Personal Info" icon="👤" />
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" value={data.personal.name} onChange={(v) => set(["personal","name"], v)} />
              <Field label="Title" value={data.personal.title} onChange={(v) => set(["personal","title"], v)} />
              <Field label="Email" type="email" value={data.personal.email} onChange={(v) => set(["personal","email"], v)} />
              <Field label="Phone" value={data.personal.phone} onChange={(v) => set(["personal","phone"], v)} />
              <Field label="Location" value={data.personal.location} onChange={(v) => set(["personal","location"], v)} />
              <Field label="GitHub URL" value={data.personal.github} onChange={(v) => set(["personal","github"], v)} />
              <Field label="LinkedIn URL" value={data.personal.linkedin} onChange={(v) => set(["personal","linkedin"], v)} />
              <Field label="LeetCode URL" value={data.personal.leetcode} onChange={(v) => set(["personal","leetcode"], v)} />
            </div>
            <Field label="Bio / Summary" value={data.personal.bio} onChange={(v) => set(["personal","bio"], v)} textarea />
            <TagsInput label="Taglines (rotating roles in hero)" tags={data.personal.taglines ?? []} onChange={(v) => set(["personal","taglines"], v)} />
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Open to Work</label>
              <button onClick={() => set(["personal","openToWork"], !data.personal.openToWork)}
                className={`relative w-11 h-6 rounded-full transition-all ${data.personal.openToWork ? "bg-emerald-500" : "bg-slate-700"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${data.personal.openToWork ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        )}

        {/* ── Skills ── */}
        {activeTab === "skills" && (
          <div className="card p-8 space-y-6">
            <SectionHeader title="Skills" icon="🛠️" />
            {Object.entries(data.skills).map(([cat, items]) => (
              <div key={cat}>
                <TagsInput label={cat} tags={items} onChange={(v) => set(["skills", cat], v)} />
              </div>
            ))}
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 font-mono">To add a new skill category, contact support or edit via JSON.</p>
            </div>
          </div>
        )}

        {/* ── Experience ── */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <SectionHeader title="Work Experience" icon="💼" />
            {data.experience.map((job, i) => (
              <div key={i} className="card p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{job.role || `Experience ${i + 1}`}</h3>
                  <button onClick={() => set(["experience"], data.experience.filter((_, j) => j !== i))}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-all">Remove</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Role" value={job.role} onChange={(v) => { const e=[...data.experience]; e[i]={...e[i],role:v}; set(["experience"],e); }} />
                  <Field label="Company" value={job.company} onChange={(v) => { const e=[...data.experience]; e[i]={...e[i],company:v}; set(["experience"],e); }} />
                  <Field label="Duration" value={job.duration} onChange={(v) => { const e=[...data.experience]; e[i]={...e[i],duration:v}; set(["experience"],e); }} />
                  <Field label="Location" value={job.location} onChange={(v) => { const e=[...data.experience]; e[i]={...e[i],location:v}; set(["experience"],e); }} />
                  <Field label="Type (Internship / Full-time)" value={job.type} onChange={(v) => { const e=[...data.experience]; e[i]={...e[i],type:v}; set(["experience"],e); }} />
                </div>
                <TagsInput label="Tech Stack" tags={job.tech} onChange={(v) => { const e=[...data.experience]; e[i]={...e[i],tech:v}; set(["experience"],e); }} />
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Bullet Points</label>
                  {job.bullets.map((b, j) => (
                    <div key={j} className="flex gap-2 mb-2">
                      <textarea rows={2} value={b} onChange={(e) => { const exp=[...data.experience]; exp[i]={...exp[i],bullets:exp[i].bullets.map((x,k)=>k===j?e.target.value:x)}; set(["experience"],exp); }}
                        className="flex-1 bg-[#0f0f1a] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400/50 transition-all resize-none" />
                      <button onClick={() => { const exp=[...data.experience]; exp[i]={...exp[i],bullets:exp[i].bullets.filter((_,k)=>k!==j)}; set(["experience"],exp); }}
                        className="text-slate-500 hover:text-red-400 transition-colors self-start mt-2">×</button>
                    </div>
                  ))}
                  <button onClick={() => { const exp=[...data.experience]; exp[i]={...exp[i],bullets:[...exp[i].bullets,""]}; set(["experience"],exp); }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/20 hover:border-cyan-400/40 px-3 py-1.5 rounded-lg transition-all mt-1">+ Add bullet</button>
                </div>
              </div>
            ))}
            <button onClick={() => {
              const colors: ExperienceItem["color"][] = ["cyan","purple","emerald"];
              set(["experience"], [...data.experience, { role:"",company:"",duration:"",location:"",type:"Internship",color:colors[data.experience.length%3],bullets:[""],tech:[] }]);
            }} className="btn-outline w-full text-sm">+ Add Experience</button>
          </div>
        )}

        {/* ── Projects ── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <SectionHeader title="Projects" icon="🚀" />
            {data.projects.map((p, i) => (
              <div key={i} className="card p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{p.title || `Project ${i+1}`}</h3>
                  <button onClick={() => set(["projects"], data.projects.filter((_,j)=>j!==i))}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-400/20 px-3 py-1.5 rounded-lg transition-all">Remove</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Title" value={p.title} onChange={(v) => { const ps=[...data.projects]; ps[i]={...ps[i],title:v}; set(["projects"],ps); }} />
                  <Field label="Emoji" value={p.emoji} onChange={(v) => { const ps=[...data.projects]; ps[i]={...ps[i],emoji:v}; set(["projects"],ps); }} />
                  <Field label="Duration" value={p.duration} onChange={(v) => { const ps=[...data.projects]; ps[i]={...ps[i],duration:v}; set(["projects"],ps); }} />
                  <Field label="GitHub URL" value={p.github} onChange={(v) => { const ps=[...data.projects]; ps[i]={...ps[i],github:v}; set(["projects"],ps); }} />
                  <Field label="Live URL" value={p.live} onChange={(v) => { const ps=[...data.projects]; ps[i]={...ps[i],live:v}; set(["projects"],ps); }} />
                </div>
                <Field label="Description" value={p.description} onChange={(v) => { const ps=[...data.projects]; ps[i]={...ps[i],description:v}; set(["projects"],ps); }} textarea />
                <TagsInput label="Tech Stack" tags={p.tech} onChange={(v) => { const ps=[...data.projects]; ps[i]={...ps[i],tech:v}; set(["projects"],ps); }} />
                <div className="flex items-center gap-3">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Featured</label>
                  <button onClick={() => { const ps=[...data.projects]; ps[i]={...ps[i],highlight:!ps[i].highlight}; set(["projects"],ps); }}
                    className={`relative w-11 h-6 rounded-full transition-all ${p.highlight ? "bg-cyan-500" : "bg-slate-700"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${p.highlight ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => set(["projects"], [...data.projects, { title:"",description:"",tech:[],duration:"",github:"",live:"",highlight:false,emoji:"🚀" } as Project])}
              className="btn-outline w-full text-sm">+ Add Project</button>
          </div>
        )}

        {/* ── Education ── */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <SectionHeader title="Education" icon="🎓" />
            {data.education.map((ed, i) => (
              <div key={i} className="card p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{ed.degree || `Education ${i+1}`}</h3>
                  <button onClick={() => set(["education"], data.education.filter((_,j)=>j!==i))}
                    className="text-xs text-red-400 border border-red-400/20 px-3 py-1.5 rounded-lg">Remove</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Degree" value={ed.degree} onChange={(v) => { const e=[...data.education]; e[i]={...e[i],degree:v}; set(["education"],e); }} />
                  <Field label="Institution" value={ed.institution} onChange={(v) => { const e=[...data.education]; e[i]={...e[i],institution:v}; set(["education"],e); }} />
                  <Field label="Score / GPA" value={ed.score} onChange={(v) => { const e=[...data.education]; e[i]={...e[i],score:v}; set(["education"],e); }} />
                  <Field label="Year" value={ed.year} onChange={(v) => { const e=[...data.education]; e[i]={...e[i],year:v}; set(["education"],e); }} />
                  <Field label="Icon (emoji)" value={ed.icon} onChange={(v) => { const e=[...data.education]; e[i]={...e[i],icon:v}; set(["education"],e); }} />
                </div>
              </div>
            ))}
            <button onClick={() => set(["education"], [...data.education, { degree:"",institution:"",score:"",year:"",icon:"🎓" } as Education])}
              className="btn-outline w-full text-sm">+ Add Education</button>
          </div>
        )}

        {/* ── Achievements ── */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <SectionHeader title="Achievements" icon="🏆" />
            {(data.achievements ?? []).map((a, i) => (
              <div key={i} className="card p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{a.title || `Achievement ${i+1}`}</h3>
                  <button onClick={() => set(["achievements"], (data.achievements??[]).filter((_,j)=>j!==i))}
                    className="text-xs text-red-400 border border-red-400/20 px-3 py-1.5 rounded-lg">Remove</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Icon (emoji)" value={a.icon} onChange={(v) => { const x=[...(data.achievements??[])]; x[i]={...x[i],icon:v}; set(["achievements"],x); }} />
                  <Field label="Title" value={a.title} onChange={(v) => { const x=[...(data.achievements??[])]; x[i]={...x[i],title:v}; set(["achievements"],x); }} />
                </div>
                <Field label="Description" value={a.description} onChange={(v) => { const x=[...(data.achievements??[])]; x[i]={...x[i],description:v}; set(["achievements"],x); }} textarea />
              </div>
            ))}
            <button onClick={() => set(["achievements"], [...(data.achievements??[]), { icon:"🏆",title:"",description:"" } as Achievement])}
              className="btn-outline w-full text-sm">+ Add Achievement</button>
          </div>
        )}

        {/* Bottom save bar */}
        <div className="mt-10 flex items-center justify-between py-6 border-t border-white/5">
          <a href={`/p/${portfolioId}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">👁 View Live Portfolio</a>
          <button onClick={save} disabled={saveState === "saving"}
            className={`btn-primary ${saveState === "saving" ? "opacity-60 cursor-not-allowed" : ""}`}>
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ All Changes Saved!" : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
