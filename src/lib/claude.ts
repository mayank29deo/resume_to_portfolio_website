import Anthropic from "@anthropic-ai/sdk";
import type { PortfolioData } from "./types";

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
