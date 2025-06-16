
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Zap } from 'lucide-react';

interface AdminQuickActionsProps {
  onCreateDemo: () => void;
}

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  onCreateDemo
}) => {
  const navigate = useNavigate();

  return (
    <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          Admin Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Button 
          onClick={onCreateDemo} 
          className="w-full justify-between bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl h-12 beautiful-shadow"
        >
          <span>Create New Demo Site</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/customers')}
          className="w-full justify-between border-slate-300 hover:bg-slate-100 rounded-xl h-12"
        >
          <span>Manage Customers</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/analytics')}
          className="w-full justify-between border-slate-300 hover:bg-slate-100 rounded-xl h-12"
        >
          <span>View Analytics</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/team')}
          className="w-full justify-between border-slate-300 hover:bg-slate-100 rounded-xl h-12"
        >
          <span>Team Management</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
