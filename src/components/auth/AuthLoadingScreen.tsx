
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AuthLoadingScreenProps {
  onSkipLoading: () => void;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ onSkipLoading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
          <p className="text-xs text-gray-400 mt-2">Checking authentication status...</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSkipLoading}
            className="mt-4"
          >
            Skip Loading
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLoadingScreen;
