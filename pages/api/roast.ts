import { IncomingForm, File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error parsing form" });
    }

    const judgeField = fields.judge;
    const judge = Array.isArray(judgeField) ? judgeField[0] : judgeField || "gordon";

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    console.log("Received judge:", judge);
    console.log("Received file:", uploadedFile?.originalFilename);

    let roastText = "";
    switch (judge) {
      case "gordon":
        roastText = "🍳 Gordon says: This UI looks like a burnt toast! 3 tips: 1. Improve contrast. 2. Reduce clutter. 3. Use proper spacing.";
        break;
      case "grandma":
        roastText = "👵 Grandma says: Too complicated! 3 tips: 1. Bigger buttons. 2. Simplify menus. 3. Clear fonts.";
        break;
      case "ipad_kid":
        roastText = "📱 iPad Kid says: Boring! 3 tips: 1. Add animations. 2. Make colors pop. 3. Shorter text.";
        break;
      default:
        roastText = "Here's a generic roast: Fix your UI! 3 tips: 1. Color. 2. Layout. 3. Usability.";
    }

    return res.status(200).json({ roast: roastText });
  });
}
