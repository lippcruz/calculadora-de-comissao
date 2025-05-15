
import React from 'react';
import { motion } from 'framer-motion';

const CalculatorDisplay = ({ children, showHistory }) => {
  return (
    <motion.div
      layout 
      transition={{ type: "spring", stiffness: 260, damping: 25, duration: 0.5 }}
      className={`w-full ${showHistory ? 'lg:w-1/2' : 'lg:w-3/5 lg:max-w-2xl'} mb-6 lg:mb-0`} 
    >
      {children}
    </motion.div>
  );
};

export default CalculatorDisplay;
