
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X } from 'lucide-react';

const PRIVACY_CONSENT_KEY = 'privacyConsentDismissed_v1_basic_calculator';

const PrivacyConsent = ({ onDismiss, isVisibleInitially }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isVisibleInitially);
  }, [isVisibleInitially]);

  const handleDismissInternal = () => {
    try {
      localStorage.setItem(PRIVACY_CONSENT_KEY, 'true');
    } catch (error) {
       console.error("Erro ao salvar consentimento no localStorage:", error);
    }
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const privacyTitle = 'Aviso de Privacidade e Cookies';
  const privacyDescription = 'Este site utiliza LocalStorage (semelhante a cookies) para salvar sua tabela de comissões diretamente no seu navegador, garantindo que seus dados persistam entre as sessões. Nenhum dado é enviado para servidores externos. Ao continuar, você concorda com este armazenamento local.';
  const dismissButtonText = 'Entendido';
  const dismissAriaLabel = 'Entendido, fechar aviso de privacidade e cookies';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-3 md:p-4"
          role="alertdialog"
          aria-labelledby="privacy-title"
          aria-describedby="privacy-description"
        >
          <div className="max-w-screen-lg mx-auto bg-card/95 backdrop-blur-lg text-foreground p-4 rounded-lg shadow-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-primary mr-3 shrink-0" />
              <div>
                <h3 id="privacy-title" className="text-sm font-semibold text-primary">{privacyTitle}</h3>
                <p id="privacy-description" className="text-xs text-foreground/80 mt-0.5">
                  {privacyDescription}
                </p>
              </div>
            </div>
            <Button onClick={handleDismissInternal} variant="outline" size="sm" className="bg-background/70 hover:bg-background text-foreground shrink-0 w-full sm:w-auto" aria-label={dismissAriaLabel}>
              <X className="h-4 w-4 mr-1.5 sm:mr-2" /> {dismissButtonText}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyConsent;
