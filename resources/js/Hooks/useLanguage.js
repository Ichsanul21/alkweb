import { useState, useEffect, useCallback } from 'react';

export default function useLanguage() {
    // Try to get from localStorage or fallback to document lang or 'en'
    const [lang, setLangState] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lang') || document.documentElement.lang || 'en';
        }
        return 'en';
    });

    useEffect(() => {
        const handleLangChange = (e) => {
            setLangState(e.detail);
        };
        window.addEventListener('lang-change', handleLangChange);
        
        // Setup initial html lang
        document.documentElement.lang = lang;

        return () => window.removeEventListener('lang-change', handleLangChange);
    }, [lang]);

    const setLang = useCallback((newLang) => {
        localStorage.setItem('lang', newLang);
        document.documentElement.lang = newLang;
        window.dispatchEvent(new CustomEvent('lang-change', { detail: newLang }));
    }, []);

    const toggleLang = useCallback(() => {
        setLang(lang === 'en' ? 'id' : 'en');
    }, [lang, setLang]);

    return { lang, toggleLang, setLang };
}
