import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { DesignParts } from '../types';
import { ALL_BACKGROUNDS } from '../data/backgrounds';


/**
 * Clean up the prompt string to ensure proper comma spacing and no illegal characters.
 */
const sanitizePrompt = (text: string): string => {
  if (!text) return '';

  return text
    // Replace remaining camera-related slang with standard terms
    .replace(/\bwalking away (from )?camera\b/gi, 'walking away, from behind')
    .replace(/\b(looking|turning) away (from )?camera\b/gi, '$1 away, looking back')
    .replace(/\btowards? camera\b/gi, 'towards viewer')
    .replace(/\b(at|to) camera\b/gi, 'at viewer')
    .replace(/\btilted camera\b/gi, 'tilted angle')
    .replace(/\b(camera|dslr|lens|tripod|shot)\b/gi, '')
    .replace(/\b(photo|photography)?\s*studio\b/gi, '')
    .replace(/\b(lighting|studio)\s*equipment\b/gi, '')
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

const accessoryLevelDescription = (level: number) => {
  if (level <= 1) return "LEVEL 1: ABSOLUTELY NONE. No jewelry, no hats, no glasses, no ribbons. Pure and simple outfit only.";
  if (level <= 3) return "LEVEL 2-3: MINIMAL. Maybe small earrings or a simple wristband. Very discreet.";
  if (level <= 6) return "LEVEL 4-6: MODERATE. Necklace, bracelets, hair accessories, belts. Typical fashion accessories.";
  if (level <= 9) return "LEVEL 7-9: HEAVY. Ornate jewelry, multiple piercings, layered accessories, gloves, stockings, detailed ornaments.";
  return "LEVEL 10: OVER-THE-TOP. Excessive decorations, body chains, glowing ornaments, elaborate headpieces, fantasy-style complex accessories.";
};

const sexyLevelDescription = (level: number) => {
  if (level <= 2) return "PHASE 1: STRICTLY MODEST (Safe/High-Neck). Long skirts, full coverage, long sleeves, high necklines. No skin exposure except face/hands. (Keywords: 'modest, high-neck, turtle-neck, floor-length skirt')";
  if (level <= 4) return "PHASE 2: STANDARD (Daily/Professional). Standard fashion, knee-length skirts, normal necklines. Balanced and polite. (Keywords: 'standard fit, everyday fashion, knee-length')";
  if (level <= 6) return "PHASE 3: SUGGESTIVE (Fashionable/Flirty). Bare shoulders, mini-skirt, short shorts, slightly deep neckline. (Keywords: 'off-shoulder, sleeveless, mini-skirt, short shorts, cleavage')";
  if (level <= 8) return "PHASE 4: BOLD & RISQUÉ (Lingerie Style). High-cut legs, deep plunging neckline, peek-a-boo cutouts, open back, sheer parts. (Keywords: 'bold cutouts, high-cut, very short, see-through accents, plunging neckline')";
  return "PHASE 5: EXTREME/MICRO (Destruction & Reconstruction). Almost naked, nearly bare skin focus. Outfit is torn or micro-sized. Nipples MUST be covered by pasties, band-aids, or creative elements. (Keywords: 'micro-bikini, pasties, heart-shaped pasties, star-shaped nipple covers, metallic covers, body piercings, band-aids as nipple covers, cross-shaped bandages, extreme high-cut, torn clothes, string-only, barely covering'). MAINTAIN ZERO NUDITY but maximize intensity and VARIETY of covers.";
};

const r18LevelDescription = (level: number) => {
  if (level <= 3) return "R18 PHASE 1: SEE-THROUGH & TEASING. The outfit becomes transparent or translucent. Sheer fabrics, wet clothes, silhouette visibility. No full nudity yet, but heavy suggestion. (Keywords: 'see-through clothes, translucent fabric, sheer lingerie, wet clothes, clinging fabric, no bra, visible shape, nipple bumps, cameltoe, heavy teasing')";
  if (level <= 6) return "R18 PHASE 2: EXPOSURE & NIPPLES. Breasts are exposed. Topless, open shirt, lifted top, or transparent nipple visibility. (Keywords: 'exposed nipples, topless, nipples out, open clothes, lifting shirt, nipple slip, areola exposure, breast grab, cleavage, undressing')";
  if (level <= 9) return "R18 PHASE 3: FULL NUDITY & INTENSITY. Completely naked or crotchless. Explicit anatomical details, spread legs, intense arousal. (Keywords: 'fully naked, nude, pussy exposure, crotchless, uncensored, spreading, detailed anatomy, fluids, wetness, intense desire, erotic pose')";
  return "R18 PHASE 4: DESTRUCTION & ACCESSORIES. Almost nude, but with torn remnants of the outfit or heavy accessories remaining. Messy, erotic, and chaotic. (Keywords: 'torn clothes, shredded fabric, only accessories, naked but wearing jewelry, body chains, cum, messy fluids, sweat, destruction, erotic mess, remnants of clothing').";
};

export const generateCostumePrompts = async (
  apiKey: string,
  parts: DesignParts,
  count: number = 1,
  language: 'ja' | 'en' = 'ja',
  signal?: AbortSignal
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
    random: "creative, experimental, unpredictable",
    anime: "FAITHFUL REPRODUCTION: Priority on iconic character elements, original costume details, recognizable anime aesthetic"
  };

  const currentThemeAdj = themeAdjectives[parts.theme] || "";
  let sanitizedBaseDesign = parts.remixBaseDesign || "";
  if (parts.remixBaseDesign && parts.sexyLevel <= 7) {
    const extremeTags = ["pasties", "nipple covers", "nipple tape", "heart-shaped pasties", "star-shaped pasties", "nipple stickers", "metallic covers", "micro bikini", "micro skirt", "extreme high-cut", "ultra high-cut", "barely covering", "torn clothes", "string-only", "micro-sized", "see-through", "transparent", "translucent"];
    const pattern = new RegExp(`\\b(${extremeTags.join("|")})\\b`, "gi");
    sanitizedBaseDesign = parts.remixBaseDesign.split(',').map(tag => tag.trim()).filter(tag => !tag.match(pattern)).join(', ');
  }

  const nameDescLanguage = language === 'ja' ? 'Japanese' : 'English';
  const nameExample = language === 'ja'
    ? (parts.isCharacterMode ? '"ラム / うる星やつら"' : '"ゴシックメイド服", "サイバー忍者", "夏のワンピース"')
    : (parts.isCharacterMode ? '"Lum / Urusei Yatsura"' : '"Gothic Maid Outfit", "Cyber Ninja", "Summer Dress"');
  const descExample = language === 'ja'
    ? '"黒いゴシックドレスに白いエプロン", "未来的な忍者装束"'
    : '"Black gothic dress with white apron", "Futuristic ninja outfit"';

  const architectPrompt = `
      [STAGE 1: THE ARCHITECT]
      Task: Simultaneously design ${count} unique outfits and their cinematic settings.
      **LANGUAGE RULE**: All tags in [[COSTUME]], [[POSE]], and [[SCENE]] MUST be in English.
      If the user provides instructions in Japanese (e.g., "海", "笑顔"), translate them into high-quality, descriptive English image generation tags.
  
      [USER REQUIREMENTS]
      - Primary Subject/Concept: ${parts.concept || 'None'}
      - Theme: ${parts.theme.toUpperCase()} (${currentThemeAdj})
      ${sanitizedBaseDesign ? `- MANDATORY BASE DESIGN: "${sanitizedBaseDesign}"` : ''}
      - Sexy Level: ${parts.sexyLevel}/10 (${parts.isR18Mode ? 'R18 Mode Active' : 'Standard Mode'})
      - Accessory Intensity: ${parts.accessoryLevel}/10
      - Enable Lighting/Atmosphere: ${parts.enableLighting ? 'YES' : 'NO'}
      
      [NSFW/STYLE RULES]
      ${parts.isR18Mode ? r18LevelDescription(parts.sexyLevel) : sexyLevelDescription(parts.sexyLevel)}
      
      [ACCESSORY RULES]
      ${accessoryLevelDescription(parts.accessoryLevel)}
      
      [CINEMATIC DIRECTION]
      - ${parts.shotAngleId && parts.shotAngleId !== 'random' ? `FIXED VIEWPOINT: "${getFixedViewpoint(parts.shotAngleId)}"` : `Shot: ${parts.shotType || 'Varies'}`}
      - POSE/GESTURE REQUEST: ${parts.poseDescription || parts.poseStance}
      - EXPRESSION REQUEST: ${parts.expressionDescription || parts.expression}
      - SCENE/ENVIRONMENT REQUEST: ${parts.sceneDescription || (parts.selectedSceneId && parts.selectedSceneId !== 'random' ? ALL_BACKGROUNDS.find(b => b.id === parts.selectedSceneId)?.prompt : 'As requested or diverse')}
      
      [DIVERSITY RULE]
      If POSE, EXPRESSION, or SCENE contain multiple options separated by "|", you MUST select a DIFFERENT option for each generated item to maximize variety.
      Do not repeat the same pose or expression if multiple options are provided.
      
      *CRITICAL*: DO NOT output "camera" or "shot". Output only comma-separated tags.
      If the user says "海" for scene, output descriptive sea tags like "on beach, turquoise ocean, white sand, summer" in the [[SCENE]] block.
  
      ${parts.isCharacterMode ? `[CHARACTER FIDELITY PROTOCOL]
      The user is requesting a SPECIFIC CHARACTER. Accuracy is the HIGHEST priority.
      - RECALL: Recall the OFFICIAL design of the character (e.g., Hatsune Miku = turquoise hair/eyes).
      - PERSISTENCE: Hair color, hair style, eye color, and unique physical features MUST remain 100% faithful to the source material.
      - NO ALTERATIONS: NEVER change the character's signature traits (like changing turquoise hair to pink) unless explicitly instructed in the Concept.
      - CHARACTER BLOCK: Place all physical traits (hair/eyes/skin/features) in the [[CHARACTER]] block.
      - COSTUME BLOCK: Place ONLY the clothing and accessories in the [[COSTUME]] block.
      - DESIGN PRIORITY: If a MANDATORY BASE DESIGN is provided, treat it as the absolute truth for the character's appearance.` : ''}

      ${sanitizedBaseDesign ? `[STRICT REMIX FIDELITY RULE]
      You are performing a DERIVATION (Remix).
      The user wants to keep the OUTFIT identity 100% consistent while changing POSE or SCENE.
      MANDATORY: You MUST keep the EXACT colors, materials, and core design of the "MANDATORY BASE DESIGN".
      DO NOT change "blue" to "red", do not change "silk" to "latex", and do not add/remove major items.
      If the Sexy Level increases, you may make the existing outfit more revealing (shorter, tighter, etc.), but the COLOR and DESIGN THEME must remain the same.` : ''}

      [OUTPUT FORMAT]
      Provide ${count} items separated by "[[SPLIT]]". 
      Format:
      [[NAME]] ${parts.isCharacterMode ? `Character Name / Anime Title in ${nameDescLanguage} (MANDATORY: must include original work name, e.g. ${nameExample})` : `Costume Title in ${nameDescLanguage} (e.g. ${nameExample})`}
      [[DESC]] Short summary of the look in ${nameDescLanguage} (e.g. ${descExample})
      ${parts.isCharacterMode ? '[[CHARACTER]] Character name, series name, hair color/style, eye color, and physical features (English tags only)' : ''}
      [[COSTUME]] English tags (clothings ${parts.isCharacterMode ? 'and accessories' : ''} only)
      [[POSE]] English pose/expression tags
      [[FRAMING]] English shot type/angle tags
      [[SCENE]] English background/lighting tags
      [[SPLIT]]
    `;

  try {
    const res = await model.generateContent(architectPrompt, { signal });
    const text = res.response.text();

    return text.split('[[SPLIT]]').map((v) => {
      const costume = (v.match(/\[\[COSTUME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim().replace(/(background|room|sky|ocean|beach|city|street|view|scenery|landscape|indoor|outdoor|lighting|shadow|cinematic|bokeh|depth of field)/gi, '').replace(/,\s*,/g, ',').trim();
      const character = (v.match(/\[\[CHARACTER\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const pose = (v.match(/\[\[POSE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const framing = (v.match(/\[\[FRAMING\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const scene = (v.match(/\[\[SCENE\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const name = (v.match(/\[\[NAME\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();
      const desc = (v.match(/\[\[DESC\]\]\s*(.*?)(?=\[\[|$)/s)?.[1] || '').trim();

      // --- ENFORCE MANDATORY TAGS (ABSOLUTE PRIORITY) ---
      const forcedType = parts.shotTypeId && parts.shotTypeId !== 'random' ? SHOT_TYPE_MAP[parts.shotTypeId] : '';
      const forcedAngle = parts.shotAngleId && parts.shotAngleId !== 'random' ? SHOT_ANGLE_MAP[parts.shotAngleId] : '';

      const filterLighting = (t: string) => parts.enableLighting ? t : t.replace(/\b(lighting|shadow|cinematic|atmosphere|bloom|glare|rays|soft light|hard light|realistic lighting|dramatic lighting|vibrant|moody|volumetric|ambient|realistic)\b/gi, '').trim();

      const finalPose = filterLighting(pose);
      const finalFraming = [forcedType, forcedAngle].filter(Boolean).length > 0
        ? [forcedType, forcedAngle].filter(Boolean).join(', ')
        : framing;
      const finalScene = sanitizePrompt(filterLighting(scene));

      // Reconstruct prompt in strict order
      const promptParts = [];
      if (finalFraming) promptParts.push(finalFraming);
      if (character) promptParts.push(character); // Character info first in character mode
      if (costume) promptParts.push(costume);
      if (finalPose) promptParts.push(finalPose);
      if (finalScene) promptParts.push(finalScene);

      return {
        id: Math.random().toString(36).substring(2, 9),
        description: name || desc,
        costume,
        character,
        composition: finalPose,
        framing: finalFraming,
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
        originalSceneId: parts.selectedSceneId,
        originalSceneDescription: parts.sceneDescription,
        isCharacterMode: parts.isCharacterMode,
        characterName: parts.characterName,
        characterCostume: parts.characterCostume,
        prompt: sanitizePrompt(promptParts.join(', '))
      };
    }).filter(r => r.costume);
  } catch (err) {
    console.error("Gemini Multi-Step Error:", err);
    throw err;
  }
};

export const generateSexyRangePrompts = async (apiKey: string, parts: DesignParts, referencePrompt?: string, _language: 'ja' | 'en' = 'ja', signal?: AbortSignal) => {
  const cleanApiKey = apiKey.trim();
  const genAI = new GoogleGenerativeAI(cleanApiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings: [{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE }, { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }],
  });

  const prompt = `
    [STAGE 1: THE EVOLUTION]
    Generate 10 prompts for increasing Sexy Level (1 to 10). 
    **LANGUAGE RULE**: All output tags MUST be in English. Translate any Japanese concepts or instructions into high-quality English tags.
    
    Reference: ${referencePrompt ? `Base: ${referencePrompt}` : `Concept: ${parts.concept} | Theme: ${parts.theme} | Pose: ${parts.poseStance}`}
    
    [ACCESSORY RULE]
    Accessory Level: ${parts.accessoryLevel}/10. ${accessoryLevelDescription(parts.accessoryLevel)}
    
    [DIVERSITY RULE]
    If 'Reference' contains multiple options (separated by |) for Pose or Expression, you MUST pick a different valid option for each level to create variety.
    
    Format per level:
    Level [N]: [[DESC]] English Summary [[PROMPT]] English tags
    [[SPLIT]]
  `;

  try {
    const result = await model.generateContent(prompt, { signal });
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
