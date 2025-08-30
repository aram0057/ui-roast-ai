// pages/api/roast.ts
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Helper to generate prompt based on judge
function getJudgePrompt(judge: string, fileName: string) {
  switch (judge) {
    case "gordon":
      return `You are Gordon Ramsay. Roast this UI design screenshot (${fileName}). Be brutally funny and sarcastic, then give exactly 3 clear actionable tips. Number them.`;
    case "grandma":
      return `You are a grandma who dislikes complicated tech. Critique this UI screenshot (${fileName}) humorously for simplicity, readability, and usability. Then give exactly 3 actionable tips to make it simpler. Number them.`;
    case "ipad_kid":
      return `You are an impatient iPad kid. Check this UI screenshot (${fileName}). Comment sarcastically on confusing or boring parts, then give exactly 3 concise actionable tips to make it flashy and engaging. Number them.`;
    default:
      return `Roast this UI screenshot (${fileName}) and provide exactly 3 actionable tips. Number them.`;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { judge, file } = req.body;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const prompt = getJudgePrompt(judge || "gordon", file);

    // Call OpenAI Chat API
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    // Safely extract text
    const roastText = response.choices?.[0]?.message?.content || "No roast generated";

    return res.status(200).json({ roast: roastText });
  } catch (err) {
    console.error("AI roast error:", err);
    return res.status(500).json({ error: "Failed to generate roast" });
  }
}
