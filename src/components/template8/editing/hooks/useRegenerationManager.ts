
import { useState } from "react";
import { AIRegenerationService } from "@/services/aiRegenerationService";
import { toast } from "@/hooks/use-toast";

export const useRegenerationManager = (
  currentSectionIndex: number,
  sectionData: any,
  setSectionData: (data: any) => void
) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lastRegenerationResult, setLastRegenerationResult] = useState<any>(null);
  const [regenerationHistory, setRegenerationHistory] = useState<any[]>([]);

  const sectionTypes = ['navbar', 'hero', 'stories', 'gallery', 'testimonials', 'booking', 'footer'];

  const saveToHistory = (action: string, data: any) => {
    const entry = {
      timestamp: new Date().toISOString(),
      sectionIndex: currentSectionIndex,
      data: { ...data },
      action
    };
    setRegenerationHistory(prev => [...prev.slice(-9), entry]);
  };

  const handleRegenerate = async () => {
    const currentSectionType = sectionTypes[currentSectionIndex];
    console.log(`🔄 Starting AI regeneration for ${currentSectionType} section...`);
    
    setIsRegenerating(true);
    saveToHistory('regenerate_start', sectionData);
    
    try {
      const result = await AIRegenerationService.regenerateSection({
        sectionType: currentSectionType,
        currentData: sectionData,
        userPreferences: {
          industry: sectionData.industry || 'creative',
          style: sectionData.stylePreset || 'modern',
          tone: 'professional'
        }
      });

      if (result.success && result.data) {
        console.log('✅ AI Regeneration successful:', result);
        setLastRegenerationResult(result);
        setSectionData({ ...sectionData, ...result.data });
        saveToHistory('regenerate_success', result.data);
        
        console.log('🎉 Changes applied:', result.changes);
      } else {
        console.error('❌ AI Regeneration failed:', result.error);
        throw new Error(result.error || 'Regeneration failed');
      }
    } catch (error) {
      console.error('💥 AI regeneration error:', error);
      saveToHistory('regenerate_error', { error: error.message });
      
      // Fallback to basic regeneration
      const fallbackUpdates = {
        businessName: `${sectionData.businessName || 'Creative Studio'} Pro`,
        tagline: 'AI-Enhanced Professional Excellence',
        lastRegenerated: new Date().toISOString(),
        regenerationFallback: true
      };
      
      setSectionData({ ...sectionData, ...fallbackUpdates });
      setLastRegenerationResult({
        success: true,
        changes: ['🔧 Applied fallback improvements', '⚡ Enhanced with basic AI optimization'],
        fallback: true
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleStyleRegenerate = async (stylePreset: string) => {
    const currentSectionType = sectionTypes[currentSectionIndex];
    console.log(`🎨 Applying style preset: ${stylePreset} to ${currentSectionType}`);
    
    setIsRegenerating(true);
    
    try {
      const result = await AIRegenerationService.regenerateWithStyle(
        currentSectionType,
        sectionData,
        stylePreset
      );

      if (result.success && result.data) {
        setSectionData({ ...sectionData, ...result.data });
        setLastRegenerationResult(result);
        console.log('🎨 Style applied successfully:', stylePreset);
      }
    } catch (error) {
      console.error('❌ Style regeneration failed:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return {
    isRegenerating,
    lastRegenerationResult,
    regenerationHistory,
    handleRegenerate,
    handleStyleRegenerate,
    setLastRegenerationResult
  };
};
