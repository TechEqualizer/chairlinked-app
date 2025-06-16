
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface CustomizationRequest {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Completed';
  date: string;
  description: string;
}

// Mock data - in a real app this would come from props or a hook
const mockRequests: CustomizationRequest[] = [
  {
    id: '1',
    title: 'Update hero section text',
    status: 'Completed',
    date: '2024-01-15',
    description: 'Change main headline and add new call-to-action',
  },
  {
    id: '2',
    title: 'Add new service section',
    status: 'In Progress',
    date: '2024-01-18',
    description: 'Include massage therapy services in the offerings',
  },
  {
    id: '3',
    title: 'Update contact information',
    status: 'Open',
    date: '2024-01-20',
    description: 'Change phone number and business hours',
  },
];

export const CustomizationRequestsTable: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Open':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Open':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNewRequest = () => {
    window.location.href = 'mailto:support@chairlinked.com?subject=Website Customization Request&body=Hi, I\'d like to request changes to my ChairLinked website. Here\'s what I\'d like to update:%0D%0A%0D%0A[Please describe your requested changes]';
  };

  return (
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">Customization Requests</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Track your website updates and changes</p>
            </div>
          </div>
          <Button 
            onClick={handleNewRequest} 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl beautiful-shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <div 
              key={request.id} 
              className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition-all duration-200 beautiful-shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(request.status)}
                    <h3 className="font-semibold text-slate-900 text-lg">{request.title}</h3>
                    <Badge className={`${getStatusColor(request.status)} rounded-full`}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mb-4 leading-relaxed">{request.description}</p>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted {new Date(request.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Request #{request.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {mockRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No requests yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Submit your first customization request to get started with updating your ChairLinked website.
              </p>
              <Button 
                onClick={handleNewRequest}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl beautiful-shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
