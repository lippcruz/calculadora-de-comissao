
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

const MAX_HISTORY_ITEMS = 50;

export const useCommissionCalculator = () => {
  const { toast } = useToast();
  const [salesAmount, setSalesAmount] = useState("");
  const [commissionRate, setCommissionRate] = useState(10);
  const [commissionResult, setCommissionResult] = useState(null);
  const [history, setHistory] = useState([]);

  const parseInputAsFloat = (input) => {
    if (typeof input === 'number') return input;
    if (typeof input !== 'string') return NaN;
    return parseFloat(input.replace(",", "."));
  };

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("commissionHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico do localStorage:", error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar os cálculos salvos.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem("commissionHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Erro ao salvar histórico no localStorage:", error);
    }
  }, [history]);

  const calculateCommission = useCallback(() => {
    const sales = parseInputAsFloat(salesAmount);
    const rate = parseInputAsFloat(commissionRate);

    if (isNaN(sales) || sales < 0 || isNaN(rate) || rate < 0 || rate > 100) {
      setCommissionResult(null);
      if (salesAmount !== "" || commissionRate !== "") { 
        if (isNaN(sales) || sales < 0) {
          toast({ title: "Valor de Venda Inválido", description: "Insira um valor de venda positivo.", variant: "destructive"});
        }
        if (isNaN(rate) || rate < 0 || rate > 100) {
          toast({ title: "Taxa de Comissão Inválida", description: "A taxa deve ser entre 0 e 100.", variant: "destructive"});
        }
      }
      return;
    }

    const commissionValue = (sales * rate) / 100;
    setCommissionResult({
      salesAmount: sales,
      commissionRate: rate,
      commissionValue: commissionValue,
      timestamp: new Date().toISOString(),
    });
  }, [salesAmount, commissionRate, toast]);

  useEffect(() => {
    calculateCommission();
  }, [salesAmount, commissionRate, calculateCommission]);

  const handleSalesAmountChange = (value) => {
    setSalesAmount(value);
  };

  const handleCommissionRateChange = (value) => {
    const rate = Array.isArray(value) ? value[0] : parseInputAsFloat(value);
    if (!isNaN(rate) && rate >= 0 && rate <= 100) {
      setCommissionRate(rate);
    } else if (value === "" || value === "." || value === ",") {
       setCommissionRate(value); 
    }
  };
  
  const handleCommissionRateInputChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setCommissionRate("");
      return;
    }
    const parsedValue = parseInputAsFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setCommissionRate(parsedValue);
    } else if (/^[\d.,]*$/.test(value)) {
       setCommissionRate(value);
    }
  };


  const saveToHistory = useCallback(() => {
    if (commissionResult && commissionResult.salesAmount > 0 && commissionResult.commissionRate >= 0) {
      const newHistoryEntry = { ...commissionResult, id: Date.now() };
      setHistory(prevHistory => [newHistoryEntry, ...prevHistory.slice(0, MAX_HISTORY_ITEMS - 1)]);
      toast({
        title: "Cálculo Guardado",
        description: "O resultado foi adicionado ao histórico.",
      });
    } else {
      toast({
        title: "Não é possível guardar",
        description: "O cálculo atual não é válido ou está incompleto.",
        variant: "destructive",
      });
    }
  }, [commissionResult, toast]);

  const deleteHistoryItem = useCallback((id) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    toast({
      title: "Item Removido",
      description: "O cálculo foi removido do histórico.",
    });
  }, [toast]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    toast({
      title: "Histórico Limpo",
      description: "Todos os cálculos foram removidos do histórico.",
    });
  }, [toast]);

  const formatCurrency = useCallback((value) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0);
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value));
  }, []);

  return {
    salesAmount,
    handleSalesAmountChange,
    commissionRate,
    handleCommissionRateChange,
    handleCommissionRateInputChange,
    commissionResult,
    history,
    saveToHistory,
    deleteHistoryItem,
    clearHistory,
    formatCurrency,
    parseInputAsFloat
  };
};
