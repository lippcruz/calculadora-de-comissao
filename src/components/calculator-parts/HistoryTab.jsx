
import React from "react";
import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const HistoryTab = ({
  savedCalculations,
  exportCalculations,
  deleteCalculation,
}) => {
  const { t, formatCurrencyContext, currency } = useLanguage();
  const formatCurrency = (value) => formatCurrencyContext(value, currency);


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      <Card className="glass-card opacity-50 cursor-not-allowed">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">{t('history_tab.title_deprecated')}</CardTitle>
            <CardDescription className="text-white/70">
              {t('history_tab.description_deprecated')}
            </CardDescription>
          </div>
          <Button 
            onClick={exportCalculations}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            disabled={!savedCalculations || savedCalculations.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('history_tab.export_csv_button')}
          </Button>
        </CardHeader>
        <CardContent>
          {savedCalculations && savedCalculations.length > 0 ? (
            <div className="space-y-4">
              {savedCalculations.map((calc) => (
                <motion.div
                  key={calc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-lg bg-white/10 text-white flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-white/70 mr-2">{t('history_tab.date_label')}</span>
                      <span>{calc.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/70 mr-2">{t('history_tab.sales_label')}</span>
                      <span>{formatCurrency(calc.salesAmount)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/70 mr-2">{t('history_tab.rate_label')}</span>
                      <span>{calc.commissionRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end space-x-4">
                    <span className="text-green-400 font-bold text-lg">
                      {formatCurrency(calc.commissionValue)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCalculation(calc.id)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      disabled
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/50 text-center">
              <p>{t('history_tab.main_interface_info')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HistoryTab;
