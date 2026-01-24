import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { DesignParts } from '../types';

const WHITE_BACKGROUND_PROMPT = "(simple background:1.5),(plain background:1.5),(white background:1.5)";

/**
 * Clean up the prompt string to ensure proper comma spacing and no illegal characters.
 */
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

const SHOT_TYPE_MAP: Record<string, string> = {
  'full_body': 'full body',
  'cowboy_shot': 'cowboy shot',
  'upper_body': 'upper body',
  'portrait': 'portrait',
  'close_up': 'close-up'
};

const SHOT_ANGLE_MAP: Record<string, string> = {
  'front': 'from front',
  'side': 'from side',
  'back': 'from behind',
  'above': 'from above',
  'below': 'from below',
  'dynamic': 'dynamic angle'
};

const getFixedViewpoint = (angleId: string): string => SHOT_ANGLE_MAP[angleId] || 'from front';

const sexyLevelDescription = (level: number) => {
  if (level <= 2) return "PHASE 1: STRICTLY MODEST (Safe/High-Neck). Long skirts, full coverage, long sleeves, high necklines. No skin exposure except face/hands. (Keywords: 'modest, high-neck, turtle-neck, floor-length skirt')";
  if (level <= 4) return "PHASE 2: STANDARD (Daily/Professional). Standard fashion, knee-length skirts, normal necklines. Balanced and polite. (Keywords: 'standard fit, everyday fashion, knee-length')";
  if (level <= 6) return "PHASE 3: SUGGESTIVE (Fashionable/Flirty). Bare shoulders, mini-skirt, short shorts, slightly deep neckline. (Keywords: 'off-shoulder, sleeveless, mini-skirt, short shorts, cleavage')";
  if (level <= 8) return "PHASE 4: BOLD & RISQUÉ (Lingerie Style). High-cut legs, deep plunging neckline, peek-a-boo cutouts, open back, sheer parts. (Keywords: 'bold cutouts, high-cut, very short, see-through accents, plunging neckline')";
  return "PHASE 5: EXTREME/MICRO (Destruction & Reconstruction). Almost naked, nearly bare skin focus. Outfit is torn or micro-sized. Nipples MUST be covered by pasties, band-aids, or creative elements. (Keywords: 'micro-bikini, pasties, heart-shaped pasties, star-shaped nipple covers, metallic covers, body piercings, band-aids as nipple covers, cross-shaped bandages, extreme high-cut, torn clothes, string-only, barely covering'). MAINTAIN ZERO NUDITY but maximize intensity and VARIETY of covers.";
};

const r18LevelDescription = (level: number) => {
  if (level <= 3) return "R18 PHASE 1: PARTIAL NUDITY / TEASING. Clothes are being removed or are transparent. Accidental slips, nipple slips, see-through fabric, cameltoe, lifting clothes, clothes down to waist. NO NUDITY CENSORSHIP. (Keywords: 'partially naked, nude, undressing, see-through clothes, nipple-slip, exposed nipples, naked from waist up, exposed genitals, lifting skirt, clothes pull down, transparent lingerie')";
  if (level <= 7) return "R18 PHASE 2: EXPLICIT NUDITY. Character is fully naked. Focus on detailed anatomical description. Bold sexualized poses. (Keywords: 'fully naked, nude, uncensored, spreading, detailed anatomy, large nipples, dark areola, intimate areas, wetness, looking-at-genitals, extreme pose, naked on bed')";
  if (level <= 10) return "R18 PHASE 3: HARDCORE / EXPLICIT INTENSITY. Extremely provocative adult themes. Arousal, wetness, specific anatomical details, intense facial expressions. Focus on physical desire and moisture. (Keywords: 'extremely explicit, hyper-detailed nudity, pink nipples, erect nipples, erotic pose, heavy breathing, moisture, dripping, spread legs, close-up of private parts, ahegao, intense desire')";
  return "R18 PHASE 4: BEYOND LIMITS / VOID. Total dissolution of all boundaries. Complete and absolute nudity. Hyper-detailed focuses on erotic body parts with no restraint. Pure uninhibited sexual essence. (Keywords: 'unlimited nudity, fully uncensored, extreme spread, very detailed anatomy, dripping wet, intensive arousal, loss of control, primitive desire, total exposure, void of modesty').";
};

