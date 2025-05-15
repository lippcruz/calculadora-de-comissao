
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdPlaceholder from '@/components/AdPlaceholder';
import CalculatorSection from '@/components/calculator-parts/CalculatorSection';
import TableSection from '@/components/calculator-parts/HistorySection';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import MainLayout from '@/components/layout/MainLayout';
import { useCommissionCalculatorLogic } from '@/hooks/useCommissionCalculatorLogic';
import { useToast } from "@/components/ui/use-toast";
import CalculatorDisplay from '@/components/calculator-parts/CalculatorDisplay';
import HistoryDisplay from '@/components/calculator-parts/HistoryDisplay';

const CommissionCalculator = () => {
  const { toast } = useToast();
  const logic = useCommissionCalculatorLogic(toast);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <MainLayout>
      <AppHeader />
      <motion.div 
        className="w-full max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-center">
          <AdPlaceholder width={728} height={90} text="Publicidade - 728x90 (Topo)" />
        </div>

        <motion.div 
          variants={containerVariants} 
          className="flex flex-col lg:flex-row lg:justify-center lg:space-x-8 items-start"
        >
          <CalculatorDisplay showHistory={logic.showTable}>
            <CalculatorSection
              salesAmount={logic.salesAmount}
              handleSalesAmountChange={logic.handleSalesAmountChange}
              commissionRate={logic.commissionRate}
              handleCommissionRateSliderChange={logic.handleCommissionRateSliderChange}
              handleCommissionRateInputChange={logic.handleCommissionRateInputChange}
              sellerName={logic.sellerName}
              handleSellerNameChange={logic.handleSellerNameChange}
              referenceMonth={logic.referenceMonth}
              handleReferenceMonthChange={logic.handleReferenceMonthChange}
              isAdvancedMode={logic.isAdvancedMode}
              toggleAdvancedMode={logic.toggleAdvancedMode}
              commissionResult={logic.commissionResult}
              saveToTable={logic.saveToTable}
              parseInputAsFloat={logic.parseInputAsFloat}
              showTable={logic.showTable}
              toggleTable={logic.toggleTable}
              formatNumberForDisplay={logic.formatNumberForDisplay}
              formatPercentageForDisplay={logic.formatPercentageForDisplay}
            />
          </CalculatorDisplay>
          
          <AnimatePresence>
            {logic.showTable && (
              <HistoryDisplay>
                <TableSection
                  history={logic.history}
                  deleteHistoryItem={logic.deleteHistoryItem}
                  clearHistory={logic.clearHistory}
                  updateSellerInHistory={logic.updateSellerInHistory}
                  updateReferenceMonthInHistory={logic.updateReferenceMonthInHistory}
                  exportHistoryToCSV={logic.exportHistoryToCSV}
                  showTable={logic.showTable}
                  toggleTable={logic.toggleTable}
                  formatNumberForDisplay={logic.formatNumberForDisplay}
                  formatPercentageForDisplay={logic.formatPercentageForDisplay}
                />
              </HistoryDisplay>
            )}
          </AnimatePresence>
        </motion.div>
        
        <div className="flex justify-center">
          <AdPlaceholder width={728} height={90} text="Publicidade - 728x90 (Rodapé Principal)" />
        </div>

      </motion.div>
      <logic.DuplicateEntryDialog />
      <AppFooter />
    </MainLayout>
  );
};

export default CommissionCalculator;
