
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';

interface ClaimFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const ClaimFormActions: React.FC<ClaimFormActionsProps> = ({
  isSubmitting,
  onCancel
}) => {
  return (
    <div className="pt-3 sm:pt-2 space-y-2 sm:space-y-1.5">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 sm:h-8 px-4 sm:px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg sm:rounded-md font-semibold sm:font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none text-sm sm:text-xs"
      >
        <span className="flex items-center justify-center gap-2 sm:gap-1.5">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin" />
              <span className="hidden sm:inline">Creating...</span>
              <span className="sm:hidden">Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Create & Claim</span>
              <span className="sm:hidden">Create Account & Claim Site</span>
            </>
          )}
        </span>
      </button>
      
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full h-9 sm:h-7 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm sm:text-xs rounded-lg sm:rounded-md"
      >
        Cancel
      </Button>
    </div>
  );
};
