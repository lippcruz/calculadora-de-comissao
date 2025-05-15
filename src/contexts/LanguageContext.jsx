
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const supportedLanguages = ['pt-BR', 'en-US'];
const defaultLanguage = 'pt-BR';

const currencyOptions = [
  { value: 'BRL', label: 'Real Brasileiro (R$)', symbol: 'R$' },
  { value: 'USD', label: 'Dólar Americano ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'Libra Esterlina (£)', symbol: '£' },
  { value: 'JPY', label: 'Iene Japonês (¥)', symbol: '¥' },
];

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return defaultLanguage;
  const storedLang = localStorage.getItem('appLanguage');
  if (storedLang && supportedLanguages.includes(storedLang)) {
    return storedLang;
  }
  const browserLang = navigator.language || navigator.userLanguage;
  return supportedLanguages.includes(browserLang) ? browserLang : defaultLanguage;
};

const getInitialCurrency = (lang) => {
  if (typeof window === 'undefined') return 'BRL'; // Default to BRL SSR
  const storedCurrency = localStorage.getItem('appCurrency');
  if (storedCurrency && currencyOptions.find(c => c.value === storedCurrency)) {
    return storedCurrency;
  }
  return lang === 'en-US' ? 'USD' : 'BRL';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [currency, setCurrency] = useState(() => getInitialCurrency(language));

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    // Update currency if language changes and no currency was explicitly set by user
    const storedCurrency = localStorage.getItem('appCurrency');
    if (!storedCurrency) {
        setCurrency(language === 'en-US' ? 'USD' : 'BRL');
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem('appCurrency', currency);
  }, [currency]);

  const changeLanguage = (langCode) => {
    if (supportedLanguages.includes(langCode)) {
      setLanguage(langCode);
    }
  };

  const changeCurrency = (currencyCode) => {
    if (currencyOptions.find(c => c.value === currencyCode)) {
      setCurrency(currencyCode);
    }
  };

  const t = useCallback((translations) => {
    return translations[language] || translations[defaultLanguage] || '';
  }, [language]);

  const formatCurrency = useCallback((value) => {
    const selectedCurrencyOption = currencyOptions.find(opt => opt.value === currency) || currencyOptions.find(opt => opt.value === 'BRL');
    if (value === null || value === undefined || isNaN(Number(value))) {
      return new Intl.NumberFormat(language, { style: 'currency', currency: selectedCurrencyOption.value }).format(0);
    }
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: selectedCurrencyOption.value,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  }, [currency, language]);


  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, currency, changeCurrency, currencyOptions, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};
