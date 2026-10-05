import React, { createContext, useContext, useEffect, useState } from 'react';
import { EditorPreference, Language, ResponseLength } from '../types';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  editor: EditorPreference;
  setEditor: (editor: EditorPreference) => void;
  responseLength: ResponseLength;
  setResponseLength: (len: ResponseLength) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mapforge_lang') as Language) || 'en';
  });

  const [editor, setEditorState] = useState<EditorPreference>(() => {
    return (localStorage.getItem('mapforge_editor') as EditorPreference) || 'Unreal Engine 5';
  });

  const [responseLength, setResponseLengthState] = useState<ResponseLength>(() => {
    return (localStorage.getItem('mapforge_res_len') as ResponseLength) || 'detailed';
  });

  const [isDark, setIsDarkState] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('mapforge_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mapforge_editor', editor);
  }, [editor]);

  useEffect(() => {
    localStorage.setItem('mapforge_res_len', responseLength);
  }, [responseLength]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setEditor = (ed: EditorPreference) => setEditorState(ed);
  const setResponseLength = (len: ResponseLength) => setResponseLengthState(len);
  const setIsDark = (dark: boolean) => setIsDarkState(dark);

  // Quick dictionary for primary UI labels in English / Roman Urdu / Urdu
  const t = (key: string): string => {
    const dict: Record<string, { en: string; roman_ur: string; ur: string }> = {
      appTitle: {
        en: 'MapForge AI',
        roman_ur: 'MapForge AI',
        ur: 'میپ فورج اے آئی',
      },
      subtitle: {
        en: 'PUBG Map Creation & Level Design Assistant',
        roman_ur: 'PUBG Map Banane Aur Level Design Ka Madadgar',
        ur: 'پب جی میپ بنانے اور لیول ڈیزائن کا معاون',
      },
      home: { en: 'Home', roman_ur: 'Home', ur: 'ہوم' },
      aiAssistant: { en: 'AI Assistant', roman_ur: 'AI Assistant', ur: 'اے آئی معاون' },
      deepSolve: { en: 'Deep Problem Solve', roman_ur: 'Deep Problem Solve', ur: 'گہرا مسئلہ حل' },
      aiSearch: { en: 'AI Search', roman_ur: 'AI Search', ur: 'اے آئی سرچ' },
      videoFinder: { en: 'Video Finder', roman_ur: 'Video Finder', ur: 'ویڈیو فائنڈر' },
      screenshot: { en: 'Screenshot Analyzer', roman_ur: 'Screenshot Analyzer', ur: 'اسکرین شاٹ تجزیہ' },
      mapPlanner: { en: 'Map Planner', roman_ur: 'Map Planner', ur: 'میپ پلانر' },
      academy: { en: 'Academy', roman_ur: 'Academy', ur: 'اکیڈمی' },
      troubleshoot: { en: 'Troubleshooting', roman_ur: 'Troubleshooting', ur: 'مسائل حل مرکز' },
      errorSolver: { en: 'Error Solver', roman_ur: 'Error Solver', ur: 'ایرر سولور' },
      projects: { en: 'Projects', roman_ur: 'Projects', ur: 'پروجیکٹس' },
      checklist: { en: 'Checklist', roman_ur: 'Checklist', ur: 'چیک لسٹ' },
      settings: { en: 'Settings', roman_ur: 'Settings', ur: 'ترتیبات' },
      askAi: { en: 'Ask AI', roman_ur: 'AI Se Poochien', ur: 'اے آئی سے پوچھیں' },
      analyzing: { en: 'Analyzing the problem...', roman_ur: 'Maslay ka jaiza liya ja raha hai...', ur: 'مسئلے کا تفصیلی تجزیہ جاری ہے...' },
    };

    if (dict[key]) {
      return dict[key][language] || dict[key].en;
    }
    return key;
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        editor,
        setEditor,
        responseLength,
        setResponseLength,
        isDark,
        setIsDark,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