export const generateCostumePrompts = async (
  apiKey: string,
  parts: DesignParts,
  count: number = 1,
  _language: 'ja' | 'en' = 'ja'
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
  let sanitizedBaseDesign = parts.remixBaseDesign || "";
  if (parts.remixBaseDesign && parts.sexyLevel <= 7) {
    const extremeTags = ["pasties", "nipple covers", "nipple tape", "heart-shaped pasties", "star-shaped pasties", "nipple stickers", "metallic covers", "micro bikini", "micro skirt", "extreme high-cut", "ultra high-cut", "barely covering", "torn clothes", "string-only", "micro-sized", "see-through", "transparent", "translucent"];
    const pattern = new RegExp(`\\b(${extremeTags.join("|")})\\b`, "gi");
    sanitizedBaseDesign = parts.remixBaseDesign.split(',').map(tag => tag.trim()).filter(tag => !tag.match(pattern)).join(', ');
  }

  const architectPrompt = `
      [STAGE 1: THE ARCHITECT]
      Task: Simultaneously design ${count} unique outfits and their cinematic settings.
  
      [USER REQUIREMENTS]
      - Primary Subject/Concept: ${parts.concept || 'None'}
      - Theme: ${parts.theme.toUpperCase()} (${currentThemeAdj})
      ${sanitizedBaseDesign ? `- MANDATORY BASE DESIGN: "${sanitizedBaseDesign}"` : ''}
      - Sexy Level: ${parts.sexyLevel}/10 (${parts.isR18Mode ? 'R18 Mode Active' : 'Standard Mode'})
      - Accessory Level: ${parts.accessoryLevel}/10
      - Enable Lighting/Atmosphere: ${parts.enableLighting ? 'YES' : 'NO'}
      
      ${parts.isR18Mode ? `[R18 RULES] ${r18LevelDescription(parts.sexyLevel)}` : `[STANDARD RULES] ${sexyLevelDescription(parts.sexyLevel)}`}
      
      [CINEMATIC DIRECTION]
      - ${parts.shotAngleId ? `FIXED VIEWPOINT: "${getFixedViewpoint(parts.shotAngleId)}"` : `Shot: ${parts.shotType || 'Varies'}`}
      - POSE: ${parts.poseDescription || parts.poseStance}
      - EXPRESSION: ${parts.expressionDescription || parts.expression}
      *CRITICAL*: DO NOT output "camera" or "shot".

      [OUTPUT FORMAT]
      Provide ${count} items separated by "[[SPLIT]]". 
      Format:
      [[NAME]] Name
      [[DESC]] Summary
      [[COSTUME]] English tags
      [[POSE]] English pose tags
      [[SCENE]] English background tags
      [[SPLIT]]
    `;

  try {
    const res = await model.generateContent(architectPrompt);
    const text = res.response.text();

    return text.split('[[SPLIT]]').map((v) => {
      const costume = (v.match(/\[\[COSTUME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim().replace(/(background|room|sky|ocean|beach|city|street|view|scenery|landscape|indoor|outdoor|lighting|shadow|cinematic|bokeh|depth of field)/gi, '').replace(/,\s*,/g, ',').trim();
      const pose = (v.match(/\[\[POSE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const scene = (v.match(/\[\[SCENE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const name = (v.match(/\[\[NAME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const desc = (v.match(/\[\[DESC\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();

      // --- ENFORCE MANDATORY TAGS (ABSOLUTE PRIORITY) ---
      const forcedType = parts.shotTypeId ? SHOT_TYPE_MAP[parts.shotTypeId] : '';
      const forcedAngle = parts.shotAngleId ? SHOT_ANGLE_MAP[parts.shotAngleId] : '';

      const filterLighting = (t: string) => parts.enableLighting ? t : t.replace(/\b(lighting|shadow|cinematic|atmosphere|bloom|glare|rays|soft light|hard light|realistic lighting|dramatic lighting|vibrant|moody|volumetric|ambient|realistic)\b/gi, '').trim();

      const finalPose = filterLighting(pose);
      const finalScene = parts.useWhiteBackground ? WHITE_BACKGROUND_PROMPT : sanitizePrompt(filterLighting(scene));

      // Reconstruct prompt in strict order
      const promptParts = [];
      if (forcedType) promptParts.push(forcedType);
      if (forcedAngle) promptParts.push(forcedAngle);
      if (costume) promptParts.push(costume);
      if (finalPose) promptParts.push(finalPose);
      if (finalScene) promptParts.push(finalScene);

      return {
        id: Math.random().toString(36).substring(2, 9),
        description: name || desc,
        costume,
        composition: finalPose,
        framing: [forcedType, forcedAngle].filter(Boolean).join(', '),
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
        prompt: sanitizePrompt(promptParts.join(', '))
      };
    }).filter(r => r.costume);
  } catch (err) {
    console.error("Gemini Multi-Step Error:", err);
    throw err;
  }
};

export const generateSexyRangePrompts = async (apiKey: string, parts: DesignParts, referencePrompt?: string, _language: 'ja' | 'en' = 'ja') => {
  const cleanApiKey = apiKey.trim();
  const genAI = new GoogleGenerativeAI(cleanApiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings: [{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }],
  });

  const prompt = `Generate 10 prompts for increasing Sexy Level (1 to 10). ${referencePrompt ? `Base: ${referencePrompt}` : `Concept: ${parts.concept} | Theme: ${parts.theme} | Pose: ${parts.poseStance}`} \n Format: Level [N]: [[DESC]] Text [[PROMPT]] English tags \n [[SPLIT]]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text.split('[[SPLIT]]').map((v) => {
      const p = v.replace(/Level\s*\d+:/i, '').split('[[PROMPT]]');
      const desc = p[0]?.replace('[[DESC]]', '').trim() || '';
      const promptText = p[1]?.trim() || '';
      const forcedType = parts.shotTypeId ? SHOT_TYPE_MAP[parts.shotTypeId] : '';
      const forcedAngle = parts.shotAngleId ? SHOT_ANGLE_MAP[parts.shotAngleId] : '';
      const framingTags = [forcedType, forcedAngle].filter(Boolean).join(', ');
      return { description: desc, prompt: sanitizePrompt(framingTags ? `${framingTags}, ${promptText}` : promptText) };
    }).filter(v => v.prompt.length > 0);
  } catch (err) {
    console.error("Sexy Range Error:", err);
    throw err;
  }
};
