import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { DesignParts } from '../types';

const WHITE_BACKGROUND_PROMPT = "(simple background:1.5),(plain background:1.5),(white background:1.5)";

const MODEL_STAND_POSES = [
  "parade rest, standing",
  "contrapposto",
  "standing, sway back",
  "arched back, standing",
  "crossed legs, standing",
  "watson cross",
  "uneven footing, standing",
  "standing on one leg",
  "legs apart, feet apart, standing",
  "leaning forward, standing"
];

const MODEL_EXPRESSIONS = [
  "neutral expression, calm look",
  "confident look, looking at viewer",
  "faint smile, gentle eyes",
  "cool gaze, professional look",
  "slight smirk, sophisticated expression"
];

const sexyLevelDescription = (level: number) => {
  if (level <= 2) {
    return "PHASE 1: STRICTLY MODEST (Safe/High-Neck). Long skirts, full coverage, long sleeves, high necklines. No skin exposure except face/hands. (Keywords: 'modest, high-neck, turtle-neck, floor-length skirt')";
  }
  if (level <= 4) {
    return "PHASE 2: STANDARD (Daily/Professional). Standard fashion, knee-length skirts, normal necklines. Balanced and polite. (Keywords: 'standard fit, everyday fashion, knee-length')";
  }
  if (level <= 6) {
    return "PHASE 3: SUGGESTIVE (Fashionable/Flirty). Bare shoulders, mini-skirt, short shorts, slightly deep neckline. (Keywords: 'off-shoulder, sleeveless, mini-skirt, short shorts, cleavage')";
  }
  if (level <= 8) {
    return "PHASE 4: BOLD & RISQUÉ (Lingerie Style). High-cut legs, deep plunging neckline, peek-a-boo cutouts, open back, sheer parts. (Keywords: 'bold cutouts, high-cut, very short, see-through accents, plunging neckline')";
  }
  return "PHASE 5: EXTREME/MICRO (Destruction & Reconstruction). Almost naked, nearly bare skin focus. Outfit is torn or micro-sized. Nipples MUST be covered by pasties, band-aids, or creative elements. (Keywords: 'micro-bikini, pasties, heart-shaped pasties, star-shaped nipple covers, metallic covers, body piercings, band-aids as nipple covers, cross-shaped bandages, extreme high-cut, torn clothes, string-only, barely covering'). MAINTAIN ZERO NUDITY but maximize intensity and VARIETY of covers.";
};

const POSE_GUIDES: Record<string, string> = {
  model: "Focus on professional standing postures.",
  cool: "Focus on confidence and strength. Creative Examples: Arms crossed, hand in pocket, leaning against wall, looking down at viewer, dynamic fighting stance, sharp side profile, wind blowing hair, intense gaze, walking towards viewer, adjusting sunglasses.",
  cute: "Focus on charm and innocence. Creative Examples: Peace sign, hands on cheeks, tilting head, jumping, sitting and hugging knees, winking, holding an object close, pigeon-toed stance, cat paw pose, looking up at viewer.",
  sexy: "Focus on allure and body curves. Creative Examples: Arched back, looking over shoulder, biting lip, lying on side, pulling strap, S-curve standing, highlighting legs or cleavage, sultry expression, kneeling.",
  elegant: "Focus on grace and sophistication. Creative Examples: Curtsy, slow walking, hand on chest, looking up at moon, sitting with crossed legs, holding wine glass (if appropriate), soft flowing movements, turning gently.",
  natural: "Focus on candid and relaxed moments. Creative Examples: Stretching, fixing hair, yawning, laughing, walking, reading a book, sitting on a bench, candid snapshot style, looking away naturally, holding a drink.",
  random: "Creative, experimental, and unpredictable poses that fit the outfit."
};

