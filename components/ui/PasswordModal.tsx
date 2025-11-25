import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctKey?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess, correctKey }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInput('');
      setError(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === correctKey) {
      onSuccess();
      onClose();
    } else {
      setError(true);
      // Shake animation trigger
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                x: error ? [0, -10, 10, -10, 10, 0] : 0 
              }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ 
                type: "spring", 
                duration: 0.5,
                x: { duration: 0.4 } // Shake duration
              }}
              className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl pointer-events-auto relative overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50 cursor-hover-trigger"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-water-50 rounded-full flex items-center justify-center mb-6 text-water-500">
                  <Lock size={24} />
                </div>
                
                <h3 className="text-2xl font-serif italic text-slate-900 mb-2">Protected Project</h3>
                <p className="text-slate-500 font-sans text-sm mb-8">
                  This project requires a password to view.
                </p>

                <form onSubmit={handleSubmit} className="w-full relative">
                  <input
                    type="password"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter Password"
                    className={`w-full px-4 py-3 bg-slate-50 border ${error ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-water-400'} rounded-lg outline-none transition-colors text-center text-slate-900 font-sans tracking-widest placeholder:tracking-normal placeholder:text-slate-400`}
                    autoFocus
                  />
                  {error && (
                    <p className="absolute -bottom-6 left-0 w-full text-center text-xs text-red-500 font-medium">
                      Incorrect password. Please try again.
                    </p>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-water-600 transition-colors cursor-hover-trigger"
                  >
                    Unlock
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PasswordModal;