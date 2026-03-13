import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

function isAuthWalled(html: string, finalUrl: string): boolean {
  return (
    finalUrl.includes("authwall") ||
    finalUrl.includes("/login") ||
    finalUrl.includes("/signup") ||
    html.includes("authwall") ||
    html.includes("Join to view") ||
    html.includes("Sign in to view") ||
    html.includes("Log in to LinkedIn") ||
    html.includes(" LinkedIn is better with a free account")
  );
}

async function extractFromHtml(
  html: string
): Promise<{ experience: LinkedInExperience[]; projects: LinkedInProject[] }> {
  // Pull JSON-LD blocks which contain structured profile data
  const jsonLdBlocks: string[] = [];
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = jsonLdRegex.exec(html)) !== null) {
    jsonLdBlocks.push(m[1]);
  }

  // Strip HTML tags → plain readable text
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 15000);

  const context =
    jsonLdBlocks.length > 0
      ? `Structured JSON-LD Data:\n${jsonLdBlocks.slice(0, 3).join("\n")}\n\nPage Text:\n${textContent}`
      : `Page Text:\n${textContent}`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Extract ALL work experience positions and projects from this LinkedIn profile data.

Return ONLY this exact JSON shape — no markdown, no explanation:
{
  "experience": [
    { "role": string, "company": string, "duration": string, "location": string, "description": string }
  ],
  "projects": [
    { "title": string, "description": string, "duration": string, "url": string }
  ]
}

Use empty arrays if none found. Descriptions should capture all bullet points/details.

Data:
${context}`,
      },
    ],
    system:
      "You extract LinkedIn experience and projects from raw HTML/JSON-LD. Return ONLY valid JSON.",
  });

  const raw =
    message.content[0].type === "text"
      ? message.content[0].text
      : '{"experience":[],"projects":[]}';
  const cleaned = raw
    .replace(/^```json?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return { experience: [], projects: [] };
  }
}

export async function fetchLinkedInData(profileUrl: string): Promise<LinkedInData> {
  let url = profileUrl.trim();
  if (!url.startsWith("http")) url = "https://" + url;

  // Ensure it's a LinkedIn profile URL
  if (!url.includes("linkedin.com")) {
    return {
      experience: [],
      projects: [],
      fetchStatus: "blocked",
      message: "Invalid LinkedIn URL provided.",
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const finalUrl = response.url;
    const html = await response.text();

    if (!response.ok || isAuthWalled(html, finalUrl)) {
      return {
        experience: [],
        projects: [],
        fetchStatus: "blocked",
        message:
          "LinkedIn profile is private or requires login — portfolio built from resume only.",
      };
    }

    const extracted = await extractFromHtml(html);
    const hasData =
      extracted.experience.length > 0 || extracted.projects.length > 0;

    return {
      ...extracted,
      fetchStatus: hasData ? "success" : "empty",
      message: hasData
        ? `LinkedIn: found ${extracted.experience.length} experience entry(s) and ${extracted.projects.length} project(s).`
        : "LinkedIn profile accessible but no experience/projects found.",
    };
  } catch (err) {
    return {
      experience: [],
      projects: [],
      fetchStatus: "blocked",
      message: `Could not reach LinkedIn (${
        err instanceof Error ? err.message : "network error"
      }) — portfolio built from resume only.`,
    };
  }
}
