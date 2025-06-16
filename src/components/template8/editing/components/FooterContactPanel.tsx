
import React from "react";
import { motion } from "framer-motion";
import { X, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FooterContactPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const FooterContactPanel: React.FC<FooterContactPanelProps> = ({
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
              <Mail className="w-5 h-5" />
              Contact Information
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
            <Label htmlFor="contactEmail" className="text-sm font-medium">
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={pageData.contactEmail || ""}
              onChange={(e) => onUpdate({ contactEmail: e.target.value })}
              placeholder="hello@business.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={pageData.phoneNumber || ""}
              onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
              placeholder="(555) 123-4567"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="businessAddress" className="text-sm font-medium">
              Business Address
            </Label>
            <textarea
              id="businessAddress"
              value={pageData.businessAddress || ""}
              onChange={(e) => onUpdate({ businessAddress: e.target.value })}
              placeholder="123 Business Street, City, State 12345"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FooterContactPanel;
