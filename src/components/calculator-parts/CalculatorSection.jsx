
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Percent, PlusCircle, TrendingUp, User, Eye, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import AdPlaceholder from '@/components/AdPlaceholder';
import { Switch } from "@/components/ui/switch";
import { formatReferenceMonthForDisplay } from '@/lib/calculatorUtils';

const AdvancedModeToggle = ({ isAdvancedMode, toggleAdvancedMode }) => (
  <div className="flex items-center space-x-2">
    <Label htmlFor="advanced-mode-switch" className="text-sm text-foreground/80 whitespace-nowrap">
      Avançado
    </Label>
    <Switch
      id="advanced-mode-switch"
      checked={isAdvancedMode}
      onCheckedChange={toggleAdvancedMode}
      aria-label="Ativar modo avançado"
    />
  </div>
);

const AdvancedModeFields = ({
  sellerName,
  handleSellerNameChange,
  referenceMonth,
  handleReferenceMonthChange,
  motionTransition
}) => (
  <motion.div
    layout
    variants={{
      hidden: { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' },
      visible: { opacity: 1, height: 'auto', marginTop: '1rem', marginBottom: '1rem', overflow: 'hidden' },
    }}
    initial="hidden"
    animate="visible"
    exit="hidden"
    transition={motionTransition}
    className="space-y-4"
  >
    <div>
      <Label htmlFor="sellerName" className="text-sm font-medium text-foreground/80">Nome do Vendedor</Label>
      <div className="relative mt-1">
        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="sellerName"
          type="text"
          value={sellerName}
          onChange={handleSellerNameChange}
          placeholder="Ex: João Silva"
          className="pl-10 text-lg bg-input text-foreground border-border focus:ring-primary"
          aria-label="Nome do Vendedor"
        />
      </div>
    </div>
    <div>
      <Label htmlFor="referenceMonth" className="text-sm font-medium text-foreground/80">Mês de Referência (MM/AAAA)</Label>
      <div className="relative mt-1">
        <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="referenceMonth"
          type="text"
          value={referenceMonth}
          onChange={handleReferenceMonthChange}
          placeholder="Ex: 07/2024 ou deixe em branco"
          className="pl-10 text-lg bg-input text-foreground border-border focus:ring-primary"
          aria-label="Mês de Referência no formato MM/AAAA"
          maxLength={7}
        />
      </div>
    </div>
  </motion.div>
);

const CommissionResultDisplay = ({ commissionResult, formatNumberForDisplay, formatPercentageForDisplay, motionTransition }) => {
  if (!commissionResult) return null;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={motionTransition}
        className="mt-4 mb-2 flex justify-center"
      >
        <AdPlaceholder width={336} height={280} text="Publicidade - 336x280 (Resultado)" />
      </motion.div>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...motionTransition, delay: 0.1 }}
        className="result-card-gradient p-6 rounded-xl text-center text-primary-foreground shadow-lg"
      >
        {commissionResult.sellerName && (
          <p className="text-sm font-medium text-primary-foreground/80">Vendedor: {commissionResult.sellerName}</p>
        )}
        {commissionResult.referenceMonth && commissionResult.referenceMonth !== "none" && (
          <p className="text-xs font-medium text-primary-foreground/70">Mês: {formatReferenceMonthForDisplay(commissionResult.referenceMonth)}</p>
        )}
        <p className="text-base font-medium mt-1">A comissão é</p>
        <p className="text-4xl lg:text-5xl font-bold my-1 tracking-tight">
          $ {formatNumberForDisplay(commissionResult.commissionValue)}
        </p>
        <p className="text-sm text-primary-foreground/80">
          {formatPercentageForDisplay(String(commissionResult.commissionRate))}% de $ {formatNumberForDisplay(commissionResult.salesAmount)}
        </p>
      </motion.div>
    </>
  );
};


const CalculatorSection = ({
  salesAmount,
  handleSalesAmountChange,
  commissionRate,
  handleCommissionRateSliderChange,
  handleCommissionRateInputChange,
  sellerName,
  handleSellerNameChange,
  referenceMonth,
  handleReferenceMonthChange,
  isAdvancedMode,
  toggleAdvancedMode,
  commissionResult,
  saveToTable, 
  parseInputAsFloat,
  showTable, 
  toggleTable, 
  formatNumberForDisplay,
  formatPercentageForDisplay
}) => {
  
  const currentCommissionRate = parseInputAsFloat(commissionRate);
  const motionTransition = { type: "spring", stiffness: 300, damping: 30 };

  const handleSliderChange = (value) => {
    const newRate = Array.isArray(value) ? value[0] : value;
    handleCommissionRateSliderChange(String(newRate));
  };

  return (
    <Card className="glass-card w-full relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-2xl text-foreground">
          <TrendingUp className="mr-3 h-7 w-7 text-primary" />
          Calculadora de Comissão
        </CardTitle>
        <AdvancedModeToggle isAdvancedMode={isAdvancedMode} toggleAdvancedMode={toggleAdvancedMode} />
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div>
            <Label htmlFor="salesAmount" className="text-sm font-medium text-foreground/80">Valor total de vendas</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="salesAmount"
                type="text"
                inputMode="decimal"
                value={salesAmount}
                onChange={(e) => handleSalesAmountChange(e.target.value)}
                placeholder="Ex: 1250 ou 1250.75"
                className="pl-10 text-lg bg-input text-foreground border-border focus:ring-primary"
                aria-label="Valor total de vendas"
              />
            </div>
          </div>

        {isAdvancedMode && (
          <AdvancedModeFields
            sellerName={sellerName}
            handleSellerNameChange={handleSellerNameChange}
            referenceMonth={referenceMonth}
            handleReferenceMonthChange={handleReferenceMonthChange}
            motionTransition={motionTransition}
          />
        )}

        <div>
          <Label htmlFor="commissionRateInput" className="text-sm font-medium text-foreground/80">Porcentagem da comissão (%)</Label>
          <div className="flex items-center space-x-3 mt-1">
            <Slider
              id="commissionRateSlider"
              value={[isNaN(currentCommissionRate) ? 0 : currentCommissionRate]}
              onValueChange={handleSliderChange}
              max={100}
              step={1} 
              className="flex-grow"
              aria-label="Deslizante da porcentagem da comissão"
            />
            <div className="relative w-28">
              <Input
                id="commissionRateInput"
                type="text"
                inputMode="decimal"
                value={formatPercentageForDisplay(commissionRate)}
                onChange={(e) => handleCommissionRateInputChange(e.target.value)}
                className="pr-7 text-center text-lg bg-input text-foreground border-border focus:ring-primary"
                aria-label="Campo de texto da porcentagem da comissão"
                placeholder="Ex: 5.25"
              />
              <Percent className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <CommissionResultDisplay
            commissionResult={commissionResult}
            formatNumberForDisplay={formatNumberForDisplay}
            formatPercentageForDisplay={formatPercentageForDisplay}
            motionTransition={motionTransition}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={saveToTable} 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3"
            disabled={!commissionResult || commissionResult.salesAmount <= 0 || commissionResult.commissionRate < 0 || commissionResult.referenceMonth === "invalid"}
            aria-label="Adicionar à Tabela"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar à Tabela
          </Button>
          {!showTable && (
            <Button onClick={toggleTable} variant="outline" className="flex-1 bg-card/70 hover:bg-card text-foreground text-lg py-3">
              <Eye className="mr-2 h-5 w-5" />
              Mostrar Tabela
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorSection;
