import React, { useState } from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, ExternalLink, User, Calendar, AlertCircle, MessageSquare } from 'lucide-react';
import { useCustomizationRequests, CustomizationRequest } from '@/hooks/useCustomizationRequests';
import { format } from 'date-fns';

const AdminCustomerRequests: React.FC = () => {
  const { requests, loading, updating, updateRequest, deleteRequest } = useCustomizationRequests();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<CustomizationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    const updates: Partial<CustomizationRequest> = { status: newStatus as any };
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    await updateRequest(requestId, updates);
  };

  const handleNotesUpdate = async () => {
    if (!selectedRequest) return;
    await updateRequest(selectedRequest.id, { admin_notes: adminNotes });
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const openRequestDetails = (request: CustomizationRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
  };

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Modern Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Customer Requests</h1>
            <p className="text-slate-600 text-lg">Manage customization requests from customers</p>
          </div>
        </div>

        {/* Modern Filters Card */}
        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="text-sm font-semibold text-slate-700 mb-2 block">Search</Label>
                <Input
                  id="search"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="beautiful-shadow-sm border-slate-200 rounded-xl h-12"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-semibold text-slate-700 mb-2 block">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="beautiful-shadow-sm border-slate-200 rounded-xl h-12">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-sm font-semibold text-slate-700 mb-2 block">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="beautiful-shadow-sm border-slate-200 rounded-xl h-12">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterPriority('all');
                    setSearchTerm('');
                  }}
                  className="w-full border-slate-300 hover:bg-slate-100 rounded-xl h-12"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-500">No customization requests match your current filters.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="beautiful-shadow border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{request.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{request.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        {request.chairlinked_sites && (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            <span>{request.chairlinked_sites.business_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="flex flex-col gap-2">
                        <Select
                          value={request.status}
                          onValueChange={(value) => handleStatusUpdate(request.id, value)}
                          disabled={updating}
                        >
                          <SelectTrigger className="beautiful-shadow-sm border-slate-200 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRequestDetails(request)}
                            className="flex-1 border-slate-300 hover:bg-slate-100 rounded-xl"
                          >
                            View Details
                          </Button>
                          {request.chairlinked_sites && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/site/${request.chairlinked_sites?.site_slug}`, '_blank')}
                              className="border-slate-300 hover:bg-slate-100 rounded-xl"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl beautiful-shadow border-0 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 beautiful-shadow-sm">
                  <Label className="text-sm font-semibold text-slate-700">Customer</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.customer_name}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.customer_email}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 beautiful-shadow-sm">
                  <Label className="text-sm font-semibold text-slate-700">Site</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedRequest.chairlinked_sites?.business_name || 'No site linked'}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 beautiful-shadow-sm">
                <Label className="text-sm font-semibold text-slate-700">Description</Label>
                <p className="text-sm text-gray-600 mt-2">{selectedRequest.description}</p>
              </div>
              <div>
                <Label htmlFor="admin-notes" className="text-sm font-semibold text-slate-700 mb-2 block">Admin Notes</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this request..."
                  rows={4}
                  className="beautiful-shadow-sm border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRequest(null)}
                  className="border-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNotesUpdate} 
                  disabled={updating}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl beautiful-shadow"
                >
                  {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModernAdminLayout>
  );
};

export default AdminCustomerRequests;
