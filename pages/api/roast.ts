import { IncomingForm, File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

// Init OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error parsing form" });
    }

    const judgeField = fields.judge;
    const judge = Array.isArray(judgeField) ? judgeField[0] : judgeField || "gordon";

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    console.log("Received judge:", judge);
    console.log("Received file:", uploadedFile?.originalFilename);

    try {
      // Read uploaded image file
      const filePath = uploadedFile?.filepath;
      const fileBuffer = filePath ? fs.readFileSync(filePath) : null;
      const base64Image = fileBuffer ? fileBuffer.toString("base64") : "";

      // Build the prompt
      const prompt = getJudgePrompt(judge, base64Image);

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
  });
}

// Helper: dynamic prompts per judge
function getJudgePrompt(judge: string, base64Image: string) {
  switch (judge) {
    case "gordon":
      return `You are Gordon Ramsay. Roast this UI screenshot brutally and sarcastically. Screenshot (base64): ${base64Image}. Then give exactly 3 tips to improve it.`;
    case "grandma":
      return `You are a grandma who dislikes complicated tech. Roast this UI screenshot humorously. Screenshot (base64): ${base64Image}. Then give exactly 3 tips to simplify it.`;
    case "ipad_kid":
      return `You are an impatient iPad kid. Roast this UI screenshot in a silly, sarcastic way. Screenshot (base64): ${base64Image}. Then give exactly 3 tips to make it fun.`;
    default:
      return `Roast this UI screenshot and provide 3 actionable tips. Screenshot (base64): ${base64Image}.`;
  }
}
