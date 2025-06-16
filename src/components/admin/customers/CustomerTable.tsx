
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Mail, MoreHorizontal, UserCheck, UserMinus, RotateCcw, Trash2 } from "lucide-react";
import type { Customer } from "@/hooks/types/customerTypes";

export interface CustomerTableProps {
  customers: Customer[];
  onCancel: (customer: Customer) => void;
  onReactivate: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format((amount ?? 0) / 100);

const getStatusBadge = (customer: Customer) => {
  if (customer.subscribed) {
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  } else if (customer.cancelled_at) {
    return <Badge className="bg-orange-100 text-orange-800">Cancelled</Badge>;
  } else {
    return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
  }
};

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onCancel,
  onReactivate,
  onDelete
}) => {
  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">No customers found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Subscription</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                </div>
                {customer.email.split("@")[0]}
              </div>
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>
              <span className="capitalize">
                {customer.subscription_tier || "Basic"}
              </span>
            </TableCell>
            <TableCell>{getStatusBadge(customer)}</TableCell>
            <TableCell className="text-sm text-gray-600">
              {formatDate(customer.created_at)}
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(customer.total_revenue)}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {customer.subscribed ? (
                      <DropdownMenuItem
                        onClick={() => onCancel(customer)}
                        className="text-orange-600 focus:text-orange-600"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Cancel Subscription
                      </DropdownMenuItem>
                    ) : customer.cancelled_at ? (
                      <DropdownMenuItem
                        onClick={() => onReactivate(customer)}
                        className="text-green-600 focus:text-green-600"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reactivate Subscription
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(customer)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomerTable;
