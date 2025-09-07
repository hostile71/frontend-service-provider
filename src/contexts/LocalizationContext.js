import React, { createContext, useContext, useState } from 'react';
import { translations } from '../constants/translations';
import { LANGUAGES } from '../constants';

const LocalizationContext = createContext();

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.EN);

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    
    // Set RTL direction for Arabic
    if (lang === LANGUAGES.AR) {
      document.documentElement.dir = 'rtl';
      document.body.style.direction = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
      document.body.style.direction = 'ltr';
    }
  };

  const isRTL = currentLanguage === LANGUAGES.AR;

  const value = {
    currentLanguage,
    t,
    changeLanguage,
    isRTL
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
