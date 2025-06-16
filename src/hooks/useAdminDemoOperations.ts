
import { useConvertSiteToDemo } from './admin/useConvertSiteToDemo';
import { useDuplicateDemo } from './admin/useDuplicateDemo';
import { useBulkDeleteDemos } from './admin/useBulkDeleteDemos';
import { useDemoCleanup } from './admin/useDemoCleanup';
import { useCreateNewDemo } from './admin/useCreateNewDemo';

export const useAdminDemoOperations = () => {
  const { convertSiteToDemo, isLoading: convertLoading, canPerformOperation: canConvert } = useConvertSiteToDemo();
  const { duplicateDemo, isLoading: duplicateLoading, canPerformOperation: canDuplicate } = useDuplicateDemo();
  const { bulkDeleteDemos, isLoading: deleteLoading, canPerformOperation: canDelete } = useBulkDeleteDemos();
  const { findDuplicateDemos, cleanupDuplicates, isLoading: cleanupLoading, canPerformOperations: canCleanup } = useDemoCleanup();
  const { createNewDemo, canPerformOperation: canCreate } = useCreateNewDemo();

  const isLoading = convertLoading || duplicateLoading || deleteLoading || cleanupLoading;
  const canPerformOperations = canConvert && canDuplicate && canDelete && canCleanup && canCreate;

  return {
    convertSiteToDemo,
    createNewDemo,
    duplicateDemo,
    bulkDeleteDemos,
    findDuplicateDemos,
    cleanupDuplicates,
    isLoading,
    canPerformOperations
  };
};
