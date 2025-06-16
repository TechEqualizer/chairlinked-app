
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CompletionScreenProps {
  onComplete: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"
    >
      <div className="text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-12 h-12 text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Perfect! 🎉</h2>
        <p className="text-xl mb-8">Your website has been updated successfully!</p>
        <button
          onClick={onComplete}
          className="bg-white text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          Continue Editing
        </button>
      </div>
    </motion.div>
  );
};

export default CompletionScreen;
