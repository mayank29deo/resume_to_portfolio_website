import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/db";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import EducationSection from "@/components/portfolio/Education";
import Achievements from "@/components/portfolio/Achievements";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import type { Metadata } from "next";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await getPortfolio(params.id);
  if (!row) return { title: "Portfolio Not Found" };
  const { personal } = row.data;
  return {
    title: `${personal.name} — Portfolio`,
    description: personal.bio,
  };
}

export default async function PortfolioPage({ params }: Props) {
  const row = await getPortfolio(params.id);
  if (!row) notFound();

  const { personal, education, skills, experience, projects, achievements, positions } = row.data;

  return (
    <main className="relative min-h-screen bg-[#080810]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar personal={personal} portfolioId={params.id} />
        <Hero personal={personal} education={education} />
        <About personal={personal} positions={positions ?? []} />
        <Skills skills={skills} />
        <Experience experience={experience} />
        <Projects projects={projects} />
        <EducationSection education={education} />
        <Achievements achievements={achievements ?? []} />
        <Contact personal={personal} />
        <Footer personal={personal} portfolioId={params.id} />
      </div>
    </main>
  );
}
