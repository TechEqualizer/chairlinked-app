
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CTAButtonFieldProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  pushToHistory: (data: any) => void;
  markDirty: () => void;
}

const CTAButtonField: React.FC<CTAButtonFieldProps> = ({
  pageData,
  onUpdate,
  pushToHistory,
  markDirty
}) => {
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    pushToHistory(pageData);
    onUpdate({ ctaText: value });
    markDirty();
  };

  return (
    <div>
      <Label htmlFor="ctaText" className="text-sm font-medium text-gray-700">
        Call-to-Action Button
      </Label>
      <Input
        id="ctaText"
        value={pageData.ctaText || ""}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="e.g., Book Now, Get Started, Contact Us"
        className="mt-1"
        onFocus={() => setActiveField("ctaText")}
        onBlur={() => setActiveField(null)}
      />
      {activeField === "ctaText" && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-blue-600 mt-1"
        >
          The main action you want visitors to take
        </motion.p>
      )}
    </div>
  );
};

export default CTAButtonField;
