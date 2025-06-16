
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const QuickTipsCard: React.FC = () => {
  return (
    <Card className="border-green-100 bg-green-50/50">
      <CardContent className="pt-4">
        <h4 className="font-medium text-green-800 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Upload a clear, high-quality logo for the best impression</li>
          <li>• Square or horizontal logos work best for navigation bars</li>
          <li>• Business name is required as fallback if logo fails to load</li>
          <li>• Choose colors that match your brand identity</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default QuickTipsCard;
