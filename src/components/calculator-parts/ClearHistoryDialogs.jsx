
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { AlertTriangle, Trash2 } from 'lucide-react';

const ClearHistoryDialogs = ({
  showClearConfirmStep1,
  setShowClearConfirmStep1,
  showClearConfirmStep2,
  setShowClearConfirmStep2,
  clearConfirmInput,
  setClearConfirmInput,
  handleClearHistoryStep2,
  historyLength,
}) => {
  return (
    <>
      <AlertDialog open={showClearConfirmStep1} onOpenChange={setShowClearConfirmStep1}>
        <AlertDialogContent className="border-destructive">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Atenção!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80">
              Esta ação apagará permanentemente todos os {historyLength} itens do seu histórico. Não será possível recuperá-los. Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowClearConfirmStep1(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { setShowClearConfirmStep1(false); setShowClearConfirmStep2(true); }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Sim, desejo continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearConfirmStep2} onOpenChange={(isOpen) => {
        setShowClearConfirmStep2(isOpen);
        if (!isOpen) setClearConfirmInput("");
      }}>
        <AlertDialogContent className="border-destructive shadow-2xl shadow-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-destructive text-xl">
              <AlertTriangle className="mr-2 h-8 w-8 animate-pulse" />
              Atenção
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/90 text-base">
              Para confirmar a exclusão permanente de todo o histórico, por favor, digite <strong className="text-destructive">apagar tudo</strong> no campo abaixo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="text"
            value={clearConfirmInput}
            onChange={(e) => setClearConfirmInput(e.target.value)}
            placeholder='Digite "apagar tudo" aqui'
            className="my-4 bg-input border-destructive text-foreground focus:ring-destructive"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowClearConfirmStep2(false); setClearConfirmInput(""); }}>cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearHistoryStep2}
              disabled={clearConfirmInput.toLowerCase() !== "apagar tudo"}
              className="bg-destructive hover:bg-destructive/80 text-destructive-foreground font-bold"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Confirmar e Apagar Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClearHistoryDialogs;
