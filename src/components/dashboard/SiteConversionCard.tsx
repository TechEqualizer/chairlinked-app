
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePaymentSuccess } from '@/hooks/usePaymentSuccess';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface SiteConversionCardProps {
  claimedSite: {
    id: string;
    business_name: string;
    site_type: string;
    status: string;
  };
}

export const SiteConversionCard: React.FC<SiteConversionCardProps> = ({ claimedSite }) => {
  const [converting, setConverting] = useState(false);
  const { manualConvertToLive } = usePaymentSuccess();

  const handleConvertToLive = async () => {
    setConverting(true);
    try {
      await manualConvertToLive();
    } finally {
      setConverting(false);
    }
  };

  const isDemo = claimedSite.site_type === 'demo';
  const isLive = claimedSite.site_type === 'live';

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Site Status</span>
          <Badge variant={isLive ? "default" : "secondary"}>
            {isLive ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Live
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Demo
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>{claimedSite.business_name}</strong>
            </p>
            {isDemo && (
              <p className="text-sm text-orange-600">
                Your site is currently in demo mode. Convert it to live to remove demo watermarks and claim buttons.
              </p>
            )}
            {isLive && (
              <p className="text-sm text-green-600">
                Your site is live and ready for customers! No demo elements will be shown.
              </p>
            )}
          </div>

          {isDemo && (
            <Button 
              onClick={handleConvertToLive}
              disabled={converting}
              className="w-full"
            >
              {converting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting to Live...
                </>
              ) : (
                'Convert to Live Site'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
