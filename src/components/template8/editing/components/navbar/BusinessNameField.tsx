
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BusinessNameFieldProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  pushToHistory: (data: any) => void;
  markDirty: () => void;
}

const BusinessNameField: React.FC<BusinessNameFieldProps> = ({
  pageData,
  onUpdate,
  pushToHistory,
  markDirty
}) => {
  const { toast } = useToast();
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    pushToHistory(pageData);
    onUpdate({ businessName: value });
    markDirty();
    
    if (value.length > 50) {
      toast({
        title: "Business name is quite long",
        description: "Consider shortening it for better display on mobile devices.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
        Business Name {!pageData.logoUrl && <span className="text-red-500">*</span>}
        {pageData.logoUrl && <span className="text-xs text-gray-500 ml-2">(fallback)</span>}
      </Label>
      <Input
        id="businessName"
        value={pageData.businessName || ""}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="e.g., Bella's Beauty Studio"
        className="mt-1"
        onFocus={() => setActiveField("businessName")}
        onBlur={() => setActiveField(null)}
      />
      {activeField === "businessName" && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-blue-600 mt-1"
        >
          {pageData.logoUrl 
            ? "Shows when logo isn't available or as screen reader text" 
            : "This appears prominently in your navigation bar"
          }
        </motion.p>
      )}
    </div>
  );
};

export default BusinessNameField;
