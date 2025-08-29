import OpenAI from "openai";

// Initialize OpenAI client only if API key exists
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Fake roast mode for testing / demo
  if (!client) {
    const fakeRoast = `
Oh wow… this UI is so bad it made me cry in Comic Sans.
1. Use colors that don’t blind the user.
2. Organize buttons like a human would.
3. Stop using 20px padding everywhere like it’s a magic spell.
`;
    return res.status(200).json({ roast: fakeRoast });
  }

  // Real OpenAI call
  try {
    const prompt = `
Roast this UI design screenshot like Gordon Ramsay.
Be brutal but funny. Also give 3 actionable tips to improve it.
Pretend this design looks bad.
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    // Send the AI-generated roast
    res.status(200).json({
      roast: response.output[0].content[0].text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate roast." });
  }
}
