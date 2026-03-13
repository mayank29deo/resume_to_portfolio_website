import Anthropic from "@anthropic-ai/sdk";
import type { PortfolioData } from "./types";
import type { LinkedInData } from "./linkedin";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a resume parser. Extract structured data from the resume text and return ONLY a valid JSON object — no markdown, no explanation, no code fences.

The JSON must exactly follow this TypeScript shape:
{
  "personal": {
    "name": string,
    "title": string,          // e.g. "Full-Stack Developer & Data Analyst"
    "taglines": string[],     // 4-5 short rotating roles, e.g. ["Frontend Developer","React Engineer"]
    "email": string,
    "phone": string,
    "linkedin": string,       // full URL or empty string
    "github": string,         // full URL or empty string
    "leetcode": string,       // full URL or empty string
    "location": string,
    "bio": string,            // 1-2 sentence professional summary
    "resumeUrl": "/resume.pdf",
    "openToWork": true
  },
  "education": [
    { "degree": string, "institution": string, "score": string, "year": string, "icon": "🎓" }
  ],
  "skills": {
    "Languages": ["Python", "JavaScript"],
    "Frameworks & Libraries": [],
    "Tools & Platforms": [],
    "Data & Analytics": [],
    "Other": []
  },
  "experience": [
    {
      "role": string,
      "company": string,
      "duration": string,
      "location": string,
      "type": "Internship" | "Full-time" | "Part-time" | "Freelance",
      "color": "cyan" | "purple" | "emerald",
      "bullets": string[],
      "tech": string[]
    }
  ],
  "projects": [
    {
      "title": string,
      "description": string,
      "tech": string[],
      "duration": string,
      "github": string,
      "live": string,
      "highlight": boolean,
      "emoji": string        // pick a relevant emoji
    }
  ],
  "achievements": [
    { "icon": string, "title": string, "description": string }
  ],
  "positions": [
    { "role": string, "org": string, "icon": string }
  ]
}

Rules:
- Assign colors to experience in order: first=cyan, second=purple, third=emerald, then repeat.
- If a field is missing in the resume, use an empty string or empty array — never omit the key.
- For skills, group them intelligently into the categories above.
- For taglines, derive 4-5 short role titles from the resume.
- Return ONLY the raw JSON object. No backticks, no prose.`;

export async function extractPortfolioData(
  resumeText: string
): Promise<PortfolioData> {
  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Here is the resume text:\n\n${resumeText}\n\nExtract and return the portfolio JSON.`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();

  const data = JSON.parse(cleaned) as PortfolioData;
  return data;
}

// ─── LinkedIn merge ───────────────────────────────────────────────────────────

export async function mergeLinkedInUpdates(
  resumeData: PortfolioData,
  linkedIn: LinkedInData
): Promise<{ data: PortfolioData; added: { experience: number; projects: number } }> {
  // Nothing to merge
  if (linkedIn.experience.length === 0 && linkedIn.projects.length === 0) {
    return { data: resumeData, added: { experience: 0, projects: 0 } };
  }

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are merging LinkedIn profile data into an existing resume-based portfolio.

STRICT RULES:
1. EXPERIENCE: Compare each LinkedIn entry by role+company against the existing experience array.
   - If the same company+role already exists → skip it (resume has more detail).
   - If it is genuinely new (different company, or different role at same company) → add it.
2. PROJECTS: Compare each LinkedIn project by title against the existing projects array.
   - If the same title already exists → skip it.
   - If it is genuinely new → add it.
3. NEVER modify or overwrite any existing resume entries.
4. For newly added experience: convert the "description" field into 2-3 concise bullet points, infer tech stack from description, set type to "Full-time" unless duration/description says otherwise.
5. For newly added projects: fill all required fields (tech:[], github:"", live:"", highlight:false, emoji: pick relevant one).
6. Reassign the "color" field for ALL experience entries in order: cyan → purple → emerald → cyan (cycling).
7. Return the COMPLETE portfolio JSON with every original field preserved.

Existing resume portfolio (do NOT modify existing entries):
${JSON.stringify(resumeData, null, 2)}

LinkedIn data to check for new entries:
${JSON.stringify(
  { experience: linkedIn.experience, projects: linkedIn.projects },
  null,
  2
)}

Return ONLY this JSON shape — no markdown, no explanation:
{
  "data": { ...complete updated portfolio JSON... },
  "added": { "experience": <number actually added>, "projects": <number actually added> }
}`,
      },
    ],
    system:
      "You are a portfolio data merger. Only add genuinely new entries from LinkedIn. Never overwrite existing resume data. Return ONLY valid JSON.",
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = raw
    .replace(/^```json?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    const result = JSON.parse(cleaned) as {
      data: PortfolioData;
      added: { experience: number; projects: number };
    };
    return {
      data: result.data,
      added: result.added ?? { experience: 0, projects: 0 },
    };
  } catch {
    // Merge failed — return original resume data untouched
    console.error("[mergeLinkedInUpdates] JSON parse failed, using resume data only");
    return { data: resumeData, added: { experience: 0, projects: 0 } };
  }
}
