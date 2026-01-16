import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export interface GeneratedPrompt {
  description: string;
  prompt: string;
}

export const generateCostumePrompts = async (
  apiKey: string,
  category: string,
  parts: Record<string, string>,
  designImage: string,
  count: number = 1
) => {
  const cleanApiKey = apiKey.trim();
  const genAI = new GoogleGenerativeAI(cleanApiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  const sexyLevelDescription = (level: string) => {
    const l = parseInt(level);
    if (l <= 2) return "modest, conservative, full coverage, elegant, long skirts, high necklines";
    if (l <= 4) return "stylish, normal attire, everyday fashion";
    if (l <= 6) return "slightly revealing, attractive, stylish cut, bare shoulders, shorter skirt";
    if (l <= 8) return "revealing, very sexy, emphasize curves, bold cutouts, minimal fabric, thigh high, deep cleavage";
    return "extremely daring, ultra sexy, bare skin focus, micro clothes, translucent elements, extreme high leg, minimal coverage, seductive design";
  };

  const prompt = `
    You are an AI expert specializing in crafting visual prompts for Stable Diffusion, Midjourney, and NovelAI.
    Your goal is to describe a character outfit with extreme detail.
    
    [INPUT SPECIFICATIONS]
    Vision Concept: ${designImage || 'Not specified'}
    Style: ${category}
    Base Costume: ${parts.base}
    Accessories: ${parts.accessories || 'None'}
    Sexy Level: ${parts.sexyLevel}/10 (${sexyLevelDescription(parts.sexyLevel)})
    Environment: ${parts.background}
    Pose: ${parts.pose}
    
    [OUTFIT INSTRUCTION]
    - Generate tags that describe the clothing, outfit, accessories, environment, and pose.
    - Strictly follow the "Sexy Level" for outfit coverage and revealingness.
    - DO NOT include quality tags (e.g., masterpiece, best quality, high quality, realistic, photorealistic, 4k, 8k).
    - DO NOT include art style tags (e.g., anime, illustration, oil painting).
    - If Environment or Pose is "none" or "standing", do not prioritize those specific keywords unless they naturally fit the composition.
    - Focus on garments, materials, textures, and the specific design of the costume, while integrating the Environment and Pose into the visual scene.

    [VARIATION REQUEST]
    - Please provide ${count} distinct versions/variations of the outfit based on the requirements.
    - For each variation, include a very brief Japanese summary (10-20 characters) describing the costume's essence.
    - Separate the Japanese description from the English tags using "[[PROMPT]]".
    - Separate each full variation with the exact marker "[[SPLIT]]" on a new line.
    
    [OUTPUT FORMAT]
    - Format: [[DESC]] 日本語の簡潔な説明 [[PROMPT]] English, comma, separated, tags
    - Example: [[DESC]] 銀の装飾が施された白い騎士服 [[PROMPT]] white knight uniform, silver filigree, shoulder pads, silk sash
    - DO NOT include any introductory text, background info, or conversational markers.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("AI returned an empty response.");
    }

    const variations: GeneratedPrompt[] = text.split('[[SPLIT]]').map(v => {
      const parts = v.split('[[PROMPT]]');
      const descPart = parts[0] || '';
      const desc = descPart.replace('[[DESC]]', '').trim();
      const promptText = parts[1]?.trim() || '';
      return { description: desc, prompt: promptText };
    }).filter(v => v.prompt.length > 0);

    return variations;
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    if (err.message?.includes("finishReason: SAFETY")) {
      throw new Error("プロンプトが制限に抵触しました。表現を少し和らげてみてください。");
    }
    throw err;
  }
};

export const generateSexyRangePrompts = async (
  apiKey: string,
  category: string,
  parts: Record<string, string>,
  designImage: string,
  referencePrompt?: string
) => {
  const cleanApiKey = apiKey.trim();
  const genAI = new GoogleGenerativeAI(cleanApiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

  const prompt = `
    You are an AI expert specializing in crafting visual prompts for AI art generators.
    
    [TASK]
    Generate a series of 10 prompts for the SAME costume concept, but with INCREASING "Sexy Level" from 1 to 10.
    
    ${referencePrompt ? `[REFERENCE PROMPT]
    This is the specific costume to expand upon: ${referencePrompt}` : `[INPUT]
    Base Costume: ${parts.base}
    Style: ${category}
    Accessories: ${parts.accessories || 'None'}
    Environment: ${parts.background}
    Pose: ${parts.pose}
    Vision Concept: ${designImage || 'Not specified'}`}

    [SEXY LEVEL SCALE - PRECISION PROGRESSION]
    Level 1: ORIGINAL DESIGN. The costume as intended, standard full attire, primary motifs intact.
    Level 2-4: Gradual reduction. Removing non-essential layers, shortening lengths, increasing skin exposure slightly.
    Level 5: SEXY MODIFICATION. Noticeably less fabric, flirty cutouts, shorter skirt/shorts, suggestive but still clearly the original outfit.
    Level 6-7: BOLD REFINEMENT. Stripping away more fabric, strategic transparency, high-leg cuts, emphasizes curves.
    Level 8: EXTREME MINIMALISM. Minimum surface area, micro-clothing, very provocative modifications to the base costume.
    Level 9-10: EROTIC EVOLUTION. Beyond just less fabric—incorporate erotic accessories (nipple covers, pasties, bondage-style straps, garter belts) and provocative design tweaks. 
    [CRITICAL CONSTRAINT] NO NUDITY. Nipples must be covered by fabric, pasties, or accessories at all times. Maintain the identity as a "costume" even at Level 10.

    [OUTPUT RULES]
    1. Provide exactly 10 variations, strictly adhering to the progression above.
    2. Maintain core DNA (colors, motifs) throughout the entire scale.
    3. Ensure Level 10 feels "Erotic" primarily through design and accessories, rather than just nudity.
    4. DO NOT include ANY quality, resolution, or art style tags (e.g., masterpiece, realistic, high quality, 8k, anime, photography).
    5. Format for each level: Level [N]: [[DESC]] Brief JP description [[PROMPT]] English Tags
    6. Separate levels with [[SPLIT]]

    [Example]
    Level 1: [[DESC]] 清楚な白ワンピ [[PROMPT]] white dress, long skirt, high neck
    [[SPLIT]]
    Level 2: ...
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const variations: GeneratedPrompt[] = text.split('[[SPLIT]]').map(v => {
      const levelMatch = v.match(/Level\s*\d+:/i);
      const cleanV = v.replace(levelMatch ? levelMatch[0] : '', '').trim();
      const p = cleanV.split('[[PROMPT]]');
      const descPart = p[0] || '';
      const desc = descPart.replace('[[DESC]]', '').trim();
      const promptText = p[1]?.trim() || '';
      return { description: desc, prompt: promptText };
    }).filter(v => v.prompt.length > 0);

    return variations;
  } catch (err: any) {
    console.error("Sexy Range Error:", err);
    throw err;
  }
};
