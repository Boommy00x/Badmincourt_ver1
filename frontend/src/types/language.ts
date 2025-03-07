export type LanguageCode = 'en' | 'th' | 'zh';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}