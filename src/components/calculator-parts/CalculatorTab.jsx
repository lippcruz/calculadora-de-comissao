
import React from "react";
import { motion } from "framer-motion";
import { Calculator, Save, DollarSign, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const CalculatorTab = ({
  salesAmount,
  setSalesAmount,
  commissionRateInput,
  setCommissionRateInput,
  calculateCommission,
  commissionResult,
  saveCalculation,
  formatCurrency,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Dados da Venda (Não Utilizado)</CardTitle>
          <CardDescription className="text-white/70">
            Esta aba é de uma versão anterior e não é usada na calculadora atual.
            Use a interface principal para calcular.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 opacity-50 cursor-not-allowed">
          <div className="space-y-2">
            <Label htmlFor="salesAmountOld" className="text-white">
              Valor da Venda (R$)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                id="salesAmountOld"
                type="number"
                min="0"
                step="0.01"
                value={salesAmount}
                onChange={(e) => setSalesAmount(e.target.value)}
                className="pl-10 bg-white/10 text-white border-white/20 focus:border-white"
                placeholder="0,00"
                disabled
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="commissionRateInputOld" className="text-white">
              Taxa de Comissão (%)
            </Label>
            <div className="relative">
              <Percent className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                id="commissionRateInputOld"
                type="number"
                min="0"
                step="0.1"
                value={commissionRateInput}
                onChange={(e) => setCommissionRateInput(e.target.value)}
                className="pl-10 bg-white/10 text-white border-white/20 focus:border-white"
                placeholder="0,0"
                disabled
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="opacity-50 cursor-not-allowed">
          <Button 
            onClick={calculateCommission}
            className="w-full bg-white text-indigo-700 hover:bg-white/90"
            disabled
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Comissão
          </Button>
        </CardFooter>
      </Card>

      <Card className="glass-card opacity-50 cursor-not-allowed">
        <CardHeader>
          <CardTitle className="text-white">Resultado (Não Utilizado)</CardTitle>
          <CardDescription className="text-white/70">
            Detalhes do cálculo da comissão
          </CardDescription>
        </CardHeader>
        <CardContent>
          {commissionResult ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 text-white"
            >
              <div className="p-4 rounded-lg bg-white/10">
                <p className="text-sm text-white/70">Valor da Venda:</p>
                <p className="text-xl font-bold">
                  {formatCurrency(commissionResult.salesAmount)}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/10">
                <p className="text-sm text-white/70">Taxa de Comissão:</p>
                <p className="text-xl font-bold">
                  {commissionResult.commissionRate}%
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/10">
                <p className="text-sm text-white/70">Valor da Comissão:</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(commissionResult.commissionValue)}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/50 text-center">
              <p>Os resultados são exibidos na interface principal.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {commissionResult && (
            <Button 
              onClick={saveCalculation}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              disabled
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CalculatorTab;
