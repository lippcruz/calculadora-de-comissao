
import React from 'react';
import { History as HistoryIconLucide } from 'lucide-react';

const EmptyHistory = () => (
  <div className="text-center text-muted-foreground py-12 flex flex-col items-center">
    <HistoryIconLucide className="w-16 h-16 mb-4 text-muted-foreground/50" />
    <p className="text-lg">Seu histórico está vazio.</p>
    <p className="text-sm">Cálculos guardados aparecerão aqui.</p>
  </div>
);

export default EmptyHistory;
