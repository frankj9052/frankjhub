export const LANGUAGES = {
  // 官方语言
  ENGLISH: 'english',
  FRENCH: 'french',

  // 常见移民语言
  MANDARIN: 'mandarin',
  CANTONESE: 'cantonese',
  PUNJABI: 'punjabi',
  URDU: 'urdu',
  TAGALOG: 'tagalog',
  SPANISH: 'spanish',
  ARABIC: 'arabic',
  PERSIAN: 'persian',
  RUSSIAN: 'russian',
  KOREAN: 'korean',
  VIETNAMESE: 'vietnamese',
  PORTUGUESE: 'portuguese',
  HINDI: 'hindi',
  ITALIAN: 'italian',
  GREEK: 'greek',
  TAMIL: 'tamil',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
