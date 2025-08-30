import OpenAI from "openai";

// Initialize OpenAI client only if API key exists
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { judge } = req.body;

  // Pick personality based on judge
  let stylePrompt;
  switch (judge) {
    case "gordon":
      stylePrompt = `
      Roast this UI like Gordon Ramsay. Be savage, sarcastic, food-themed, and brutally honest.
      Include at least 3 actionable tips to improve the design.`;
      break;
    case "grandma":
      stylePrompt = `
      Roast this UI like a Grandma who hates tech. 
      Complain about confusing layouts, too many buttons, and things that are hard to read. 
      End with 3 practical tips for making it simpler.`;
      break;
    case "ipad_kid":
      stylePrompt = `
      Roast this UI like an iPad kid with a short attention span. 
      Be whiny, chaotic, and impatient. Complain if it's boring or slow. 
      End with 3 tips to make it faster, flashier, and attention-grabbing.`;
      break;
    default:
      stylePrompt = `
      Roast this UI brutally and humorously. 
      Include 3 actionable tips to improve the design.`;
  }

  // Fake roast mode for testing / demo (no API key)
  if (!client) {
    const fakeRoast = `
This is a fake roast (demo mode).
Judge chosen: ${judge || "default"}.
1. Stop blinding users.
2. Organize your layout.
3. Don't let Comic Sans happen. Ever.
`;
    return res.status(200).json({ roast: fakeRoast });
  }

  // Real OpenAI call
  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: stylePrompt,
    });

    res.status(200).json({
      roast: response.output[0].content[0].text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate roast." });
  }
}
