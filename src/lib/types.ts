// ─── Core data shape — matches the portfolio template's resume.ts schema ───

export interface Personal {
  name: string;
  title: string;
  taglines: string[];
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  leetcode: string;
  location: string;
  bio: string;
  resumeUrl: string;
  openToWork: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  score: string;
  year: string;
  icon: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  location: string;
  type: string;
  color: "cyan" | "purple" | "emerald";
  bullets: string[];
  tech: string[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  duration: string;
  github: string;
  live: string;
  highlight: boolean;
  emoji: string;
}

export interface Achievement {
  icon: string;
  title: string;
  description: string;
}

export interface Position {
  role: string;
  org: string;
  icon: string;
}

export interface Skills {
  [category: string]: string[];
}

export interface PortfolioData {
  personal: Personal;
  education: Education[];
  skills: Skills;
  experience: ExperienceItem[];
  projects: Project[];
  achievements: Achievement[];
  positions: Position[];
}

// ─── DB row ───────────────────────────────────────────────────────────────────
export interface PortfolioRow {
  id: string;
  data: PortfolioData;
  created_at: string;
  updated_at: string;
}
