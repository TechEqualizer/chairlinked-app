
import { useState } from 'react';
import { useConvertSiteToDemo } from './useConvertSiteToDemo';
import { useDuplicateDemo } from './useDuplicateDemo';
import { useBulkDeleteDemos } from './useBulkDeleteDemos';
import { useDemoCleanup } from './useDemoCleanup';
import { useCreateNewDemo } from './useCreateNewDemo';
import { usePublishSite } from './usePublishSite';

export const useEnhancedDemoOperations = () => {
  const [selectedExpiration, setSelectedExpiration] = useState<number>(24); // Default 1 day

  const { convertSiteToDemo, isLoading: convertLoading, canPerformOperation: canConvert } = useConvertSiteToDemo();
  const { duplicateDemo, isLoading: duplicateLoading, canPerformOperation: canDuplicate } = useDuplicateDemo();
  const { bulkDeleteDemos, isLoading: deleteLoading, canPerformOperation: canDelete } = useBulkDeleteDemos();
  const { findDuplicateDemos, cleanupDuplicates, isLoading: cleanupLoading, canPerformOperations: canCleanup } = useDemoCleanup();
  const { createNewDemo, canPerformOperation: canCreate } = useCreateNewDemo();
  const { publishSite, convertToLive, isLoading: publishLoading, canPerformOperation: canPublish } = usePublishSite();

  const isLoading = convertLoading || duplicateLoading || deleteLoading || cleanupLoading || publishLoading;
  const canPerformOperations = canConvert && canDuplicate && canDelete && canCleanup && canCreate && canPublish;

  const convertSiteToDemoWithExpiration = async (siteId: string) => {
    return convertSiteToDemo(siteId, selectedExpiration);
  };

  const duplicateDemoWithExpiration = async (siteId: string) => {
    return duplicateDemo(siteId, selectedExpiration);
  };

  return {
    convertSiteToDemo: convertSiteToDemoWithExpiration,
    createNewDemo,
    duplicateDemo: duplicateDemoWithExpiration,
    bulkDeleteDemos,
    findDuplicateDemos,
    cleanupDuplicates,
    publishSite,
    convertToLive,
    selectedExpiration,
    setSelectedExpiration,
    isLoading,
    canPerformOperations
  };
};
