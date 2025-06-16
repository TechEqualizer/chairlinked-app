
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle } from "lucide-react";

interface ProgressCardProps {
  pageData: any;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ pageData }) => {
  const getCompletionStatus = () => {
    const checks = [
      { field: 'logo', label: 'Logo or business name', completed: !!(pageData.logoUrl || pageData.businessName) },
      { field: 'ctaText', label: 'Call-to-action', completed: !!pageData.ctaText },
      { field: 'brandColor', label: 'Brand color', completed: !!pageData.brandColor }
    ];
    
    const completed = checks.filter(c => c.completed).length;
    return { completed, total: checks.length, checks };
  };

  const { completed, total, checks } = getCompletionStatus();

  return (
    <Card className="border-blue-100 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Setup Progress
          </CardTitle>
          <Badge variant={completed === total ? "default" : "secondary"}>
            {completed}/{total}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {checks.map((check) => (
            <div key={check.field} className="flex items-center gap-2">
              <CheckCircle 
                className={`w-4 h-4 transition-colors ${
                  check.completed ? 'text-green-500' : 'text-gray-300'
                }`} 
              />
              <span className={`text-sm transition-colors ${
                check.completed ? 'text-green-700' : 'text-gray-600'
              }`}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
