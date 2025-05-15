
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import CommissionCalculator from "@/components/CommissionCalculator";
import { ThemeProvider } from "@/contexts/ThemeContext.jsx";
import ThemeToggle from "@/components/ThemeToggle";
import PrivacyConsent from "@/components/PrivacyConsent";
import { Calculator } from 'lucide-react';

const PRIVACY_CONSENT_KEY = 'privacyConsentDismissed_v1_basic';

function App() {
  const [isPrivacyConsentVisible, setIsPrivacyConsentVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const consentDismissed = localStorage.getItem(PRIVACY_CONSENT_KEY);
    if (!consentDismissed) {
      setIsPrivacyConsentVisible(true);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulates loading time

    return () => clearTimeout(timer);
  }, []);

  const handlePrivacyConsentDismiss = () => {
    setIsPrivacyConsentVisible(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-purple-600 text-white z-[200]">
        <Calculator className="h-16 w-16 animate-pulse text-white mb-4" />
        <p className="text-lg font-medium">Carregando Calculadora...</p>
        <p className="text-sm text-purple-200">Por favor, aguarde um momento.</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <CommissionCalculator />
      <Toaster />
      
      <div 
        className="fixed bottom-4 left-4 transition-all duration-300 ease-in-out"
        style={{ zIndex: isPrivacyConsentVisible ? 40 : 60 }} 
      >
        <ThemeToggle />
      </div>
      
      <PrivacyConsent 
        onDismiss={handlePrivacyConsentDismiss} 
        isVisibleInitially={isPrivacyConsentVisible}
      />
    </ThemeProvider>
  );
}

export default App;
