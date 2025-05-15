
import React from 'react';
import { motion } from 'framer-motion';

const CommissionResultDisplay = ({ commissionResult, formatCurrency }) => {
  if (!commissionResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="result-card-gradient p-6 rounded-xl text-center text-primary-foreground shadow-lg"
    >
      {commissionResult.sellerName && (
        <p className="text-sm font-medium text-primary-foreground/80">Vendedor: {commissionResult.sellerName}</p>
      )}
      {commissionResult.referenceMonth && (
        <p className="text-xs font-medium text-primary-foreground/70">Mês: {commissionResult.referenceMonth}</p>
      )}
      <p className="text-base font-medium mt-1">Sua comissão é</p>
      <p className="text-4xl lg:text-5xl font-bold my-1 tracking-tight">
        {formatCurrency(commissionResult.commissionValue)}
      </p>
      <p className="text-sm text-primary-foreground/80">
        {commissionResult.commissionRate}% de {formatCurrency(commissionResult.salesAmount)}
      </p>
    </motion.div>
  );
};

export default CommissionResultDisplay;
