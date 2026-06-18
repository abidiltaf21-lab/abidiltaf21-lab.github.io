import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, LanguageCode } from './languageTypes';
import { LANGUAGES, TRANSLATIONS } from './languageConstants';

// Re-export the hook so consumers can `import { useLanguage } from './context/LanguageContext'`.
// The actual implementation lives in useLanguage.ts; this re-export is here for
// backwards-compatibility with the many components that import it from this file.
export { useLanguage } from './useLanguage';

interface LanguageContextType {
    currentLanguage: LanguageCode;
    setLanguage: (code: LanguageCode) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
    languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export { LanguageContext };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
        const saved = localStorage.getItem('sp_lang');
        return (saved as LanguageCode) || 'en';
    });

    const setLanguage = (code: LanguageCode) => {
        setCurrentLanguage(code);
        localStorage.setItem('sp_lang', code);
    };

    const activeLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
    const dir = activeLang.dir;

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = currentLanguage;
        // Also mirror onto body so any sibling containers inherit
        if (document.body) {
            document.body.dir = dir;
        }
        // Persist a class so CSS can target RTL/LTR reliably
        const cls = dir === 'rtl' ? 'sp-rtl' : 'sp-ltr';
        document.documentElement.classList.remove('sp-rtl', 'sp-ltr');
        document.documentElement.classList.add(cls);
        if (document.body) {
            document.body.classList.remove('sp-rtl', 'sp-ltr');
            document.body.classList.add(cls);
        }
    }, [dir, currentLanguage]);

    const t = (key: string): string => {
        return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['en']?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, dir, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;
