
import React from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const SettingsTab = ({
  commissionRules,
  newRule,
  setNewRule,
  addCommissionRule,
  deleteCommissionRule,
}) => {
  const formatRuleValue = (value) => {
    if (value === null || value === undefined) return "";
    if (value === Infinity || value.toString().toLowerCase() === "infinity") return "∞";
    const num = parseFloat(value.toString().replace(",","."));
    return isNaN(num) ? value : num.toLocaleString('pt-BR');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Regras de Comissão (Opcional)</CardTitle>
          <CardDescription className="text-white/70">
            Esta aba é de uma versão anterior e não é usada na calculadora atual.
            A calculadora agora usa uma porcentagem única definida pelo usuário.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 opacity-50 cursor-not-allowed">
            <h3 className="text-lg font-medium text-white">Regras Atuais (Não Utilizadas)</h3>
            
            {commissionRules && commissionRules.length > 0 ? (
              <div className="space-y-2">
                {commissionRules.map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-lg bg-white/10 text-white flex items-center justify-between"
                  >
                    <div>
                      <span>
                        {formatRuleValue(rule.min)} até {formatRuleValue(rule.max)}
                      </span>
                      <span className="mx-2">→</span>
                      <span className="font-bold">{formatRuleValue(rule.rate)}%</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCommissionRule(index)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      disabled
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-white/10 text-white/70 text-center">
                <p>Nenhuma regra configurada.</p>
              </div>
            )}
          </div>

          <div className="space-y-4 opacity-50 cursor-not-allowed">
            <h3 className="text-lg font-medium text-white">Adicionar Nova Regra (Não Utilizado)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minValue" className="text-white">
                  Valor Mínimo (R$)
                </Label>
                <Input
                  id="minValue"
                  type="text" 
                  value={newRule.min}
                  onChange={(e) => setNewRule({...newRule, min: e.target.value})}
                  className="bg-white/10 text-white border-white/20 focus:border-white"
                  placeholder="0"
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxValue" className="text-white">
                  Valor Máximo (R$)
                </Label>
                <Input
                  id="maxValue"
                  type="text" 
                  value={newRule.max}
                  onChange={(e) => setNewRule({...newRule, max: e.target.value})}
                  className="bg-white/10 text-white border-white/20 focus:border-white"
                  placeholder="1000 ou Infinity"
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rateValue" className="text-white">
                  Taxa de Comissão (%)
                </Label>
                <Input
                  id="rateValue"
                  type="number"
                  min="0"
                  step="0.1"
                  value={newRule.rate}
                  onChange={(e) => setNewRule({...newRule, rate: e.target.value})}
                  className="bg-white/10 text-white border-white/20 focus:border-white"
                  placeholder="5"
                  disabled
                />
              </div>
            </div>
            
            <Button 
              onClick={addCommissionRule}
              className="w-full bg-white text-indigo-700 hover:bg-white/90"
              disabled
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Regra
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsTab;
