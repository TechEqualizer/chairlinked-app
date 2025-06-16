import { useState, useCallback, useEffect } from 'react';
import { defaultTemplate8Data } from '../config/defaultTemplate8Data';
import { Template8Data } from './useTemplate8Data';
import { useEnhancedSessionPersistence } from '@/hooks/useEnhancedSessionPersistence';

export const useEnhancedTemplate8DataPersistence = (businessName: string, initialData?: Partial<Template8Data>) => {
  const [pageData, setPageData] = useState<Template8Data>(() => {
    const baseData = {
      ...defaultTemplate8Data,
      businessName,
      navbarBackgroundColor: "#ffffff",
      heroImages: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
        "https://images.unsplash.com/photo-1557683311-eac922347aa1",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
      ],
      services: [
        {
          title: "Brand Strategy",
          description: "Complete brand identity and strategy development",
          price: "Starting at $2,500"
        },
        {
          title: "Digital Design",
          description: "Web design, UI/UX, and digital experiences",
          price: "Starting at $1,500"
        },
        {
          title: "Creative Direction",
          description: "Art direction and creative campaign development",
          price: "Starting at $3,000"
        }
      ],
      backgroundColor: "#ffffff",
      contactEmail: "hello@creativestudio.com",
      phoneNumber: "(555) 123-4567",
      instagramHandle: "@creative_studio",
      availableCategories: [
        { id: "creative-work", name: "Creative Work", color: "#8B5CF6" },
        { id: "behind-scenes", name: "Behind the Scenes", color: "#10B981" },
        { id: "client-work", name: "Client Work", color: "#F59E0B" },
        { id: "tech-setup", name: "Tech Setup", color: "#EF4444" }
      ],
      images: [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
          likes: 247,
          dislikes: 12,
          caption: "Latest creative project showcase ✨ #design #creative",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Creative Work"
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
          likes: 189,
          dislikes: 8,
          caption: "Behind the scenes of our studio work 📸",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Behind the Scenes"
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
          likes: 312,
          dislikes: 15,
          caption: "Client collaboration at its finest! 🤝 #teamwork",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Client Work"
        },
        {
          id: 4,
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
          likes: 156,
          dislikes: 6,
          caption: "Innovation meets creativity 💡 #innovation",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Creative Work"
        },
        {
          id: 5,
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          likes: 203,
          dislikes: 9,
          caption: "Tech setup for maximum productivity ⚡",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Tech Setup"
        },
        {
          id: 6,
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
          likes: 278,
          dislikes: 11,
          caption: "Digital creativity in action 🎨 #digital #art",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Creative Work"
        }
      ]
    };

    if (initialData) {
      console.log('[useEnhancedTemplate8DataPersistence] Merging initial data:', initialData);
      const mergedData = { ...baseData, ...initialData };
      
      // Respect explicit hero image choices from saved data
      if (initialData.hasOwnProperty('heroImage')) {
        console.log('[useEnhancedTemplate8DataPersistence] Respecting explicit heroImage from saved data:', initialData.heroImage);
        mergedData._heroImageExplicitlySet = true;
      } else if (!mergedData._heroImageExplicitlySet && mergedData.heroImages?.[0]) {
        // Only auto-assign for completely new sites
        mergedData.heroImage = mergedData.heroImages[0];
      }
      
      console.log('[useEnhancedTemplate8DataPersistence] Final merged data hero info:', {
        heroImage: mergedData.heroImage,
        _heroImageExplicitlySet: mergedData._heroImageExplicitlySet,
        hasHeroImages: !!mergedData.heroImages?.length
      });
      
      return mergedData;
    }
    
    // For brand new sites, set default hero image
    if (baseData.heroImages?.[0]) {
      baseData.heroImage = baseData.heroImages[0];
    }
    
    return baseData;
  });

  const [editingState, setEditingState] = useState({
    currentSectionIndex: 0,
    isEditingMode: false,
    isPreviewMode: false,
    areBarsCollapsed: false,
    mode: 'preview'
  });

  const [siteId, setSiteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize session persistence
  const {
    saveSession,
    loadSession,
    clearSession,
    isAutoSaving,
    hasRecoveredSession,
    sessionId
  } = useEnhancedSessionPersistence(businessName, {
    debounceMs: 500,
    enableSessionRecovery: !initialData // Only enable recovery for standalone editing
  });

  // Load recovered session data on mount
  useEffect(() => {
    if (hasRecoveredSession && !initialData) {
      const recoveredData = loadSession();
      if (recoveredData && recoveredData.pageData && Object.keys(recoveredData.pageData).length > 0) {
        console.log('[useEnhancedTemplate8DataPersistence] Recovering session data:', recoveredData);
        
        // Preserve explicit hero image choices during recovery
        const recoveredPageData = { ...recoveredData.pageData };
        if (recoveredPageData.hasOwnProperty('heroImage')) {
          recoveredPageData._heroImageExplicitlySet = true;
        }
        
        setPageData(prev => ({ ...prev, ...recoveredPageData }));
        if (recoveredData.editingState) {
          setEditingState(prev => ({ ...prev, ...recoveredData.editingState }));
        }
      }
    }
  }, [hasRecoveredSession, loadSession, initialData]);

  const handleUpdate = useCallback((updates: Partial<Template8Data>) => {
    console.log('[useEnhancedTemplate8DataPersistence] Updating with:', updates);
    
    setPageData(prev => {
      const processedUpdates = { ...updates };
      
      // If heroImage is being explicitly set or removed, mark it and don't auto-assign
      if (updates.hasOwnProperty('heroImage')) {
        processedUpdates._heroImageExplicitlySet = true;
        console.log('[useEnhancedTemplate8DataPersistence] Hero image explicitly set to:', updates.heroImage);
        
        // Don't automatically update heroImages array when heroImage is explicitly set/removed
        // Only update heroImages if it's explicitly provided in updates
        if (!updates.hasOwnProperty('heroImages') && updates.heroImage) {
          processedUpdates.heroImages = [updates.heroImage, ...(prev.heroImages?.slice(1) || [])];
        }
      }
      
      const newData = { ...prev, ...processedUpdates };
      
      // Auto-save to session storage
      if (!initialData) {
        saveSession({
          pageData: newData,
          editingState
        });
      }
      
      // Also save to localStorage for session persistence
      if (!initialData) {
        localStorage.setItem(`template8-${businessName}`, JSON.stringify(newData));
      }
      
      console.log('Template8 data updated and auto-saved:', processedUpdates);
      return newData;
    });
  }, [businessName, initialData, saveSession, editingState]);

  const handleEditingStateUpdate = useCallback((updates: Partial<typeof editingState>) => {
    console.log('[useEnhancedTemplate8DataPersistence] Updating editing state:', updates);
    const newEditingState = { ...editingState, ...updates };
    setEditingState(newEditingState);
    
    // Auto-save editing state
    if (!initialData) {
      saveSession({
        pageData,
        editingState: newEditingState
      });
    }
  }, [editingState, pageData, saveSession, initialData]);

  const handleSave = useCallback(async (): Promise<void> => {
    // Auto-save is handled by handleUpdate, so this is just for compatibility
    console.log('[useEnhancedTemplate8DataPersistence] Manual save called - auto-save already handles persistence');
    return Promise.resolve();
  }, []);

  const handleClearSession = useCallback(() => {
    clearSession();
    console.log('[useEnhancedTemplate8DataPersistence] Session data cleared');
  }, [clearSession]);

  return {
    pageData,
    editingState,
    handleUpdate,
    handleEditingStateUpdate,
    handleSave,
    isLoading,
    isSaving: isSaving || isAutoSaving,
    siteId,
    // Session management
    hasRecoveredSession,
    isAutoSaving,
    sessionId,
    clearSession: handleClearSession
  };
};
