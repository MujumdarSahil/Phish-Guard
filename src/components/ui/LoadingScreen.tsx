import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 0, 0],
        }}
        transition={{ 
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <ShieldCheck className="w-16 h-16 text-primary-600" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-lg font-medium text-gray-700"
      >
        Loading PhishGuard...
      </motion.p>
    </div>
  );
}