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
      return `Analyze the site ${siteUrl} focusing on COLORS & CONTRAST. 
Provide exactly 3 actionable points. For each point:
- Clearly state what works well with color/contrast.
- Identify the exact element(s) that have issues.
- Suggest a precise fix.
If no issues are found, say "Colors look good." Keep feedback concise, professional, and actionable.`;

    case "typography":
      return `Analyze ${siteUrl} focusing on TYPOGRAPHY. 
Provide exactly 3 actionable points. For each point:
- Highlight what works (font choice, hierarchy, readability).
- Identify specific problems (font size, line height, hierarchy issues, etc.) with elements.
- Suggest a clear fix.
If typography is fine, say "Typography looks good." Keep feedback concise and professional.`;

    case "spacing":
      return `Analyze ${siteUrl} focusing on LAYOUT & SPACING. 
Provide exactly 3 actionable points. For each point:
- Mention what spacing/layout decisions are good.
- Identify specific spacing/layout issues (too tight, too loose, inconsistent grid, etc.).
- Suggest a precise fix.
If spacing is fine, say "Layout & spacing look good." Keep it concise and professional.`;

    case "usability":
      return `Analyze ${siteUrl} focusing on USABILITY & INTERACTION. 
Provide exactly 3 actionable points. For each point:
- Highlight any usable or clear elements.
- Identify usability issues (navigation, buttons, form interactions, mobile behavior, etc.) with specifics.
- Suggest a concrete fix.
If usability is fine, say "Usability looks good." Keep feedback clear and actionable.`;

    case "content":
      return `Analyze ${siteUrl} focusing on CONTENT CLARITY. 
Provide exactly 3 actionable points. For each point:
- Mention what content works (clarity, tone, brevity).
- Identify problems (long text blocks, unclear labels, jargon, etc.) with specific elements.
- Suggest a clear fix.
If content is fine, say "Content looks good." Be concise and professional.`;

    case "accessibility":
      return `Analyze ${siteUrl} focusing on ACCESSIBILITY. 
Provide exactly 3 actionable points. For each point:
- Note accessible elements if any.
- Identify accessibility issues (alt text, contrast, keyboard navigation, ARIA labels, etc.) with specifics.
- Suggest a precise fix.
If accessibility is fine, say "Accessibility looks good." Keep feedback actionable and professional.`;

    case "full":
      return `Analyze ${siteUrl} for overall design. 
Provide exactly 3 actionable points, each from a different category (colors, typography, spacing, usability, content, accessibility):
- For each point, clearly state what works.
- Identify specific issues with elements.
- Suggest precise fixes.
If everything looks good in a category, say "Category X looks good." Feedback must be concise, actionable, and professional.`;

    default:
      return `Analyze ${siteUrl}. Provide exactly 3 clear, actionable points:
- Highlight what works.
- Identify specific issues (with elements).
- Suggest precise fixes.
If there are no issues, say "Looks good." Keep feedback professional and precise.`;
  }
}

