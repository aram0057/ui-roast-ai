import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Init OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type for API response
type RoastResponse = { roast: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoastResponse | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category, siteUrl } = req.body as { category?: string; siteUrl?: string };

    if (!siteUrl) {
      return res.status(400).json({ error: "Missing site URL" });
    }

    const selectedCategory = category || "full";

    // Build prompt
    const prompt = getCategoryPrompt(selectedCategory, siteUrl);

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a funny but expert UI/UX roast bot." },
        { role: "user", content: prompt },
      ],
    });

    // Safely access content
    const roastText = completion.choices?.[0]?.message?.content || "AI roast failed.";

    return res.status(200).json({ roast: roastText });
  } catch (error: unknown) {
    console.error("OpenAI error:", error instanceof Error ? error.message : error);
    return res.status(500).json({ error: "Failed to generate roast." });
  }
}

// -----------------------------
// Helper: dynamic prompts by category (senior designer style)
// -----------------------------
function getCategoryPrompt(category: string, siteUrl: string) {
  switch (category) {
    case "colors":
      return `Review ${siteUrl} for colors and contrast. Give 3 bullets: note what works, highlight an issue with an example, and suggest a fix (e.g., CTA button is too light—make darker). Keep under 256 characters. Do not use Markdown.`;

    case "typography":
      return `Review ${siteUrl} for typography. Give 3 bullets: note what works, highlight an issue with an example, and suggest a fix (e.g., body text too small—increase size). Keep under 256 characters. Do not use Markdown.`;

    case "spacing":
      return `Review ${siteUrl} for layout and spacing. Give 3 bullets: note what works, highlight an issue with an example, and suggest a fix (e.g., sections too close—add margin). Keep under 256 characters. Do not use Markdown.`;

    case "usability":
      return `Review ${siteUrl} for usability and interaction. Give 3 bullets: note what works, highlight an issue with an example, and suggest a fix (e.g., button unclear—add label). Keep under 256 characters. Do not use Markdown.`;

    case "content":
      return `Review ${siteUrl} for content clarity. Give 3 bullets: note what works, highlight an issue with an example, and suggest a fix (e.g., headline vague—make concise). Keep under 256 characters. Do not use Markdown.`;

    case "accessibility":
      return `Review ${siteUrl} for accessibility. Give 3 bullets: note what works, highlight an issue with an example, and suggest a fix (e.g., poor contrast—adjust colors). Keep under 256 characters. Do not use Markdown.`;

    case "full":
  return `Review ${siteUrl} overall. Give 6 bullets, one for each area: Colors, Typography, Spacing, Usability, Content, Accessibility. 
Each bullet should: note what works, highlight an issue with an example, and suggest a fix. Keep under 500 characters total. Do not use Markdown.`;


    default:
      return `Review ${siteUrl}. Give 3 bullets: note what works, highlight an issue with an example, and suggest a fix. Keep under 256 characters. Do not use Markdown.`;
  }
}

