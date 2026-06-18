export type LanguageCode = 'en' | 'de' | 'fr' | 'ar' | 'fa' | 'ps';

export interface Language {
    code: LanguageCode;
    name: string;
    flag: string;
    dir: 'ltr' | 'rtl';
}
