
import React from 'react';

const AppHeader = () => {
  return (
    <header className="py-6 mb-8 text-center">
      <div className="sr-only">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Calculadora de Comissão de Vendas
        </h1>
        <p className="mt-3 text-lg leading-7 text-muted-foreground sm:text-xl">
          Calcule suas comissões de forma fácil e rápida. Adicione à tabela e exporte se precisar!
        </p>
      </div>
      {/* Visual elements removed as per user request */}
    </header>
  );
};

export default AppHeader;
