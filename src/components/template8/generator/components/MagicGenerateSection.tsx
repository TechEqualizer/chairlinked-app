
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MagicGenerateSectionProps {
  businessName: string;
  industry: string;
  isGenerating: boolean;
  onMagicGenerate: () => void;
}

const MagicGenerateSection: React.FC<MagicGenerateSectionProps> = ({
  businessName,
  industry,
  isGenerating,
  onMagicGenerate
}) => {
  if (!businessName || !industry) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-purple-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Magic Generate
          </h3>
          <p className="text-purple-700 text-sm mt-1">
            Let AI create a complete professional website instantly
          </p>
        </div>
        <button
          type="button"
          onClick={onMagicGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-800 to-blue-800 hover:from-purple-900 hover:to-blue-900 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isGenerating ? 'Generating...' : 'Generate Site'}
        </button>
      </div>
    </motion.div>
  );
};

export default MagicGenerateSection;
