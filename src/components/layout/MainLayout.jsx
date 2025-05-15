
import React from 'react';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen main-gradient-bg text-foreground p-4 md:p-8 transition-colors duration-300 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-xl mx-auto"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MainLayout;
