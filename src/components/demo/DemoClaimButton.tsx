
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DemoClaimModal } from './DemoClaimModal';
import { DemoStatus } from '@/types/demoTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Sparkles, Clock, Zap, CheckCircle } from 'lucide-react';

interface DemoClaimButtonProps {
  demoStatus: DemoStatus;
  demoSiteId: string;
  businessName: string;
}

export const DemoClaimButton: React.FC<DemoClaimButtonProps> = ({
  demoStatus,
  demoSiteId,
  businessName
}) => {
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlreadyClaimed, setIsAlreadyClaimed] = useState(false);
  const [isClaimedByCurrentUser, setIsClaimedByCurrentUser] = useState(false);
  const [checkingClaim, setCheckingClaim] = useState(true);

  console.log('[DemoClaimButton] Component render:', {
    demoSiteId,
    businessName,
    user: user?.email,
    isClaimedByCurrentUser,
    isAlreadyClaimed,
    checkingClaim
  });

  // Check if site is already claimed and by whom
  useEffect(() => {
    const checkExistingClaim = async () => {
      const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
      
      if (isDevMode) {
        console.log('[DemoClaimButton] Starting dev mode check:', {
          demoSiteId,
          userEmail: user?.email,
          hasUser: !!user
        });
        
        // Check localStorage to see if current user claimed this site
        const claimedDemoInfo = localStorage.getItem('dev_claimed_demo_info');
        console.log('[DemoClaimButton] localStorage data:', claimedDemoInfo);
        
        if (claimedDemoInfo) {
          try {
            const demoInfo = JSON.parse(claimedDemoInfo);
            // In dev mode, if localStorage has claim info for this demo site, 
            // we assume the current session user claimed it
            const currentUserClaimedThis = demoInfo.demoSiteId === demoSiteId;
            
            console.log('[DemoClaimButton] Dev mode claim check:', {
              demoSiteId,
              userEmail: user?.email,
              storedInfo: demoInfo,
              demoSiteIdMatch: demoInfo.demoSiteId === demoSiteId,
              currentUserClaimedThis
            });
            
            setIsClaimedByCurrentUser(currentUserClaimedThis);
            // For others, simulate some claimed sites
            const otherClaimedSites = ['demo-2']; // hair-salon-demo claimed by someone else
            setIsAlreadyClaimed(otherClaimedSites.includes(demoSiteId) && !currentUserClaimedThis);
          } catch (e) {
            console.log('Could not parse claimed demo info:', e);
            setIsClaimedByCurrentUser(false);
            setIsAlreadyClaimed(false);
          }
        } else {
          console.log('[DemoClaimButton] No claim info in localStorage');
          // No claim info, check general claimed status
          const claimedSites = ['demo-2']; 
          setIsAlreadyClaimed(claimedSites.includes(demoSiteId));
          setIsClaimedByCurrentUser(false);
        }
        
        setCheckingClaim(false);
        return;
      }

      try {
        // Check if current user claimed this site
        if (user?.email) {
          const { data: userClaimData, error: userClaimError } = await supabase
            .from('demo_prospect_leads')
            .select('id, email')
            .eq('demo_site_id', demoSiteId)
            .eq('email', user.email)
            .maybeSingle();

          if (userClaimError) {
            console.error('Error checking user claim:', userClaimError);
          } else if (userClaimData) {
            setIsClaimedByCurrentUser(true);
            setIsAlreadyClaimed(false);
            setCheckingClaim(false);
            return;
          }
        }

        // Check if anyone else claimed this site
        const { data, error } = await supabase
          .from('demo_prospect_leads')
          .select('id')
          .eq('demo_site_id', demoSiteId)
          .maybeSingle();

        if (error) {
          console.error('Error checking existing claim:', error);
        } else {
          setIsAlreadyClaimed(!!data);
          setIsClaimedByCurrentUser(false);
        }
      } catch (error) {
        console.error('Error checking existing claim:', error);
      } finally {
        setCheckingClaim(false);
      }
    };

    if (demoSiteId) {
      checkExistingClaim();
    }
  }, [demoSiteId, user?.email]);

  const handleOpenModal = () => {
    if (isAlreadyClaimed) return;
    console.log('DemoClaimButton: Opening modal', { demoSiteId, businessName });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('DemoClaimButton: Closing modal');
    setIsModalOpen(false);
  };

  // Hide button completely if current user has already claimed this site
  if (isClaimedByCurrentUser) {
    console.log('[DemoClaimButton] Current user has claimed this site - hiding button', {
      demoSiteId,
      userEmail: user?.email,
      isClaimedByCurrentUser
    });
    return null;
  }

  if (checkingClaim) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          disabled
          className="bg-gray-400 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-2xl border-2 border-gray-300 text-sm sm:text-base"
          size="lg"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="hidden sm:inline">Checking...</span>
          <span className="sm:hidden">...</span>
        </Button>
      </div>
    );
  }

  if (isAlreadyClaimed) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          disabled
          className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-2xl border-2 border-green-400 cursor-not-allowed text-sm sm:text-base"
          size="lg"
        >
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="hidden sm:inline">Already Claimed</span>
          <span className="sm:hidden">Claimed</span>
        </Button>
      </div>
    );
  }

  if (demoStatus.isExpired) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={handleOpenModal}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-2xl border-2 border-red-400 animate-pulse text-sm sm:text-base touch-manipulation"
          size="lg"
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="hidden sm:inline">Demo Expired - Claim Now!</span>
          <span className="sm:hidden">Claim Now!</span>
        </Button>
        <DemoClaimModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          demoSiteId={demoSiteId}
          businessName={businessName}
          isExpired={true}
        />
      </div>
    );
  }

  const getButtonStyle = () => {
    if (demoStatus.isUrgent) {
      return "bg-orange-600 hover:bg-orange-700 text-white border-orange-400 animate-pulse";
    }
    return "bg-purple-600 hover:bg-purple-700 text-white border-purple-400";
  };

  const getIcon = () => {
    if (demoStatus.isUrgent) {
      return <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />;
    }
    return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />;
  };

  const getButtonText = () => {
    if (demoStatus.isUrgent) {
      return {
        desktop: `${demoStatus.timeRemainingFormatted} left - Claim Now!`,
        mobile: "Claim Now!"
      };
    }
    return {
      desktop: "Claim Your Site",
      mobile: "Claim Site"
    };
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className="relative">
        {/* Breathing animation background */}
        <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-30" />
        
        <Button
          onClick={handleOpenModal}
          className={`relative px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-2xl border-2 transition-all duration-300 text-sm sm:text-base touch-manipulation ${getButtonStyle()}`}
          size="lg"
        >
          {getIcon()}
          <span className="hidden sm:inline">{getButtonText().desktop}</span>
          <span className="sm:hidden">{getButtonText().mobile}</span>
        </Button>
      </div>
      
      <DemoClaimModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        demoSiteId={demoSiteId}
        businessName={businessName}
        timeRemaining={demoStatus.timeRemainingFormatted}
      />
    </div>
  );
};
