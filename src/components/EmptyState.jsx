import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, message, children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center p-12 bg-surface border border-border rounded-xl shadow-sm w-full h-full min-h-[300px]"
    >
      <div className="w-20 h-20 mb-6 bg-background rounded-full flex items-center justify-center border-2 border-border border-dashed text-text-secondary text-4xl shadow-inner">
        {icon || '📭'}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title || 'Nothing to see here'}</h3>
      <p className="text-text-secondary max-w-sm mb-8 text-sm leading-relaxed">
        {message || 'There is currently no content available in this section. Check back later!'}
      </p>
      {children && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </motion.div>
  );
}
