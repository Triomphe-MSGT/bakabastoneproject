import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('FR'); // Default FR

  const switchLanguage = (lang) => {
    if (['FR', 'EN', 'CN'].includes(lang)) {
      setLanguage(lang);
      // Here you would typically trigger translation logic or update i18n instance
    }
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