const EXPRESSION_GUIDES: Record<string, string> = {
  happy: "Focus on joy and positivity. Creative Examples: Gentle smile, laughing with eyes closed, beaming grin, soft giggle, ecstatic expression, looking delighted, slight smirk of happiness.",
  cool: "Focus on composure and sharpness. Creative Examples: Sharp gaze, emotionless stare, looking down somewhat, confident smirk, serious eyes, unbroken eye contact, mysterious look.",
  cute: "Focus on sweetness and innocence. Creative Examples: Stick out tongue, shy glance, wide eyes, puffed cheeks, winking, surprised look, innocent smile, looking up.",
  sexy: "Focus on allure and desire. Creative Examples: Biting lip, half-lidded eyes, sultriness, licking lips, desire-filled gaze, heavy breathing look, looking over shoulder.",
  emotional: "Focus on deep feelings or sadness. Creative Examples: Teary eyes, melancholic gaze, looking distant, pained smile, crying, overwhelmed emotion, fragile look.",
  aggressive: "Focus on intensity and power. Creative Examples: Furrowed brows, shouting, clenched teeth, crazy smile, intense glare, battle cry face, menacing look.",
  random: "Creative, experimental, and unpredictable expressions."
};

const FRAMING_GUIDES: Record<string, string> = {
  model: "full body, from front, eye level",
  random: "Best angle to showcase the outfit.",
  full_body: "full body shot, showing shoes and head, ensuring the entire costume is visible",
  knee_up: "knee up shot, balanced composition focusing on the main outfit",
  portrait: "upper body shot, portrait, focus on face and chest details",
  front: "view from front, symmetric composition, best for reference",
  side: "view from side, side profile, highlighting side details",
  back: "view from behind, back shot, showing back design",
  dynamic: "dynamic angle, dutch angle, from below or above, dramatic composition"
};

