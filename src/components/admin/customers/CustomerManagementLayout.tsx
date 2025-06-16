
import React, { useState } from "react";
import { ModernAdminLayout } from "@/components/admin/ModernAdminLayout";
import CustomerStatsCards from "./CustomerStatsCards";
import CustomerTable from "./CustomerTable";
import CustomerActions from "./CustomerActions";
import { useCustomerManagement } from "@/hooks/useCustomerManagement";
import type { Customer } from "@/hooks/types/customerTypes";
import { UserCheck } from "lucide-react";

const CustomerManagementLayout: React.FC = () => {
  const {
    customers,
    loading,
    stats,
    cancelSubscription,
    reactivateSubscription,
    deleteCustomerAccount
  } = useCustomerManagement();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Handlers for actions
  const handleCancelSubscription = async (reason: string) => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    await cancelSubscription(selectedCustomer.email, reason);
    setActionLoading(false);
    setCancelModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleReactivateSubscription = async () => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    await reactivateSubscription(selectedCustomer.email);
    setActionLoading(false);
    setReactivateModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteAccount = async () => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    await deleteCustomerAccount(selectedCustomer.email);
    setActionLoading(false);
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const openCancelModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCancelModalOpen(true);
  };
  const openReactivateModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setReactivateModalOpen(true);
  };
  const openDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading customers...</p>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
              <p className="text-slate-600 text-lg">View and manage paying customers</p>
            </div>
          </div>
        </div>
        <CustomerStatsCards stats={stats} />
        <div className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          {/* Card-like styling applies from parent */}
          <CustomerTable
            customers={customers}
            onCancel={openCancelModal}
            onReactivate={openReactivateModal}
            onDelete={openDeleteModal}
          />
        </div>
        <CustomerActions
          selectedCustomer={selectedCustomer}
          cancelModalOpen={cancelModalOpen}
          reactivateModalOpen={reactivateModalOpen}
          deleteModalOpen={deleteModalOpen}
          actionLoading={actionLoading}
          onCancelClose={() => setCancelModalOpen(false)}
          onReactivateClose={() => setReactivateModalOpen(false)}
          onDeleteClose={() => setDeleteModalOpen(false)}
          onConfirmCancel={handleCancelSubscription}
          onConfirmReactivate={handleReactivateSubscription}
          onConfirmDelete={handleDeleteAccount}
        />
      </div>
    </ModernAdminLayout>
  );
};

export default CustomerManagementLayout;
