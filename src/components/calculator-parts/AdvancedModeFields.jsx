
import React from 'react';
import { motion } from 'framer-motion';
import { User, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdvancedModeFields = ({
  sellerName,
  handleSellerNameChange,
  referenceMonth,
  handleReferenceMonthChange,
  formatReferenceMonthInput,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden space-y-4"
    >
      <div>
        <Label htmlFor="sellerName" className="text-sm font-medium text-foreground/80">Nome do Vendedor</Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="sellerName"
            type="text"
            inputMode="text"
            value={sellerName}
            onChange={handleSellerNameChange}
            placeholder="Ex: João Silva"
            className="pl-10 text-lg bg-input text-foreground border-border focus:ring-primary"
            aria-label="Nome do Vendedor"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="referenceMonth" className="text-sm font-medium text-foreground/80">Mês de Referência</Label>
        <div className="relative mt-1">
          <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="referenceMonth"
            type="text"
            inputMode="numeric" // Suggests numeric, but allows /
            value={referenceMonth}
            onChange={handleReferenceMonthChange}
            onBlur={formatReferenceMonthInput}
            placeholder="MM/AAAA ou 0424"
            maxLength="7" // For MM/YYYY
            className="pl-10 text-lg bg-input text-foreground border-border focus:ring-primary"
            aria-label="Mês de Referência"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedModeFields;
