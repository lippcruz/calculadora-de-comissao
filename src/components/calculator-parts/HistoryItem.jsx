
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Percent, Edit3, Trash2, Save, X, CalendarDays, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatReferenceMonthForDisplay } from '@/lib/calculatorUtils';

const HistoryItem = ({
  item,
  formatNumberForDisplay,
  formatPercentageForDisplay,
  handleDeleteConfirmation,
  updateSellerInHistory,
  updateReferenceMonthInHistory,
  editingItemId,
  setEditingItemId,
  tempSellerName,
  setTempSellerName,
  tempReferenceMonth,
  setTempReferenceMonth
}) => {
  const isEditing = editingItemId === item.id;
  const itemRef = useRef(null);

  const handleEdit = () => {
    setEditingItemId(item.id);
    setTempSellerName(item.sellerName || "");
    setTempReferenceMonth(formatReferenceMonthForDisplay(item.referenceMonth, true));
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleSaveEdit = () => {
    if (item.sellerName !== tempSellerName) {
      updateSellerInHistory(item.id, tempSellerName);
    }
    const currentFormattedMonth = formatReferenceMonthForDisplay(item.referenceMonth, true);
    if (currentFormattedMonth !== tempReferenceMonth) {
      const success = updateReferenceMonthInHistory(item.id, tempReferenceMonth);
      if (!success && tempReferenceMonth.trim() !== "") { // If update failed and input was not empty, don't close edit
        return; 
      }
    }
    setEditingItemId(null);
  };
  
  useEffect(() => {
    if (itemRef.current && item.justAdded) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // Remove the flag after scrolling
      // This requires a way to update the item in the history state, which is complex from here.
      // A simpler approach is to manage this scroll in useCommissionCalculatorLogic after adding the item.
    }
  }, [item.justAdded]);


  return (
    <motion.div
      ref={itemRef}
      id={`history-item-${item.id}`}
      layout
      initial={{ opacity: 0.8, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-card/70 p-4 rounded-lg shadow-md border border-border/50 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow mb-3 sm:mb-0">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label htmlFor={`sellerName-${item.id}`} className="text-xs font-medium text-muted-foreground">Vendedor</label>
                <div className="relative">
                   <User className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={`sellerName-${item.id}`}
                    type="text"
                    value={tempSellerName}
                    onChange={(e) => setTempSellerName(e.target.value)}
                    className="pl-8 text-sm bg-input/50 h-9"
                    placeholder="Nome do Vendedor"
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`referenceMonth-${item.id}`} className="text-xs font-medium text-muted-foreground">Mês (MM/AAAA)</label>
                 <div className="relative">
                  <CalendarDays className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={`referenceMonth-${item.id}`}
                    type="text"
                    value={tempReferenceMonth}
                    onChange={(e) => setTempReferenceMonth(e.target.value)}
                    className="pl-8 text-sm bg-input/50 h-9"
                    placeholder="MM/AAAA"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {(item.sellerName || item.referenceMonth !== "none") && (
                 <div className="mb-1.5 text-xs text-muted-foreground">
                    {item.sellerName && (
                        <span className="font-medium">{item.sellerName}</span>
                    )}
                    {item.sellerName && item.referenceMonth !== "none" && " - "}
                    {item.referenceMonth !== "none" && (
                        <span>{formatReferenceMonthForDisplay(item.referenceMonth)}</span>
                    )}
                </div>
              )}
              <p className="text-lg font-semibold text-primary">
                $ {formatNumberForDisplay(item.commissionValue)}
              </p>
              <p className="text-sm text-foreground/80">
                {formatPercentageForDisplay(String(item.commissionRate))}% de $ {formatNumberForDisplay(item.salesAmount)}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-2 sm:mt-0 self-end sm:self-center">
          {isEditing ? (
            <>
              <Button onClick={handleSaveEdit} size="icon" variant="ghost" className="text-green-500 hover:text-green-400 h-8 w-8">
                <Save className="h-4 w-4" />
                <span className="sr-only">Salvar Edição</span>
              </Button>
              <Button onClick={handleCancelEdit} size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Cancelar Edição</span>
              </Button>
            </>
          ) : (
            <>
              {(item.sellerName !== undefined || item.referenceMonth !== undefined) && ( // Show edit only if advanced fields were used
                <Button onClick={handleEdit} size="icon" variant="ghost" className="text-blue-500 hover:text-blue-400 h-8 w-8">
                  <Edit3 className="h-4 w-4" />
                  <span className="sr-only">Editar Item</span>
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive/80 h-8 w-8"
                    onClick={() => handleDeleteConfirmation.setItemToDelete(item.id)}
                    aria-label={`Apagar item da tabela: ${formatNumberForDisplay(item.commissionValue)}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                {handleDeleteConfirmation.itemToDelete === item.id && (
                  <AlertDialogContent className="border-destructive bg-card text-foreground">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center text-destructive">Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription className="text-foreground/80">
                        Tem certeza que deseja apagar este item da tabela? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => handleDeleteConfirmation.setItemToDelete(null)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteConfirmation.confirmDeleteItem(item.id)}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Apagar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryItem;
