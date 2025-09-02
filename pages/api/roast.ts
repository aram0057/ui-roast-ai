import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Init OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { judge, imageUrl } = req.body as { judge?: string; imageUrl?: string };

    if (!imageUrl) {
      return res.status(400).json({ error: "Missing image URL" });
    }

    const selectedJudge = judge || "gordon";

    // Build prompt with URL instead of base64
    const prompt = getJudgePrompt(selectedJudge, imageUrl);

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a funny roast bot for UI design." },
        { role: "user", content: prompt },
      ],
    });

    const roastText = completion.choices[0].message?.content || "AI roast failed.";

    return res.status(200).json({ roast: roastText });
  } catch (error: any) {
    console.error("OpenAI error:", error);
    return res.status(500).json({ error: "Failed to generate roast." });
  }
}

// Helper: dynamic prompts per judge
function getJudgePrompt(judge: string, siteUrl: string) {
  switch (judge) {
    case "gordon":
      return `You are Gordon Ramsay, the master chef. Visit the website at ${siteUrl} (or analyze its content) and roast it brutally in one short, punchy line. Then provide exactly 3 actionable, expert-level tips about **specific elements** like colors, fonts, spacing, or layout. Mention where the problem is (e.g., "header color too dark", "font too small in buttons") and why. Use natural bullets and matching emojis. Keep it funny, professional, and human-like. No Markdown headings, no bolding.`;

    case "grandma":
      return `You are a kind but brutally honest grandma who dislikes complicated tech. Look at the website at ${siteUrl} (or analyze it) and roast it humorously in one short, witty line. Then provide exactly 3 clear, actionable tips that refer to **specific elements** like font size, button placement, or colors. Explain why each is confusing or needs improvement. Use natural bullets with emojis, human-like tone, funny but constructive. Avoid Markdown headings or bolding.`;

    case "ipad_kid":
      return `You are an impatient iPad kid. Check the website at ${siteUrl} (or analyze it) and roast it in a silly, sarcastic punchy line. Then provide exactly 3 actionable tips targeting **specific elements** like colors, fonts, spacing, or images. Explain where the problem is and why it affects usability. Use natural bullets, matching emojis, human-like tone, funny but clear. No Markdown or bolding.`;

    default:
      return `Analyze the website at ${siteUrl}. Roast it in one concise line and then give exactly 3 actionable, expert-level tips that mention **specific elements** like font, color, spacing, layout, or imagery. Explain where and why there is a problem. Use natural bullets and emojis, human-like tone, funny but professional. No Markdown headings or artificial bolding.`;
  }
}