export const generateCostumePrompts = async (
  apiKey: string,
  parts: DesignParts,
  count: number = 1,
  language: 'ja' | 'en' = 'ja'
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

  const themeAdjectives: Record<string, string> = {
    cool: "sharp, edgy, modern, stylish, confident, sleek",
    cute: "adorable, sweet, playful, soft, charming, lovely",
    sexy: "alluring, bold, seductive, glamorous, mature",
    elegant: "sophisticated, graceful, refined, high-class, classic",
    natural: "relaxed, effortless, casual, authentic, comfortable",
    random: "creative, experimental, unpredictable"
  };

  const currentThemeAdj = themeAdjectives[parts.theme] || "";
  const sexyConstraint = sexyLevelDescription(parts.sexyLevel);

  // --- DESIGN SANITIZATION FOR REMIX ---
  // If moving from high sexy level to low sexy level, we need to strip contradictory tags
  let sanitizedBaseDesign = parts.remixBaseDesign || "";
  if (parts.remixBaseDesign && parts.sexyLevel <= 7) {
    const extremeTags = [
      "pasties", "nipple covers", "nipple tape", "heart-shaped pasties",
      "star-shaped pasties", "nipple stickers", "metallic covers",
      "micro bikini", "micro skirt", "extreme high-cut", "ultra high-cut",
      "barely covering", "torn clothes", "string-only", "micro-sized",
      "see-through", "transparent", "translucent"
    ];

    // Create a regex to match these tags (with word boundaries and optional surrounding spaces/commas)
    const pattern = new RegExp(`\\b(${extremeTags.join("|")})\\b`, "gi");
    sanitizedBaseDesign = parts.remixBaseDesign
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => !tag.match(pattern))
      .join(', ');
  }

  // --- STAGE 1: COSTUME DESIGN ONLY ---
  // Enhanced Accessory logic
  let accessoryConstraint = "";
  if (parts.accessoryLevel <= 2) {
    accessoryConstraint = "MINIMALIST: NO accessories, NO jewelry. Only the base clothes. (Keyword: 'minimalist, simple, clean')";
  } else if (parts.accessoryLevel <= 5) {
    accessoryConstraint = "STANDARD: 1-2 basic themed accessories (e.g. only a headband). (Keyword: 'basic accessories')";
  } else if (parts.accessoryLevel <= 8) {
    accessoryConstraint = "HIGH-DENSITY: Add many accessories. Necklaces, belts, ribbons, stockings, goggles, or glowing LEDs. (Keyword: 'highly detailed, layered accessories, decorative jewelry')";
  } else {
    accessoryConstraint = "EXTREME OVERLOAD: Physically impossible amount of detail. Floating parts, massive wings, layered lace, heavy mechanical parts, jewelry on every limb. (Keyword: 'hyper-detailed, overwhelming accessories, intricate ornaments, maximum density')";
  }

  const stage1Prompt = `
    [STAGE 1: MASTER COSTUME DESIGNER]
    Task: Design ${count} unique fashion outfits based on the [USER CHARACTER CONCEPT].
    
    [CORE HIERARCHY]
    1. PRIMARY SUBJECT: ${parts.concept || 'None (Follow Theme instead)'}
    2. STYLE FILTER (Theme): "${parts.theme.toUpperCase()}" (${currentThemeAdj})
    ${sanitizedBaseDesign ? `3. MANDATORY BASE DESIGN (Tags): "${sanitizedBaseDesign}"` : ''}
    
    [PHASE 0: SEMANTIC EXTRACTION]
    - Analyze the Japanese/English concept above. 
    ${sanitizedBaseDesign ? `- IMPORTANT: Use the MANDATORY BASE DESIGN as the immutable foundation for the outfit. Do not change its core elements, only apply the requested style/modifiers.` : ''}
    ${parts.remixBaseDesign && sanitizedBaseDesign !== parts.remixBaseDesign ? `- NOTE: Some extreme exposure tags from the original design were removed to satisfy the current [SEXY LEVEL ${parts.sexyLevel}]. Replace them with appropriate full-coverage alternatives (e.g., standard fabric, proper top, full underwear).` : ''}
    - Extract ALL character identity markers (e.g. 'Warrior', 'Nurse', 'Student').
    - Extract ALL visual nuances (e.g. '歴戦' -> battle-worn, rugged, scuffed gear, scuffed metal; '豪華' -> ornate, gold-trim).
    - MAINTAIN CHARACTER IDENTITY AT ALL COSTS. The subject is the foundation.
    
    [PHASE 1: SYNTHESIS & ELEVATION]
    - If the Theme and Concept conflict (e.g. Elegant + School Swimsuit):
        - Create a "High-Fashion/Designer" version of the concept.
        - Silhouette: Keep the recognizable silhouette of the [PRIMARY SUBJECT].
        - Material: Elevate to premium fabrics (silk sheen, velvet, high-tech matte, sheer lace).
        - Details: Add sophisticated hardware (gold/silver), asymmetrical cuts, or layered textures.
    - If the Theme and Concept align:
        - Maximize the synergy between the character archetype and the aesthetic.
    
    [CONSTRAINTS]
    - Sexy Level (${parts.sexyLevel}/10): ${sexyConstraint}
    - Accessory Level (${parts.accessoryLevel}/10): ${accessoryConstraint}
    
    [OUTPUT FORMAT]
    Provide ${count} variations separated by "[[SPLIT]]". 
    Each item MUST follow this format exactly:
    [[NAME]] Professional name (${language === 'en' ? 'Equation: [Style Keyword] + [English Character Archetype]' : 'Equation: [Style Keyword] + [Japanese Character Archetype]'}). 
    [[DESC]] Brief ${language === 'en' ? 'English' : 'Japanese'} summary (one line)
    [[COSTUME]] English tags ONLY for outfit/accessories. Include high-weight tags for character identity first.
    [[SPLIT]]
    
    *RULES*: 
    - POETIC OR VAGUE NAMES ARE FORBIDDEN.
    - Names must be descriptive (e.g. ${language === 'en' ? "'Elegant Warrior', 'Sexy Battle-Worn Warrior'" : "'エレガント・女勇者', 'セクシー・歴戦の女勇者'"}).
    - Output ONLY the specified tags.
    - FORBIDDEN TAGS: No environment, lighting, or camera tags in [[COSTUME]]. Focus ONLY on the character.
    - ABSOLUTELY NO JAPANESE TEXT in [[COSTUME]]. All tags must be English.
    ${parts.sexyLevel >= 9 ? "- Level 10 means pasties or creative covers. Use 'pasties', 'heart-shaped pasties', 'metallic covers'." : ""}
  `;

  try {
    const res1 = await model.generateContent(stage1Prompt);
    const text1 = res1.response.text();
    const costumes = text1.split('[[SPLIT]]').map(v => ({
      name: (v.match(/\[\[NAME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim(),
      desc: (v.match(/\[\[DESC\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim(),
      tags: (v.match(/\[\[COSTUME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim()
        .replace(/(background|room|sky|ocean|beach|city|street|view|scenery|landscape|indoor|outdoor|lighting|shadow|cinematic|bokeh|depth of field)/gi, '') // Remove environmental hallucinations
        .replace(/,\s*,/g, ',').trim(), // Cleanup commas
    })).filter(c => c.tags);

    if (costumes.length === 0) {
      if (text1.includes('[[COSTUME]]')) {
        const costumeTags = (text1.match(/\[\[COSTUME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
        const costumeName = (text1.match(/\[\[NAME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || 'New Collection').trim();
        const desc = (text1.match(/\[\[DESC\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || 'Generated Costume').trim();
        if (costumeTags) costumes.push({ name: costumeName, desc, tags: costumeTags });
      }
    }

    // --- STAGE 2: INDEPENDENT DIRECTOR ---
    const stage2Prompt = `
      [STAGE 2: CINEMATIC DIRECTOR]
      Task: Generate ${costumes.length} sets of cinematic atmospheric settings and pose details.
      
      [CONTEXT]
      - Theme: "${parts.theme.toUpperCase()}"
      - Concept Vibe: ${parts.concept || 'NONE'}
      - Background Mode: ${parts.useWhiteBackground ? 'FORCED WHITE' : 'DYNAMIC SCENE'}
      - Lighting Mode: ${parts.enableLighting ? 'ON' : 'OFF'}
      
      [USER CUSTOM REQUESTS (HIGHEST PRIORITY)]
      - Custom Pose Request: ${parts.poseDescription ? `"${parts.poseDescription}" (MUST FOLLOW THIS)` : 'None'}
      - Custom Expression Request: ${parts.expressionDescription ? `"${parts.expressionDescription}"` : 'None'}
      - Custom Framing Request: ${parts.framingDescription ? `"${parts.framingDescription}"` : 'None'}

      [GUIDES (Use only if no custom request)]
      - Expression Style: ${parts.expression ? parts.expression.toUpperCase() : 'RANDOM'} (${EXPRESSION_GUIDES[parts.expression || 'random']})
      - Pose Style: ${parts.pose ? parts.pose.toUpperCase() : 'RANDOM'} (${POSE_GUIDES[parts.pose || 'random']})
      
      [COSTUME CONTEXT]
      ${costumes.map((c, i) => `Costume ${i}: ${c.name} (${c.desc})`).join('\n')}

      [INSTRUCTIONS]
      1. POSE & EXPRESSION:
        - IF [Custom Pose Request] is present: IGNORE all preset styles. Generate precise tags for "${parts.poseDescription}".
        - IF [Custom Expression Request] is present: IGNORE preset styles. Generate tags for "${parts.expressionDescription}".
        - OTHERWISE: Follow the GUIDES.

      2. SCENE:
        - If Background is WHITE: Use "simple background, white background".
        - If Background is DYNAMIC: Analyze the costume + theme. Create a PERFECTLY FITTING background.
      
      3. LIGHTING:
        - If Mode ON: Use "cinematic lighting, dramatic shadows, volumetric lighting, rim light".
        - If Mode OFF: FORBIDDEN to use any lighting tags. Keep it FLAT and NATURAL.

      4. GAZE:
        - FORBIDDEN: NEVER use the word 'camera'. Use 'looking at viewer', 'eye contact', or 'gaze'.

      5. CUSTOM INPUT HANDLING & LANGUAGE:
        - ABSOLUTE PROHIBITION: DO NOT output Japanese text in ANY tags ([[POSE]], [[EXPRESSION]], [[FRAMING]], [[SCENE]]).
        - INTERPRETATION: If a custom request is provided (Japanese or English):
          1. Analyze the core intent and visual nuance.
          2. Convert it into effective English image generation tags.
          3. DO NOT just translate literally; EXPAND into descriptive visual tags.
          (e.g. "Wariza" -> "wariza, w-sitting, sitting on floor, knees bent")
          (e.g. "キリッと" -> "sharp gaze, fierce expression, confident, serious")

      [OUTPUT FORMAT]
      Return exactly ${costumes.length} items separated by "[[SPLIT]]":
      [[ID]] Index (0 to ${costumes.length - 1})
      [[POSE]] English Pose tags only. ABSOLUTELY NO JAPANESE TEXT.
      [[EXPRESSION]] English Facial expression tags only. ABSOLUTELY NO JAPANESE TEXT.
      [[FRAMING]] Angle/Framing tags only. ABSOLUTELY NO JAPANESE TEXT.
      [[SCENE]] Environment/Lighting tags only. ABSOLUTELY NO JAPANESE TEXT.
      [[SPLIT]]
    `;

    const res2 = await model.generateContent(stage2Prompt);
    const text2 = res2.response.text();

    const stage2Results = text2.split('[[SPLIT]]').map(v => {
      const idMatch = v.match(/\[\[ID\]\]\s*(\d+)/);
      if (!idMatch) return null;
      const idx = parseInt(idMatch[1]);
      return {
        idx,
        pose: (v.match(/\[\[POSE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim(),
        expression: (v.match(/\[\[EXPRESSION\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim(),
        framing: (v.match(/\[\[FRAMING\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim(),
        scene: (v.match(/\[\[SCENE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim(),
      };
    }).filter(v => v !== null);

    return costumes.map((baseCostume, i) => {
      const director = stage2Results.find(r => r.idx === i) || stage2Results[i] || { pose: '', expression: '', framing: '', scene: '' };

      // 1. POSE LOGIC
      // If user provided a custom description, ALWAYS use the director's generation (which followed the custom request).
      // Only use the "Model Preset" logic if NO custom description exists AND the user selected 'model'.
      let finalPoseTags = '';

      if (!parts.poseDescription && parts.pose === 'model') {
        // Fallback to random model poses ONLY if no custom description
        const randomPose = MODEL_STAND_POSES[Math.floor(Math.random() * MODEL_STAND_POSES.length)];
        finalPoseTags = randomPose;
      } else {
        // Use AI generated pose (which respects custom input or theme)
        finalPoseTags = director.pose;
      }

      // 2. EXPRESSION LOGIC
      let finalExpressionTags = director.expression;
      if (!parts.expressionDescription && parts.pose === 'model') {
        // Add model expression flavor if model preset and no custom expression
        const randomExp = MODEL_EXPRESSIONS[Math.floor(Math.random() * MODEL_EXPRESSIONS.length)];
        finalExpressionTags = `${finalExpressionTags}, ${randomExp}`;
      }

      const finalPoseAndExp = `${finalPoseTags}, ${finalExpressionTags}`;

      // 3. FRAMING OVERRIDE
      let finalFraming = director.framing;
      if (parts.framingDescription) {
        // Implicitly trusted via Stage 2 generation, but we can verify
      } else if (parts.framing && FRAMING_GUIDES[parts.framing]) {
        finalFraming = FRAMING_GUIDES[parts.framing];
      } else if (!finalFraming) {
        finalFraming = FRAMING_GUIDES.model;
      }

      // 4. SCENE OVERRIDE
      let finalScene = '';
      if (parts.useWhiteBackground) {
        finalScene = WHITE_BACKGROUND_PROMPT;
      } else {
        if (parts.enableLighting) {
          finalScene = director.scene;
        } else {
          finalScene = director.scene
            .replace(/(studio lighting|cinematic lighting|volumetric lighting|dramatic shadows|rim lighting|depth of field|bokeh|soft lighting|hard lighting)/gi, '')
            .replace(/,\s*,/g, ',')
            .trim();
        }
      }

      const promptParts = [baseCostume.tags, finalPoseAndExp, finalFraming, finalScene].filter(p => p && p.length > 0);
      const fullPrompt = promptParts.join(', ');

      return {
        id: Math.random().toString(36).substring(2, 9),
        description: baseCostume.name || baseCostume.desc,
        prompt: fullPrompt,
        costume: baseCostume.tags,
        composition: finalPoseAndExp,
        framing: finalFraming,
        scene: finalScene,
        sexyLevel: parts.sexyLevel,
        accessoryLevel: parts.accessoryLevel,
        originalConcept: parts.concept,
        originalTheme: parts.theme
      };
    }).filter(v => v.costume);

  } catch (err) {
    console.error("Gemini Multi-Step Error:", err);
    throw err;
  }
};

export const generateSexyRangePrompts = async (
  apiKey: string,
  category: string,
  parts: Record<string, string>,
  referencePrompt?: string,
  language: 'ja' | 'en' = 'ja'
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
    Generate 10 prompts for the same concept with INCREASING Sexy Level (1 to 10).
    ${referencePrompt ? `Base: ${referencePrompt}` : `Concept: ${parts.base} | Style: ${category}`}
    
    Format: Level [N]: [[DESC]] ${language === 'en' ? 'English' : 'Japanese'} [[PROMPT]] English
    Separate with [[SPLIT]]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text.split('[[SPLIT]]').map((v: any) => {
      const levelMatch = v.match(/Level\s*\d+:/i);
      const cleanV = v.replace(levelMatch ? levelMatch[0] : '', '').trim();
      const p = cleanV.split('[[PROMPT]]');
      const desc = p[0]?.replace('[[DESC]]', '').trim() || '';
      const promptText = p[1]?.trim() || '';
      return { description: desc, prompt: promptText };
    }).filter((v: any) => v.prompt.length > 0);
  } catch (err) {
    console.error("Sexy Range Error:", err);
    throw err;
  }
};
export const visualizeCostume = async (
  apiKey: string,
  prompt: string
): Promise<string> => {
  const cleanApiKey = apiKey.trim();
  const genAI = new GoogleGenerativeAI(cleanApiKey);

  // We use Gemini 3.0 refined prompt logic
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const refinementPrompt = `
    Analyze this costume prompt and convert it into a HIGHLY DETAILED, professional artistic masterpiece prompt for an AI image generator.
    Focus on fabric textures, materials (latex, silk, metal, lace), lighting (volumetric, rim light), and a professional atelier background.
    Ensure the subject identity is preserved.
    
    ORIGINAL: ${prompt}
    
    OUTPUT: A single dense string of English tags and descriptive phrases (max 200 words). Do not include any other text.
  `;

  try {
    const res = await model.generateContent(refinementPrompt);
    const refinedPrompt = res.response.text().trim();

    // Use a high-quality visualization engine for the browser demo
    // In a full production app, this would call the Imagen 3 API via Vertex
    // For this atelier experience, we use a fast and reliable endpoint.
    const encodedPrompt = encodeURIComponent(refinedPrompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}&width=1024&height=1024&model=flux`;

    return imageUrl;
  } catch (err) {
    console.error("Visualization Error:", err);
    throw err;
  }
};
