'use client'

import { useEffect } from 'react';

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (config: any, elementId: string): any;
          InlineLayout: {
            SIMPLE: any;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// Helper function to check if we're in the browser
const isBrowser = typeof window !== 'undefined';

export const LanguageSwitcher = (): JSX.Element => {
  useEffect(() => {
    // Only run on the client side
    if (!isBrowser) return;

    // Check if Google Translate element already exists
    const existingTranslateElement = document.getElementById('google_translate_element');
    if (existingTranslateElement && existingTranslateElement.children.length > 0) {
      return; // Already initialized, skip reinitialization
    }

    // Function to initialize the Google Translate element
    const initGoogleTranslate = () => {
      // Clear any existing Google Translate elements first
      const existingElements = document.querySelectorAll('.goog-te-gadget, .goog-te-gadget-simple');
      existingElements.forEach(el => el.remove());

      if (window.google?.translate) {
        // Remove any existing Google Translate elements
        const existingFrames = document.querySelectorAll('.goog-te-banner-frame, .goog-te-balloon-frame');
        existingFrames.forEach(frame => frame.remove());

        // Initialize new Google Translate element
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );

        // Add styles for the Google Translate element if not already added
        if (!document.getElementById('google-translate-styles')) {
          const style = document.createElement('style');
          style.id = 'google-translate-styles';
          style.textContent = `
            .goog-te-gadget {
              color: transparent !important;
              font-size: 0 !important;
            }
            .goog-te-gadget-simple {
              background: transparent !important;
              border: none !important;
              padding: 0 !important;
            }
            .goog-te-menu-value {
              display: flex !important;
              align-items: center;
              justify-content: center;
            }
            .goog-te-menu-value span {
              display: none !important;
            }
            .goog-te-menu-value::before {
              content: '🌐';
              font-size: 16px;
              display: block !important;
            }
            .goog-te-banner-frame, .goog-te-balloon-frame {
              display: none !important;
            }
            body {
              top: 0 !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
    };

    // Check if Google Translate is already loaded
    if (window.google?.translate) {
      initGoogleTranslate();
    } else if (isBrowser) {
      // Remove any existing script
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Add the Google Translate script
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      // Set up the initialization function
      window.googleTranslateElementInit = initGoogleTranslate;
      
      // Add error handling
      script.onerror = () => {
        console.error('Failed to load Google Translate');
      };

      document.body.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (!isBrowser) return;
      
      const script = document.getElementById('google-translate-script');
      if (script) {
        script.remove();
      }
      
      // Clean up Google Translate elements
      const googleElements1 = document.querySelectorAll('.goog-te-banner, .goog-te-menu, .goog-te-gadget, .goog-te-gadget-simple, .goog-te-combo, .goog-te-ftab');
      const googleElements2 = document.querySelectorAll('#google_translate_element > *');
      
      googleElements1.forEach(el => el.remove());
      googleElements2.forEach(el => el.remove());
      
      // Remove the container's children
      const container = document.getElementById('google_translate_element');
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  return (
    <div className="inline-block">
      <div id="google_translate_element"></div>
    </div>
  );
};
