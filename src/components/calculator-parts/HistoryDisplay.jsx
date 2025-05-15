
import React from 'react';
import { motion } from 'framer-motion';

const HistoryDisplay = ({ children }) => {
  return (
    <motion.div
      layout 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 260, damping: 25, duration: 0.5 }}
      className="w-full lg:w-1/2 flex flex-col" 
    >
      {children}
    </motion.div>
  );
};

export default HistoryDisplay;
