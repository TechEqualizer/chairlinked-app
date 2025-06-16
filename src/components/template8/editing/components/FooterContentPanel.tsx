
import React from "react";
import { motion } from "framer-motion";
import { X, Type } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface FooterContentPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const FooterContentPanel: React.FC<FooterContentPanelProps> = ({
  pageData,
  onUpdate,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 z-50 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <Card className="shadow-xl border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Type className="w-5 h-5" />
              Content & Description
            </CardTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footerDescription" className="text-sm font-medium">
              Footer Description
            </Label>
            <textarea
              id="footerDescription"
              value={pageData.footerDescription || "Transform your vision into reality with our premium creative services. We craft beautiful, functional designs that tell your story."}
              onChange={(e) => onUpdate({ footerDescription: e.target.value })}
              placeholder="Transform your vision into reality with our premium creative services..."
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Brief description of your business or services
            </p>
          </div>

          <div>
            <Label htmlFor="copyrightText" className="text-sm font-medium">
              Copyright Text
            </Label>
            <textarea
              id="copyrightText"
              value={pageData.copyrightText || `© 2024 ${pageData.businessName}. All rights reserved.`}
              onChange={(e) => onUpdate({ copyrightText: e.target.value })}
              placeholder="© 2024 Business Name. All rights reserved."
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FooterContentPanel;
