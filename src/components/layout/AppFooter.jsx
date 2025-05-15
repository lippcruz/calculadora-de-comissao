
import React from 'react';

const AppFooter = () => {
  return (
    <footer className="mt-6 md:mt-8 py-4">
      <p className="text-center text-xs text-foreground/60">
        Calculadora de Comissão &copy; {new Date().getFullYear()}. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default AppFooter;
