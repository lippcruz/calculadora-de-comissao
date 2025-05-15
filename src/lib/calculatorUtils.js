
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const capitalizeWords = (str) => {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

export const validateReferenceMonthInput = (value) => {
  const cleaned = value.replace(/[^0-9/]/g, '');
  if (cleaned.trim() === "") return { isValid: true, formattedMonth: "", error: null }; 

  const parts = cleaned.split('/');
  if (parts.length !== 2) {
    return { isValid: false, formattedMonth: cleaned, error: "Formato inválido. Use MM/AAAA ou MM/AA." };
  }

  let monthStr = parts[0];
  let yearStr = parts[1];

  if (monthStr.length === 0 || yearStr.length === 0) {
    return { isValid: false, formattedMonth: cleaned, error: "Mês e ano são obrigatórios." };
  }
  if (monthStr.length > 2 || (yearStr.length !== 2 && yearStr.length !== 4)) {
     return { isValid: false, formattedMonth: cleaned, error: "Mês deve ter 1-2 dígitos, ano 2 ou 4." };
  }
  
  const month = parseInt(monthStr, 10);
  if (isNaN(month) || month < 1 || month > 12) {
    return { isValid: false, formattedMonth: cleaned, error: "Mês inválido. Use um valor entre 01 e 12." };
  }

  let year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    return { isValid: false, formattedMonth: cleaned, error: "Ano inválido." };
  }

  if (yearStr.length === 2) {
    const currentCentury = Math.floor(new Date().getFullYear() / 100) * 100;
    year += currentCentury;
    if (year > new Date().getFullYear() + 50) { 
        year -= 100;
    }
  }
  
  if (year < 1900 || year > 2100) {
    return { isValid: false, formattedMonth: cleaned, error: "Ano inválido. Use um valor entre 1900 e 2100." };
  }
  
  const monthFinal = monthStr.padStart(2, '0');
  const yearFinal = year.toString();

  return { isValid: true, formattedMonth: `${monthFinal}/${yearFinal}`, error: null };
};


export const parseReferenceMonthInput = (input) => {
  if (!input || typeof input !== 'string') return null;
  const {isValid, formattedMonth} = validateReferenceMonthInput(input);
  if (!isValid || !formattedMonth) return null;
  
  const parts = formattedMonth.split('/');
  if (parts.length === 2) {
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
     if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
      return new Date(year, month - 1);
    }
  }
  return null; 
};

export const formatReferenceMonthForStorage = (formattedInput) => {
  if (!formattedInput || formattedInput.trim() === "") return "none";
  const date = parseReferenceMonthInput(formattedInput); 
  if (date && isValid(date)) {
    return format(date, 'yyyy-MM');
  }
  return "invalid"; 
};

export const formatReferenceMonthForDisplay = (storageValue, forInput = false) => {
  if (!storageValue || storageValue === "none") {
    return forInput ? "" : "Nenhum";
  }
  if (storageValue === "invalid") {
    return forInput ? "" : "Inválido";
  }
  try {
    const date = parse(storageValue, 'yyyy-MM', new Date());
    if (isValid(date)) {
      return format(date, 'MM/yyyy', { locale: ptBR });
    }
  } catch (e) {
    return forInput ? storageValue : "Inválido";
  }
  return forInput ? storageValue : "Inválido"; 
};


export const parseInputAsFloat = (input) => {
    if (typeof input === 'number') return input;
    if (typeof input !== 'string' || input.trim() === "") return NaN;
    
    const cleanedValue = input.replace(',', '.'); // Standardize decimal separator to dot
    const num = parseFloat(cleanedValue);
    return isNaN(num) ? NaN : num;
};

export const formatNumberForDisplay = (num) => {
  const parsedNum = parseInputAsFloat(num); 
  if (isNaN(parsedNum) || parsedNum === null || parsedNum === undefined) return "";
  return parsedNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatPercentageForDisplay = (numStr) => {
  const num = parseInputAsFloat(numStr);
  if (isNaN(num) || num === null || num === undefined) return "";
  if (num === 0) return "0"; 
  
  let formatted = num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); 
  if (formatted.includes(',')) {
    const parts = formatted.split(',');
    if (parts[1] === '0' || parts[1] === '00') { 
        formatted = parts[0];
    } else if (parts[1].endsWith('0') && parts[1].length > 1) { 
        formatted = `${parts[0]},${parts[1].substring(0, parts[1].length -1)}`;
    }
  }
  return formatted;
};

export const exportToCSVUtil = (history, toast) => { 
    const noDataToExportTitle = 'Tabela Vazia';
    const noDataToExportDesc = 'Não há dados para exportar.';
    const exportCompleteTitle = 'Exportação Concluída!';
    const exportCompleteDesc = 'O arquivo CSV foi baixado.';
    const exportFailedTitle = 'Exportação Falhou';
    const exportFailedDesc = 'Seu navegador não suporta a exportação direta.';
    
    const displayReferenceMonthForCSV = (storageValue) => {
      if (!storageValue || storageValue === "none") return "Nenhum";
      if (storageValue === "invalid") return "Inválido";
      try {
        const date = parse(storageValue, 'yyyy-MM', new Date());
        if (isValid(date)) {
          return format(date, 'MM/yyyy', { locale: ptBR });
        }
      } catch (e) {
         return "Inválido";
      }
      return "Inválido";
    };

    if (history.length === 0) {
      toast({
        title: noDataToExportTitle,
        description: noDataToExportDesc,
        variant: "destructive",
      });
      return;
    }

    const rows = history.map(item => {
      const refMonth = displayReferenceMonthForCSV(item.referenceMonth);
      const seller = item.sellerName || 'N/A';
      
      const sales = Number(item.salesAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
      const rate = Number(item.commissionRate).toLocaleString('pt-BR', { minimumFractionDigits: (Number(item.commissionRate) % 1 === 0) ? 0 : 2, maximumFractionDigits: 2, useGrouping: false });
      const commission = Number(item.commissionValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });

      return `"${seller}";"${refMonth}";"${sales}";"${rate}";"${commission}"`;
    }).join("\n");
    
    const csvHeaders = ["Vendedor", "Mês de Referência", "Valor da Venda ($)", "Taxa de Comissão (%)", "Valor da Comissão ($)"];
    const csvContent = csvHeaders.join(';') + "\n" + rows;

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "tabela_comissoes.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: exportCompleteTitle,
        description: exportCompleteDesc,
        className: "bg-green-600 text-white border-green-700"
      });
    } else {
        toast({
            title: exportFailedTitle,
            description: exportFailedDesc,
            variant: "destructive",
        });
    }
};
