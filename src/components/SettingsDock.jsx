
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Languages, DollarSign as DollarSignIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsDock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, changeLanguage, currency, changeCurrency, currencyOptions, t } = useLanguage();
  const dockRef = useRef(null);
  const toggleButtonRef = useRef(null); 

  const toggleDock = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dockRef.current && 
        !dockRef.current.contains(event.target) &&
        toggleButtonRef.current && 
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const languageOptions = [
    { value: 'pt-BR', label: 'Português (BR)' },
    { value: 'en-US', label: 'English (US)' },
  ];
  
  const translations = {
    settingsTitle: t({ 'pt-BR': 'Configurações', 'en-US': 'Settings' }),
    languageLabel: t({ 'pt-BR': 'Idioma', 'en-US': 'Language' }),
    currencyLabel: t({ 'pt-BR': 'Moeda', 'en-US': 'Currency' }),
    selectLanguage: t({ 'pt-BR': 'Selecione o Idioma', 'en-US': 'Select Language' }),
    selectCurrency: t({ 'pt-BR': 'Selecione a Moeda', 'en-US': 'Select Currency' }),
  };


  return (
    <>
      <Button
        ref={toggleButtonRef} 
        variant="outline"
        size="icon"
        onClick={toggleDock}
        className="bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg rounded-full w-12 h-12" 
        aria-label={translations.settingsTitle}
      >
        <Settings className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dockRef} 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-4 z-[55] p-4 bg-card/95 backdrop-blur-lg shadow-xl rounded-lg border border-border w-64"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">{translations.settingsTitle}</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground flex items-center mb-1">
                  <Languages className="h-3.5 w-3.5 mr-1.5" />
                  {translations.languageLabel}
                </Label>
                 <Select value={language} onValueChange={changeLanguage}>
                    <SelectTrigger className="w-full bg-input text-foreground border-border focus:ring-primary text-sm h-9">
                        <SelectValue placeholder={translations.selectLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                        {languageOptions.map(lang => (
                            <SelectItem key={lang.value} value={lang.value} className="text-sm">
                                {lang.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground flex items-center mb-1">
                  <DollarSignIcon className="h-3.5 w-3.5 mr-1.5" />
                  {translations.currencyLabel}
                </Label>
                 <Select value={currency} onValueChange={changeCurrency}>
                    <SelectTrigger className="w-full bg-input text-foreground border-border focus:ring-primary text-sm h-9">
                        <SelectValue placeholder={translations.selectCurrency} />
                    </SelectTrigger>
                    <SelectContent>
                        {currencyOptions.map(curr => (
                            <SelectItem key={curr.value} value={curr.value} className="text-sm">
                                {curr.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsDock;

const Label = ({ children, ...props }) => (
  <label {...props} className={`block text-xs font-medium text-muted-foreground ${props.className || ''}`}>
    {children}
  </label>
);
