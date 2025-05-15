
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as TableIconLucide, Trash2, AlertTriangle, Download, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AdPlaceholder from '@/components/AdPlaceholder';
import HistoryItem from '@/components/calculator-parts/HistoryItem';

const TableSectionHeader = ({ showTable, toggleTable }) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <div className="flex items-center">
      <TableIconLucide className="mr-3 h-7 w-7 text-primary" />
      <CardTitle className="text-2xl text-foreground">Tabela de Comissões</CardTitle>
    </div>
    {showTable && (
      <Button onClick={toggleTable} variant="ghost" size="icon" className="text-foreground hover:text-primary" aria-label="Ocultar Tabela">
        <EyeOff className="h-5 w-5" />
      </Button>
    )}
  </CardHeader>
);

const EmptyTable = () => (
  <div className="text-center text-muted-foreground py-12 flex flex-col items-center">
    <TableIconLucide className="w-16 h-16 mb-4 text-muted-foreground/50" />
    <p className="text-lg">Sua tabela está vazia.</p>
    <p className="text-sm">Cálculos adicionados aparecerão aqui.</p>
  </div>
);

const TableList = ({ history, updateSellerInHistory, updateReferenceMonthInHistory, deleteHistoryItem, formatNumberForDisplay, formatPercentageForDisplay }) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [tempSellerName, setTempSellerName] = useState("");
  const [tempReferenceMonth, setTempReferenceMonth] = useState("");
  
  const [itemToDelete, setItemToDelete] = useState(null);
  const handleDeleteConfirmation = {
    itemToDelete,
    setItemToDelete,
    confirmDeleteItem: (id) => {
      if (id) {
        deleteHistoryItem(id);
        setItemToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-3 mb-4">
      <AnimatePresence>
        {history.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <HistoryItem
              item={item}
              formatNumberForDisplay={formatNumberForDisplay}
              formatPercentageForDisplay={formatPercentageForDisplay}
              handleDeleteConfirmation={handleDeleteConfirmation}
              updateSellerInHistory={updateSellerInHistory}
              updateReferenceMonthInHistory={updateReferenceMonthInHistory}
              editingItemId={editingItemId}
              setEditingItemId={setEditingItemId}
              tempSellerName={tempSellerName}
              setTempSellerName={setTempSellerName}
              tempReferenceMonth={tempReferenceMonth}
              setTempReferenceMonth={setTempReferenceMonth}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const TableActions = ({ 
  onExportClick, 
  historyLength,
  onClearAll 
}) => {
  return (
    <div className="flex flex-col sm:flex-row-reverse gap-3 mt-4">
      {historyLength > 0 && (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex-1" onClick={onClearAll}>
            <Trash2 className="mr-2 h-5 w-5" />
            Limpar Tudo
          </Button>
        </AlertDialogTrigger>
      )}
       <Button onClick={onExportClick} variant="default" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
        <Download className="mr-2 h-5 w-5" />
        Exportar Tabela (CSV)
      </Button>
    </div>
  );
};


const TableSection = ({ 
  history, 
  deleteHistoryItem, 
  clearHistory, 
  updateSellerInHistory, 
  updateReferenceMonthInHistory, 
  exportHistoryToCSV, 
  showTable, 
  toggleTable, 
  formatNumberForDisplay,
  formatPercentageForDisplay
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };
  
  const alertTitle = "Confirmar Limpeza";
  const alertDesc = `Tem certeza que deseja apagar permanentemente todos os ${history.length} itens da sua tabela? Esta ação não pode ser desfeita.`;
  const cancelButton = "Cancelar";
  const continueButton = "Sim, Apagar Tudo";
  const adText = "Publicidade - 336x280 (Tabela)";

  return (
    <Card className="glass-card w-full">
      <TableSectionHeader
        showTable={showTable}
        toggleTable={toggleTable}
      />
      <CardContent>
        {history.length === 0 ? (
          <EmptyTable />
        ) : (
          <>
            <TableList
              history={history}
              formatNumberForDisplay={formatNumberForDisplay}
              formatPercentageForDisplay={formatPercentageForDisplay}
              updateSellerInHistory={updateSellerInHistory}
              updateReferenceMonthInHistory={updateReferenceMonthInHistory}
              deleteHistoryItem={deleteHistoryItem}
            />
            <div className="my-4 flex justify-center">
                <AdPlaceholder width={336} height={280} text={adText} />
            </div>
            <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
              <TableActions
                onExportClick={exportHistoryToCSV}
                historyLength={history.length}
                onClearAll={() => setShowClearConfirm(true)}
              />
              <AlertDialogContent className="border-destructive bg-card text-foreground">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center text-destructive">
                    <AlertTriangle className="mr-2 h-6 w-6" />
                    {alertTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-foreground/80">
                    {alertDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowClearConfirm(false)}>{cancelButton}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearHistory}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    {continueButton}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TableSection;
