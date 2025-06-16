
import React, { useState } from "react";
import type { Customer } from "@/hooks/types/customerTypes";
import {
  CancelSubscriptionModal,
  ReactivateSubscriptionModal,
  DeleteAccountModal
} from "@/components/admin/customer-modals";

// Types for modal props
interface CustomerActionsProps {
  selectedCustomer: Customer | null;
  cancelModalOpen: boolean;
  reactivateModalOpen: boolean;
  deleteModalOpen: boolean;
  actionLoading: boolean;
  onCancelClose: () => void;
  onReactivateClose: () => void;
  onDeleteClose: () => void;
  onConfirmCancel: (reason: string) => void;
  onConfirmReactivate: () => void;
  onConfirmDelete: () => void;
}

const CustomerActions: React.FC<CustomerActionsProps> = ({
  selectedCustomer,
  cancelModalOpen,
  reactivateModalOpen,
  deleteModalOpen,
  actionLoading,
  onCancelClose,
  onReactivateClose,
  onDeleteClose,
  onConfirmCancel,
  onConfirmReactivate,
  onConfirmDelete
}) => (
  <>
    <CancelSubscriptionModal
      isOpen={cancelModalOpen}
      onClose={onCancelClose}
      onConfirm={onConfirmCancel}
      customer={selectedCustomer}
      loading={actionLoading}
    />
    <ReactivateSubscriptionModal
      isOpen={reactivateModalOpen}
      onClose={onReactivateClose}
      onConfirm={onConfirmReactivate}
      customer={selectedCustomer}
      loading={actionLoading}
    />
    <DeleteAccountModal
      isOpen={deleteModalOpen}
      onClose={onDeleteClose}
      onConfirm={onConfirmDelete}
      customer={selectedCustomer}
      loading={actionLoading}
    />
  </>
);

export default CustomerActions;
