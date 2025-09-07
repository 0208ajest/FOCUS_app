import { useState } from 'react';
import { Languages, ChevronUp } from 'lucide-react';
import { Language } from './translations';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'ja' as const, name: '日本語', flag: '🇯🇵' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-morphism hover:bg-white/20 text-white rounded-full px-4 py-2 h-auto flex items-center transition-colors duration-200"
        >
          <Languages className="h-4 w-4 mr-2" />
          <span className="mr-1">{currentLanguage?.flag}</span>
          <span className="text-sm">{currentLanguage?.code.toUpperCase()}</span>
          <ChevronUp className={`h-3 w-3 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full mb-2 left-0 glass-morphism text-white rounded-lg overflow-hidden min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-white/20 transition-colors duration-200 flex items-center ${
                  language === lang.code ? 'bg-white/20' : ''
                }`}
              >
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
