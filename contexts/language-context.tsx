'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'en' | 'hi' | 'ta' | 'bn';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>('en');

  // Initialize language from localStorage or default to 'en'
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language || 'en';
    setLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage;
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    
    // Here you would typically implement the logic to reload the page with the new language
    // For now, we'll just log the language change
    console.log(`Language changed to: ${lang}`);
    
    // In a real implementation, you would update the URL or refresh the page with the new language
    // router.push(pathname, { locale: lang });
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
