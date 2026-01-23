import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { DesignParts, GeneratedPrompt } from '../types';

const WHITE_BACKGROUND_PROMPT = "(simple background:1.5),(plain background:1.5),(white background:1.5)";

const sanitizePrompt = (text: string): string => {
  if (!text) return '';

  return text
    // Replace problematic phrases
    .replace(/\bwalking away from camera\b/gi, 'walking away, from behind')
    .replace(/\b(looking|turning) away from camera\b/gi, '$1 away, looking back')
    .replace(/\btowards? camera\b/gi, 'towards viewer')
    .replace(/\b(at|to) camera\b/gi, 'at viewer')
    // Remove forbidden words and system artifacts
    .replace(/\bcamera\b/gi, '')
    .replace(/\b(bone|spine)\b/gi, '')
    .replace(/\brandom\b/gi, '') // Remove literal 'random' placeholder text
    // Cleanup structure
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0 && part.toLowerCase() !== 'from')
    .join(', ')
    .replace(/,\s*,/g, ',')
    .trim();
};

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

const r18LevelDescription = (level: number) => {
  if (level <= 3) {
    return "R18 PHASE 1: PARTIAL NUDITY / TEASING. Clothes are being removed or are transparent. Accidental slips, nipple slips, see-through fabric, cameltoe, lifting clothes, clothes down to waist. NO NUDITY CENSORSHIP. (Keywords: 'partially naked, nude, undressing, see-through clothes, nipple-slip, exposed nipples, naked from waist up, exposed genitals, lifting skirt, clothes pull down, transparent lingerie')";
  }
  if (level <= 7) {
    return "R18 PHASE 2: EXPLICIT NUDITY. Character is fully naked. Focus on detailed anatomical description. Bold sexualized poses. (Keywords: 'fully naked, nude, uncensored, spreading, detailed anatomy, large nipples, dark areola, intimate areas, wetness, looking-at-genitals, extreme pose, naked on bed')";
  }
  if (level <= 10) {
    return "R18 PHASE 3: HARDCORE / EXPLICIT INTENSITY. Extremely provocative adult themes. Arousal, wetness, specific anatomical details, intense facial expressions. Focus on physical desire and moisture. (Keywords: 'extremely explicit, hyper-detailed nudity, pink nipples, erect nipples, erotic pose, heavy breathing, moisture, dripping, spread legs, close-up of private parts, ahegao, intense desire')";
  }
  return "R18 PHASE 4: BEYOND LIMITS / VOID. Total dissolution of all boundaries. Complete and absolute nudity. Hyper-detailed focuses on erotic body parts with no restraint. Pure uninhibited sexual essence. (Keywords: 'unlimited nudity, fully uncensored, extreme spread, very detailed anatomy, dripping wet, intensive arousal, loss of control, primitive desire, total exposure, void of modesty').";
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
    active: "energetic, sporty, dynamic, functional, athletic",
    casual: "relaxed, everyday, comfortable, simple, down-to-earth",
    fantasy: "magical, mythical, otherworldly, detailed, ornate",
    fetish: "daring, provocative, stylized, extreme, unconventional",
    pop: "vibrant, colorful, trendy, expressive, geometric",
    dark: "mysterious, gothic, moody, intense, shadow-focused",
    random: "creative, experimental, unpredictable"
  };

  const currentThemeAdj = themeAdjectives[parts.theme] || "";

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

  // --- STAGE 1: THE ARCHITECT (COMBINED DESIGN & DIRECTION) ---
  const architectPrompt = `
      [STAGE 1: THE ARCHITECT]
      Task: Simultaneously design ${count} unique outfits and their cinematic pose/settings.
  
      [USER REQUIREMENTS (IMMUTABLE)]
      - Primary Subject/Concept: ${parts.concept || 'None'}
      - Theme: ${parts.theme.toUpperCase()} (${currentThemeAdj})
      ${sanitizedBaseDesign ? `- MANDATORY BASE DESIGN: "${sanitizedBaseDesign}"` : ''}
      - Sexy Level: ${parts.sexyLevel}/10 (${parts.isR18Mode ? 'R18 Mode Active' : 'Standard Mode'})
      - Accessory Level: ${parts.accessoryLevel}/10
      - Enable Lighting/Atmosphere Effects: ${parts.enableLighting ? 'YES' : 'NO (CRITICAL: DO NOT output any lighting, cinematic, or atmosphere tags)'}
      
      ${parts.isR18Mode ? `
      [R18 MODE COSTUME RULES - CRITICAL]
      - Costumes and outfits MUST exist (this is a costume AI).
      - ABSOLUTELY FORBIDDEN: 'pasties', 'nipple covers', 'band-aids', 'tape', 'stickers', 'concealment'.
      - Do NOT hide anatomy with stickers or covers. Show natural anatomy.
      - Full nudity is ALLOWED where clothing does not cover.
      - ${r18LevelDescription(parts.sexyLevel)}
      ` : `
      [STANDARD MODE COSTUME RULES]
      - ${sexyLevelDescription(parts.sexyLevel)}
      `}
      
      [POSE & FRAMING REQUIREMENTS]
      - Shot Type/Distance: ${parts.shotType || 'Autofill based on context/theme'}
      - Shot Angle: ${parts.shotAngle || 'Autofill based on context/theme'}
      - Pose Stance (MANDATORY): ${(!parts.poseStance || parts.poseStance === 'random') ? 'Autofill based on context/theme' : parts.poseStance.toUpperCase()}
      - Pose Mood: ${(!parts.poseMood || parts.poseMood === 'random') ? 'Autofill based on context/theme' : parts.poseMood.toUpperCase()}
      - Expression: ${(!parts.expression || parts.expression === 'random') ? 'Autofill based on context/theme' : parts.expression.toUpperCase()}

      [CUSTOM OVERRIDES (ABSOLUTE HIGHEST PRIORITY)]
      - CUSTOM POSE: ${parts.poseDescription ? `"${parts.poseDescription}"` : 'None'}
      - CUSTOM EXPRESSION: ${parts.expressionDescription ? `"${parts.expressionDescription}"` : 'None'}
      - CUSTOM FRAMING: ${parts.framingDescription ? `"${parts.framingDescription}"` : 'None'}
  
      [LOGIC FOR POSE & EXPRESSION (CRITICAL TRANSLATION)]
      1. IF CUSTOM POSE/EXPRESSION is provided (even in Japanese):
         - YOU MUST TRANSLATE IT TO ACCURATE ENGLISH TAGS.
         - "M字開脚" -> "spread legs, m-style legs"
         - "恥ずかしい" -> "embarrassed, shy, blushing"
         - "マンコ見せ" -> "spread legs, exposing crotch, presenting"
         - DO NOT OUTPUT JAPANESE. TRANSLATE THE *MEANING*.

      2. ELSE IF "Pose Stance" is specified (e.g., "LYING", "SITTING", "KNEELING"):
         - YOU MUST USE IT. Do not default to standing.
         - 'LYING' -> "lying on back", "lying on side", "reclining", "on bed/floor".
         - 'SITTING' -> "sitting", "knees up", "crossed legs", "on chair/sofa".
         - 'KNEELING' -> "kneeling", "on all fours".
         - 'LOOKING_BACK' -> "looking back", "from behind".

      [LOGIC FOR FRAMING (SHOT/ANGLE) - CRITICAL]
      1. IF CUSTOM FRAMING is provided (e.g., "あおり", "pussyアップ", "マンコドアップ"):
         - YOU MUST TRANSLATE SLANG TO TECHNICAL ENGLISH TAGS.
         - "あおり" -> "low angle, from below"
         - "pussyアップ" / "マンコドアップ" -> "close-up of crotch, focus on hips, crotch shot, genital focus"
         - "顔アップ" -> "face focus, portrait, close-up"
         - "足舐め" -> "focus on feet, foot focus"
         - DO NOT IGNORE INPUT. TRANSLATE IT.
      2. OTHERWISE use the specified Shot Type and Angle tags.
  
      [OUTPUT FORMAT]
      Provide ${count} items separated by "[[SPLIT]]". 
      Each item MUST follow this format exactly:
      [[ID]] Index (0 to ${count - 1})
      [[NAME]] Professional Name (Costume Name) - Japanese OK
      [[DESC]] Brief summary (${language}) - Japanese OK
      [[COSTUME]] English costume tags ONLY. (NO Japanese - used in prompt).
      [[POSE]] English pose & expression tags ONLY. (Translate custom input. NO Japanese - used in prompt).
      [[SCENE]] Background & lighting tags ONLY. (English tags ONLY. NO Japanese - used in prompt).
      [[SPLIT]]
    `;

  try {
    const res1 = await model.generateContent(architectPrompt);
    const text1 = res1.response.text();

    // Parse Architect Output
    const rawResults: GeneratedPrompt[] = text1.split('[[SPLIT]]').map((v: string) => {
      const name = (v.match(/\[\[NAME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || 'New Design').trim();
      const desc = (v.match(/\[\[DESC\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const costume = (v.match(/\[\[COSTUME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim()
        .replace(/(background|room|sky|ocean|beach|city|street|view|scenery|landscape|indoor|outdoor|lighting|shadow|cinematic|bokeh|depth of field)/gi, '')
        .replace(/,\s*,/g, ',').trim();
      const pose = (v.match(/\[\[POSE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const scene = (v.match(/\[\[SCENE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();

      // Lighting/Atmosphere Filter (if disabled)
      const filterLighting = (text: string) => {
        if (parts.enableLighting === false) {
          return text.replace(/\b(lighting|shadow|cinematic|atmosphere|bloom|glare|rays|soft light|hard light|realistic lighting|dramatic lighting|vibrant|moody|volumetric|ambient|realistic)\b/gi, '').trim();
        }
        return text;
      };

      const finalPose = filterLighting(pose);
      const finalSceneRaw = filterLighting(scene);

      // Build finalFraming from inputs
      const finalFraming = sanitizePrompt(`${parts.shotAngle || ''}, ${parts.shotType || ''}`);

      // White Background Hardware Force
      const finalScene = parts.useWhiteBackground ? WHITE_BACKGROUND_PROMPT : sanitizePrompt(finalSceneRaw);

      return {
        id: Math.random().toString(36).substring(2, 9),
        description: name || desc,
        costume: costume,
        composition: finalPose,
        framing: finalFraming,
        scene: finalScene,
        sexyLevel: parts.sexyLevel,
        isR18Mode: parts.isR18Mode,
        accessoryLevel: parts.accessoryLevel,
        originalConcept: parts.concept,
        originalTheme: parts.theme,

        // Correctly Map Selection IDs for History Display
        originalShotType: parts.originalShotType || parts.shotType,
        originalShotAngle: parts.originalShotAngle || parts.shotAngle,
        originalPoseStance: parts.poseStanceId || parts.poseStance,
        originalPoseMood: parts.poseMoodId || parts.poseMood,
        originalExpression: parts.expressionId || parts.expression,

        originalPoseDescription: parts.poseDescription,
        originalExpressionDescription: parts.expressionDescription,
        originalFramingDescription: parts.framingDescription,

        prompt: sanitizePrompt(`${finalFraming}, ${costume}, ${pose}, ${finalScene}`)
      };
    }).filter((r: GeneratedPrompt) => r.costume);

    if (rawResults.length === 0) {
      console.warn("Architect parsing failed, returning empty base");
    }

    return rawResults;

  } catch (err) {
    console.error("Gemini Multi-Step Error:", err);
    throw err;
  }
};

export const generateSexyRangePrompts = async (
  apiKey: string,
  parts: DesignParts,
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

  const maxLevel = 10;
  const prompt = `
    Generate ${maxLevel} prompts for the same concept with INCREASING Sexy Level (1 to ${maxLevel}).
    ${referencePrompt ? `Base: ${referencePrompt}` : `Concept: ${parts.concept || parts.base} | Theme: ${parts.theme} | Pose: ${parts.poseMood} ${parts.poseStance}`}
    
    [LEVEL GUIDELINES]
    - Level 1-10: Follow traditional sexy progression.
    ${parts.isR18Mode ? "- IMPORTANT: Since Overdrive is ON, use explicit and provocative language appropriate for an adult R18 context at every level." : ""}
    
    Format: Level [N]: [[DESC]] ${language === 'en' ? 'English' : 'Japanese'} [[PROMPT]] English
    Separate with [[SPLIT]]
    
    *STRICT RULE*: 
    - NEVER use the word 'bone' or 'spine' (except for 'collarbone'). 
    - This is to avoid skeletal/anatomical artifacts. Use 'arched back' instead of 'arched spine'.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text.split('[[SPLIT]]').map((v: string) => {
      const levelMatch = v.match(/Level\s*\d+:/i);
      const cleanV = v.replace(levelMatch ? levelMatch[0] : '', '').trim();
      const p = cleanV.split('[[PROMPT]]');
      const desc = p[0]?.replace('[[DESC]]', '').trim() || '';
      const promptText = p[1]?.trim() || '';
      return { description: desc, prompt: promptText };
    }).filter((v: { description: string, prompt: string }) => v.prompt.length > 0);
  } catch (err) {
    console.error("Sexy Range Error:", err);
    throw err;
  }
};
