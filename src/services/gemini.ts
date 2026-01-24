import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { DesignParts, GeneratedPrompt } from '../types';

const WHITE_BACKGROUND_PROMPT = "(simple background:1.5),(plain background:1.5),(white background:1.5)";

const sanitizePrompt = (text: string): string => {
  if (!text) return '';

  return text
    // Replace remaining camera-related slang with standard terms
    .replace(/\bwalking away from camera\b/gi, 'walking away, from behind')
    .replace(/\b(looking|turning) away from camera\b/gi, '$1 away, looking back')
    .replace(/\btowards? camera\b/gi, 'towards viewer')
    .replace(/\b(at|to) camera\b/gi, 'at viewer')
    // Remove individual forbidden words
    .replace(/\bcamera\b/gi, '')
    .replace(/\b(bone|spine)\b/gi, '')
    .replace(/\brandom\b/gi, '')
    // Cleanup structure
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0 && part.toLowerCase() !== 'from')
    .join(', ')
    .replace(/,\s*,/g, ',')
    .trim();
};

const getFixedViewpoint = (angleId: string): string => {
  const mapping: Record<string, string> = {
    'front': 'from front',
    'side': 'from side',
    'back': 'from behind',
    'above': 'from above',
    'below': 'from below',
    'dynamic': 'dynamic angle'
  };
  return mapping[angleId] || 'from front';
};

