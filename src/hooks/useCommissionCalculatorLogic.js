
import { useState, useEffect, useCallback } from 'react';
import { uid } from 'uid';
import { 
  parseInputAsFloat as utilParseInputAsFloat, 
  formatNumberForDisplay as utilFormatNumberForDisplay,
  formatPercentageForDisplay as utilFormatPercentageForDisplay,
  capitalizeWords as utilCapitalizeWords,
  exportToCSVUtil,
  formatReferenceMonthForStorage,
  validateReferenceMonthInput
} from '@/lib/calculatorUtils';

const HISTORY_STORAGE_KEY = 'commissionHistory_v5_generic_currency';

export const useCommissionCalculatorLogic = (toast) => {
  const [salesAmount, setSalesAmount] = useState("");
  const [commissionRate, setCommissionRate] = useState("5");
  const [commissionResult, setCommissionResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [sellerName, setSellerName] = useState("");
  const [referenceMonthInput, setReferenceMonthInput] = useState(""); 

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
        if (parsedHistory.length > 0) {
          setShowTable(true);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar a tabela do localStorage:", error);
      toast({ title: "Erro de Carregamento", description: "Não foi possível carregar os dados da tabela. Tente recarregar a página.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Erro ao salvar a tabela no localStorage:", error);
      toast({ title: "Erro ao Salvar", description: "Não foi possível salvar as alterações na tabela.", variant: "destructive" });
    }
  }, [history, toast]);

  const calculateCommission = useCallback(() => {
    const sales = utilParseInputAsFloat(salesAmount, true); // Allow integers without decimal
    const rate = utilParseInputAsFloat(commissionRate);
    
    let processedMonthForStorage = "none";
    if (isAdvancedMode && referenceMonthInput.trim() !== "") {
      const {isValid, formattedMonth} = validateReferenceMonthInput(referenceMonthInput);
      if (isValid) {
        processedMonthForStorage = formatReferenceMonthForStorage(formattedMonth); 
      } else {
        processedMonthForStorage = "invalid"; 
      }
    } else if (isAdvancedMode && referenceMonthInput.trim() === "") {
        processedMonthForStorage = "none";
    }

    if (isNaN(sales) || sales <= 0 || isNaN(rate) || rate < 0 || rate > 100) {
      setCommissionResult(null);
      return;
    }

    const commissionValue = (sales * rate) / 100;
    setCommissionResult({
      salesAmount: sales,
      commissionRate: rate,
      commissionValue: commissionValue,
      sellerName: isAdvancedMode ? utilCapitalizeWords(sellerName) : null,
      referenceMonth: processedMonthForStorage,
    });
  }, [salesAmount, commissionRate, sellerName, referenceMonthInput, isAdvancedMode]);

  useEffect(() => {
    calculateCommission();
  }, [calculateCommission]);

  const handleSalesAmountChange = (value) => {
    const regex = /^[0-9]*[,.]?[0-9]{0,2}$/;
    const onlyNumbersRegex = /^[0-9]+$/;

    if (value === "") {
        setSalesAmount("");
    } else if (onlyNumbersRegex.test(value)) { // Allows only numbers, e.g., 1250
        setSalesAmount(value);
    } else if (regex.test(value.replace(/\./g, ''))) { // Allows numbers with comma/dot for decimals
        const sanitizedValue = value.replace(/\.(?=.*\.)/g, ''); 
        setSalesAmount(sanitizedValue);
    }
  };
  
  const handleCommissionRateInputChange = (value) => {
    const regex = /^[0-9]{1,3}([,.]?[0-9]{0,2})?$/; 
    if (value === "" || regex.test(value.replace(/\./g, ''))) {
        let sanitizedValue = value.replace(/\.(?=.*\.)/g, '');
        const floatValue = utilParseInputAsFloat(sanitizedValue);
        if (floatValue > 100) {
            sanitizedValue = "100";
        }
        setCommissionRate(sanitizedValue);
    }
  };

  const handleCommissionRateSliderChange = (value) => {
    const rate = Array.isArray(value) ? value[0] : value;
    setCommissionRate(String(rate));
  };

  const saveToTable = () => {
    if (isAdvancedMode && referenceMonthInput.trim() !== "") {
        const { isValid, error } = validateReferenceMonthInput(referenceMonthInput);
        if (!isValid) {
            toast({ title: "Mês de Referência Inválido", description: error || "Por favor, insira o mês no formato MM/AAAA ou MM/AA.", variant: "destructive" });
            return;
        }
    }
    
    if (commissionResult && commissionResult.salesAmount > 0 && commissionResult.commissionRate >= 0 && commissionResult.commissionRate <= 100 && commissionResult.referenceMonth !== "invalid") {
      const newEntry = {
        id: uid(),
        salesAmount: commissionResult.salesAmount,
        commissionRate: commissionResult.commissionRate,
        commissionValue: commissionResult.commissionValue,
        sellerName: commissionResult.sellerName,
        referenceMonth: commissionResult.referenceMonth,
      };
      setHistory(prevHistory => [newEntry, ...prevHistory.slice(0, 49)]);
      toast({ title: "Salvo!", description: "Cálculo adicionado à tabela.", className: "bg-green-600 text-white border-green-700" });
      if (!showTable) {
        setShowTable(true);
      }
    } else if (commissionResult && commissionResult.referenceMonth === "invalid") {
        toast({ title: "Mês de Referência Inválido", description: "Por favor, corrija o mês antes de salvar.", variant: "destructive" });
    } else {
      toast({ title: "Atenção", description: "Preencha os valores corretamente para salvar. A taxa de comissão deve ser entre 0 e 100%.", variant: "destructive" });
    }
  };

  const deleteHistoryItem = (id) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    toast({ title: "Excluído!", description: "Item removido da tabela.", className: "bg-yellow-500 text-black border-yellow-600" });
  };

  const clearHistory = () => {
    setHistory([]);
    toast({ title: "Tabela Limpa!", description: "Todos os itens foram removidos.", variant: "destructive" });
  };

  const toggleTable = () => setShowTable(!showTable);

  const toggleAdvancedMode = () => setIsAdvancedMode(!isAdvancedMode);

  const handleSellerNameChange = (e) => setSellerName(e.target.value);

  const handleReferenceMonthChange = (e) => {
    const rawInput = e.target.value;
    setReferenceMonthInput(rawInput);
  };
  
  const updateSellerInHistory = (id, newName) => {
    setHistory(prevHistory =>
      prevHistory.map(item =>
        item.id === id ? { ...item, sellerName: utilCapitalizeWords(newName) } : item
      )
    );
    toast({ title: "Atualizado!", description: "Nome do vendedor alterado.", className: "bg-blue-500 text-white border-blue-600" });
  };

  const updateReferenceMonthInHistory = (id, newMonthInput) => {
     if (newMonthInput.trim() !== "") {
        const { isValid, error, formattedMonth } = validateReferenceMonthInput(newMonthInput);
        if (!isValid) {
            toast({ title: "Mês de Referência Inválido", description: error || "Não foi possível atualizar o mês.", variant: "destructive" });
            return false; 
        }
        const newMonthForStorage = formatReferenceMonthForStorage(formattedMonth);
        setHistory(prevHistory =>
          prevHistory.map(item =>
            item.id === id ? { ...item, referenceMonth: newMonthForStorage } : item
          )
        );
        toast({ title: "Atualizado!", description: "Mês de referência alterado.", className: "bg-blue-500 text-white border-blue-600" });
        return true;
    } else { // Empty input means "None"
        setHistory(prevHistory =>
            prevHistory.map(item =>
              item.id === id ? { ...item, referenceMonth: "none" } : item
            )
        );
        toast({ title: "Atualizado!", description: "Mês de referência removido.", className: "bg-blue-500 text-white border-blue-600" });
        return true;
    }
  };

  const exportHistoryToCSV = () => {
    exportToCSVUtil(history, toast);
  };

  return {
    salesAmount,
    setSalesAmount,
    commissionRate,
    setCommissionRate,
    commissionResult,
    history,
    showTable,
    isAdvancedMode,
    sellerName,
    referenceMonth: referenceMonthInput, 
    handleSalesAmountChange,
    handleCommissionRateInputChange,
    handleCommissionRateSliderChange,
    saveToTable,
    deleteHistoryItem,
    clearHistory,
    toggleTable,
    toggleAdvancedMode,
    handleSellerNameChange,
    handleReferenceMonthChange,
    updateSellerInHistory,
    updateReferenceMonthInHistory,
    exportHistoryToCSV,
    parseInputAsFloat: utilParseInputAsFloat,
    formatNumberForDisplay: utilFormatNumberForDisplay,
    formatPercentageForDisplay: utilFormatPercentageForDisplay
  };
};
