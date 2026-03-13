export interface LinkedInExperience {
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string;
}

export interface LinkedInProject {
  title: string;
  description: string;
  duration: string;
  url: string;
}

export interface LinkedInData {
  experience: LinkedInExperience[];
  projects: LinkedInProject[];
  fetchStatus: "success" | "blocked" | "empty";
  message: string;
}

/** Format a Proxycurl date object like { year: 2022, month: 3 } into a readable string */
function formatDate(d: { year?: number; month?: number; day?: number } | null): string {
  if (!d || !d.year) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = d.month ? months[d.month - 1] : "";
  return month ? `${month} ${d.year}` : `${d.year}`;
}

/** Build a "Jan 2020 – Mar 2023" style duration string */
function buildDuration(
  starts_at: { year?: number; month?: number; day?: number } | null,
  ends_at: { year?: number; month?: number; day?: number } | null
): string {
  const start = formatDate(starts_at);
  const end = ends_at ? formatDate(ends_at) : "Present";
  if (!start) return "";
  return `${start} – ${end}`;
}

// Proxycurl person profile response shape (only fields we use)
interface ProxycurlExperience {
  title?: string;
  company?: string;
  description?: string;
  location?: string;
  starts_at?: { year?: number; month?: number; day?: number } | null;
  ends_at?: { year?: number; month?: number; day?: number } | null;
}

interface ProxycurlProject {
  title?: string;
  description?: string;
  url?: string;
  starts_at?: { year?: number; month?: number; day?: number } | null;
  ends_at?: { year?: number; month?: number; day?: number } | null;
}

interface ProxycurlProfile {
  experiences?: ProxycurlExperience[];
  accomplishment_projects?: ProxycurlProject[];
}

export async function fetchLinkedInData(profileUrl: string): Promise<LinkedInData> {
  const apiKey = process.env.PROXYCURL_API_KEY;

  if (!apiKey) {
    return {
      experience: [],
      projects: [],
      fetchStatus: "blocked",
      message: "Proxycurl API key not configured.",
    };
  }

  let url = profileUrl.trim();
  if (!url.startsWith("http")) url = "https://" + url;

  if (!url.includes("linkedin.com")) {
    return {
      experience: [],
      projects: [],
      fetchStatus: "blocked",
      message: "Invalid LinkedIn URL.",
    };
  }

  try {
    const apiUrl = new URL("https://nubela.co/proxycurl/api/v2/linkedin");
    apiUrl.searchParams.set("url", url);
    apiUrl.searchParams.set("skills", "exclude");
    apiUrl.searchParams.set("inferred_salary", "exclude");
    apiUrl.searchParams.set("personal_email", "exclude");
    apiUrl.searchParams.set("personal_contact_number", "exclude");

    const response = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // 404 = profile not found, 403/401 = bad key, 429 = rate limit
    if (response.status === 404) {
      return {
        experience: [],
        projects: [],
        fetchStatus: "blocked",
        message: "LinkedIn profile not found.",
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        experience: [],
        projects: [],
        fetchStatus: "blocked",
        message: "Invalid Proxycurl API key.",
      };
    }

    if (!response.ok) {
      return {
        experience: [],
        projects: [],
        fetchStatus: "blocked",
        message: `Proxycurl returned ${response.status} — skipping LinkedIn sync.`,
      };
    }

    const profile: ProxycurlProfile = await response.json();

    // Map experiences
    const experience: LinkedInExperience[] = (profile.experiences ?? [])
      .filter((e) => e.company || e.title)
      .map((e) => ({
        role: e.title ?? "",
        company: e.company ?? "",
        duration: buildDuration(e.starts_at ?? null, e.ends_at ?? null),
        location: e.location ?? "",
        description: e.description ?? "",
      }));

    // Map projects
    const projects: LinkedInProject[] = (profile.accomplishment_projects ?? [])
      .filter((p) => p.title)
      .map((p) => ({
        title: p.title ?? "",
        description: p.description ?? "",
        duration: buildDuration(p.starts_at ?? null, p.ends_at ?? null),
        url: p.url ?? "",
      }));

    const hasData = experience.length > 0 || projects.length > 0;

    return {
      experience,
      projects,
      fetchStatus: hasData ? "success" : "empty",
      message: hasData
        ? `LinkedIn: found ${experience.length} experience entry(s) and ${projects.length} project(s).`
        : "LinkedIn profile accessible but no experience/projects found.",
    };
  } catch (err) {
    return {
      experience: [],
      projects: [],
      fetchStatus: "blocked",
      message: `Could not reach Proxycurl (${
        err instanceof Error ? err.message : "network error"
      }) — skipping LinkedIn sync.`,
    };
  }
}
