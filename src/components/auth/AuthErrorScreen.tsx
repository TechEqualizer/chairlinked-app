
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface AuthErrorScreenProps {
  authError: string | null;
  onTryAgain: () => void;
  onRefresh: () => void;
}

const AuthErrorScreen: React.FC<AuthErrorScreenProps> = ({ 
  authError, 
  onTryAgain, 
  onRefresh 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
          <p className="text-red-600 mb-4">
            {authError || 'Authentication timeout'}
          </p>
          <p className="text-gray-600 text-center mb-4">
            There was an issue with authentication. You can try again or proceed to login.
          </p>
          <div className="space-y-2 w-full">
            <Button onClick={onTryAgain} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={onRefresh} className="w-full">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthErrorScreen;
