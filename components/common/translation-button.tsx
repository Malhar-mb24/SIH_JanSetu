"use client"

import { useEffect, useRef } from 'react';
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TranslationButton() {
  const translateRef = useRef<HTMLDivElement>(null);
  const isScriptAdded = useRef(false);

  const loadGoogleTranslate = () => {
    if (isScriptAdded.current) {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      select?.click();
      return;
    }

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ta,bn',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
      
      // Trigger the dropdown
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      select?.click();
    };

    document.body.appendChild(script);
    isScriptAdded.current = true;
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) {
        document.body.removeChild(script);
      }
      delete (window as any).googleTranslateElementInit;
    };
  }, []);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/10"
        onClick={loadGoogleTranslate}
        aria-label="Translate"
      >
        <Globe className="h-5 w-5" />
      </Button>
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
}
