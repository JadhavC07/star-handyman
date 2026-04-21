// import Anthropic from '@anthropic-ai/sdk';
// import fs from 'fs';
// import path from 'path';

// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// const LOCALES_DIR = path.resolve(__dirname, '../src/features/i18n/locales');

// const LANGUAGE_NAMES: Record<string, string> = {
//   fr: 'French',
//   es: 'Spanish',
//   pt: 'Brazilian Portuguese',
// };

// const NAMESPACES = [
//   'common',
//   'auth',
//   'handyman-auth',
//   'home',
//   'services',
//   'bookings',
//   'chat',
//   'tracking',
//   'search',
//   'professional',
//   'profile',
//   'handyman',
// ];

// async function translateJson(obj: object, targetLanguage: string): Promise<object> {
//   const response = await client.messages.create({
//     model: 'claude-opus-4-5',
//     max_tokens: 4096,
//     messages: [
//       {
//         role: 'user',
//         content: `Translate all string values in this JSON to ${targetLanguage}.
// Rules:
// - Keep ALL keys exactly as-is
// - Keep {{placeholders}} exactly as-is, do not translate them
// - Keep emojis as-is
// - Return ONLY valid JSON with no explanation, no markdown, no backticks

// ${JSON.stringify(obj, null, 2)}`,
//       },
//     ],
//   });

//   const text = (response.content[0] as { type: string; text: string }).text.trim();
//   return JSON.parse(text);
// }

// async function main() {
//   const args = process.argv.slice(2);
//   const langFlag = args.indexOf('--lang');

//   if (langFlag === -1 || !args[langFlag + 1]) {
//     console.error('Usage: npx ts-node scripts/translate.ts --lang <code>');
//     console.error('Example: npx ts-node scripts/translate.ts --lang fr');
//     process.exit(1);
//   }

//   const langCode = args[langFlag + 1];
//   const langName = LANGUAGE_NAMES[langCode];

//   if (!langName) {
//     console.error(`Unknown language: ${langCode}`);
//     console.error(`Supported: ${Object.keys(LANGUAGE_NAMES).join(', ')}`);
//     process.exit(1);
//   }

//   const outDir = path.join(LOCALES_DIR, langCode);
//   fs.mkdirSync(outDir, { recursive: true });

//   for (const ns of NAMESPACES) {
//     const enPath = path.join(LOCALES_DIR, 'en', `${ns}.json`);
//     if (!fs.existsSync(enPath)) {
//       console.warn(`Skipping ${ns}.json — not found in en/`);
//       continue;
//     }

//     console.log(`Translating ${ns}.json → ${langCode}...`);
//     const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
//     const translated = await translateJson(enJson, langName);

//     fs.writeFileSync(
//       path.join(outDir, `${ns}.json`),
//       JSON.stringify(translated, null, 2),
//       'utf-8'
//     );
//     console.log(`${langCode}/${ns}.json`);
//   }

//   console.log(`\nDone. Now register '${langCode}' in src/lib/i18n.ts`);
// }

// main().catch(console.error);