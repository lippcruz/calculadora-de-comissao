
import React from 'react';
import { History as HistoryIconLucide, Trash2, EyeOff } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const HistorySectionHeader = ({ showHistory, toggleHistory, historyLength, onClearAllClick }) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <div className="flex items-center">
      <HistoryIconLucide className="mr-3 h-7 w-7 text-primary" />
      <CardTitle className="text-2xl text-foreground">Histórico de Comissões</CardTitle>
    </div>
    <div className="flex items-center space-x-2">
      {showHistory && (
        <Button onClick={toggleHistory} variant="ghost" size="icon" className="text-foreground hover:text-primary" aria-label="Ocultar Histórico">
          <EyeOff className="h-5 w-5" />
        </Button>
      )}
      {historyLength > 0 && (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" aria-label="Limpar histórico" onClick={onClearAllClick}>
            <Trash2 className="mr-1 h-4 w-4" /> Limpar Tudo
          </Button>
        </AlertDialogTrigger>
      )}
    </div>
  </CardHeader>
);

export default HistorySectionHeader;