const getFixedShotType = (typeId: string): string => {
  const mapping: Record<string, string> = {
    'full_body': 'full body',
    'cowboy_shot': 'cowboy shot',
    'upper_body': 'upper body',
    'portrait': 'portrait',
    'close_up': 'close-up'
  };
  return mapping[typeId] || 'full body';
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
      Task: Simultaneously design ${count} unique outfits and their cinematic cinematic settings.
  
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
      
      [CINEMATIC DIRECTION & DIVERSITY RULES (CRITICAL)]
      1. You are producing ${count} DISTINCT concepts. 
      2. For each concept, you MUST use a different pose and expression.
      3. ${parts.shotAngleId ? `FIXED VIEWPOINT (MANDATORY): You MUST use exact string "${getFixedViewpoint(parts.shotAngleId)}" for [[FRAMING]].` : `FRAMING REQUIREMENT: ${parts.framingDescription ? `User request is "${parts.framingDescription}".` : `Shot: ${parts.shotType || 'Varies'}, Angle: ${parts.shotAngle || 'Varies'}`}`}
      4. POSE REQUIREMENT: ${parts.poseDescription ? `User request is "${parts.poseDescription}". Generate ${count} DIFFERENT artistic interpretations.` : `Pool: ${parts.poseStance}`}
      *MANDATORY POSE VARIETAL*: Even if the same stance is requested, you MUST vary the body weight distribution (contrapposto, leaning), arm positions (hands on hips, in pockets, raised, behind head), and head tilt. Provide specific, professional descriptions.
      5. EXPRESSION REQUIREMENT: ${parts.expressionDescription ? `User request is "${parts.expressionDescription}". Generate ${count} DIFFERENT expressions.` : `Pool: ${parts.expression}`}
      *MANDATORY EXPRESSION VARIETAL*: Vary eye contact, mouth state (parted lips, slight smile, neutral), and emotional intensity.
      *CRITICAL*: Never use any word like "camera" or "shot" in tags. Stick to technical composition terms. Use exactly the fixed viewpoint string if provided.

      [LOGIC FOR TRANSLATION]
      - Translate all Japanese user input into technical English tags.
      - Do NOT output Japanese in tags.

      [OUTPUT FORMAT]
      Provide ${count} items separated by "[[SPLIT]]". 
      Each item MUST follow this format exactly:
      [[ID]] Index (0 to ${count - 1})
      [[NAME]] Professional Name (Costume Name) - Japanese OK
      [[DESC]] Brief summary (${language}) - Japanese OK
      [[COSTUME]] English costume tags ONLY.
      [[POSE]] English pose & expression tags ONLY.
      [[FRAMING]] English viewpoint tags ONLY (MUST use fixed strings if provided).
      [[SCENE]] Background & lighting tags ONLY.
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

      // --- BROADCAST FORCE FRAMING (Absolute Override) ---
      const fixedShotMap: Record<string, string> = {
        'full_body': 'full body',
        'cowboy_shot': 'cowboy shot',
        'upper_body': 'upper body',
        'portrait': 'portrait',
        'close_up': 'close-up'
      };

      const fixedAngleMap: Record<string, string> = {
        'front': 'from front',
        'side': 'from side',
        'back': 'from behind',
        'above': 'from above',
        'below': 'from below',
        'dynamic': 'dynamic angle'
      };

      const forcedType = parts.shotTypeId ? fixedShotMap[parts.shotTypeId] : '';
      const forcedAngle = parts.shotAngleId ? fixedAngleMap[parts.shotAngleId] : '';
      const forcedFraming = [forcedType, forcedAngle].filter(Boolean).join(', ');

      const filterLighting = (text: string) => {
        if (parts.enableLighting === false) {
          return text.replace(/\b(lighting|shadow|cinematic|atmosphere|bloom|glare|rays|soft light|hard light|realistic lighting|dramatic lighting|vibrant|moody|volumetric|ambient|realistic)\b/gi, '').trim();
        }
        return text;
      };

      const finalPose = filterLighting(pose);
      const finalSceneRaw = filterLighting(scene);
      const finalScene = parts.useWhiteBackground ? WHITE_BACKGROUND_PROMPT : sanitizePrompt(finalSceneRaw);

      // ASSEMBLE FINAL PROMPT STRING (CRITICAL ORDER: [FORCED TAGS] -> [COSTUME] -> [POSE] -> [SCENE])
      const finalItems = [];
      if (forcedType) finalItems.push(forcedType);
      if (forcedAngle) finalItems.push(forcedAngle);
      if (costume) finalItems.push(costume);
      if (finalPose) finalItems.push(finalPose);
      if (finalScene) finalItems.push(finalScene);

      return {
        id: Math.random().toString(36).substring(2, 9),
        description: name || desc,
        costume: costume,
        composition: finalPose,
        framing: forcedFraming,
        scene: finalScene,
        sexyLevel: parts.sexyLevel,
        isR18Mode: parts.isR18Mode,
        accessoryLevel: parts.accessoryLevel,
        originalConcept: parts.concept,
        originalTheme: parts.theme,
        originalShotType: parts.shotTypeId,
        originalShotAngle: parts.shotAngleId,
        originalPoseStance: parts.poseStanceId,
        originalExpression: parts.expressionId,
        originalPoseDescription: parts.poseDescription,
        originalExpressionDescription: parts.expressionDescription,
        originalFramingDescription: parts.framingDescription,

        prompt: sanitizePrompt(finalItems.join(', '))
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
    ${referencePrompt ? `Base: ${referencePrompt}` : `Concept: ${parts.concept || parts.base} | Theme: ${parts.theme} | Pose: ${parts.poseStance} | Expression: ${parts.expression}`}
    
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

      // Force framing tags into sexy range too
      const forceType = parts.shotTypeId ? getFixedShotType(parts.shotTypeId) : '';
      const forceAngle = parts.shotAngleId ? getFixedViewpoint(parts.shotAngleId) : '';
      const framingTags = [forceType, forceAngle].filter(Boolean).join(', ');

      const combinedPrompt = framingTags
        ? sanitizePrompt(`${framingTags}, ${promptText}`)
        : promptText;

      return { description: desc, prompt: combinedPrompt };
    }).filter((v: { description: string, prompt: string }) => v.prompt.length > 0);
  } catch (err) {
    console.error("Sexy Range Error:", err);
    throw err;
  }
};
