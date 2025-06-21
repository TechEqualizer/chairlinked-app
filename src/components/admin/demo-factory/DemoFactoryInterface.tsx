import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Factory, 
  Plus, 
  BarChart3, 
  Settings, 
  Eye, 
  Users,
  Target,
  Zap
} from 'lucide-react';
import { DemoFactoryDashboard } from './DemoFactoryDashboard';
import { RapidDemoCreator } from './RapidDemoCreator';
import { DemoLibraryManager } from './DemoLibraryManager';
import { DemoAnalytics } from './DemoAnalytics';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const DemoFactoryInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreator, setShowCreator] = useState(false);
  const { isAdmin, user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set page-specific styling for Demo Factory
  React.useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">
              Demo Factory is only available to internal team members.
            </p>
            <Button onClick={() => navigate('/admin')} variant="outline">
              Return to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateDemo = async (demoConfig: any) => {
    try {
      console.log('[Demo Factory] Creating demo with config:', demoConfig);
      
      // Transform the demo config into the format expected by your existing system
      const template8Data = {
        ...demoConfig.template8Data,
        _generatedBy: 'demo-factory',
        _templateId: demoConfig.template?.id,
        _styleId: demoConfig.style?.id,
        _createdAt: new Date().toISOString()
      };

      // Store in session storage for the existing editor to pick up
      sessionStorage.setItem('template8GeneratedData', JSON.stringify(template8Data));
      sessionStorage.setItem('template8BusinessName', template8Data.businessName);
      
      toast({
        title: 'Demo Created Successfully',
        description: `${template8Data.businessName} demo is ready for editing`,
      });

      // Navigate to the existing Template8 editor in professional mode
      console.log('[Demo Factory] Navigating to Professional Editor with URL: /template8-generator?mode=advanced&source=demo-factory');
      navigate('/template8-generator?mode=advanced&source=demo-factory');
      
    } catch (error) {
      console.error('[Demo Factory] Error creating demo:', error);
      toast({
        title: 'Error Creating Demo',
        description: 'Failed to create demo. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePreviewDemo = (config: any) => {
    console.log('[Demo Factory] Previewing demo:', config);
    // You could implement a preview modal here
    toast({
      title: 'Preview Demo',
      description: 'Opening demo preview...',
    });
  };

  const handleManageTemplates = () => {
    setActiveTab('library');
  };

  const handleViewAnalytics = () => {
    setActiveTab('analytics');
  };

  if (showCreator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <Button 
            onClick={() => setShowCreator(false)} 
            variant="outline" 
            className="mb-4"
          >
            ← Back to Demo Factory
          </Button>
        </div>
        <RapidDemoCreator 
          onCreateDemo={handleCreateDemo}
          onPreview={handlePreviewDemo}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Business-Focused Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Factory className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Demo Factory</h1>
                  <p className="text-blue-100 text-lg">Production & Analytics Hub</p>
                </div>
              </div>
              <p className="text-blue-100 max-w-2xl leading-relaxed">
                Strategic command center for creating, deploying, and optimizing high-converting demo websites. 
                Drive business growth through data-driven demo production and performance analytics.
              </p>
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-blue-100">Production Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-blue-100">{user?.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowCreator(true)}
                className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-6 py-3 text-lg rounded-xl h-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Demo
              </Button>
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-semibold px-6 py-3 text-lg rounded-xl h-auto"
              >
                <Target className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* Business-Focused Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Production Operations</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-gray-100">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4" />
                Production Metrics
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Settings className="w-4 h-4" />
                Template Library
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <Target className="w-4 h-4" />
                Performance Analytics
              </TabsTrigger>
              <TabsTrigger value="quick-actions" className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                <Zap className="w-4 h-4" />
                Production Tools
              </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DemoFactoryDashboard 
              onCreateDemo={() => setShowCreator(true)}
              onManageTemplates={handleManageTemplates}
              onViewAnalytics={handleViewAnalytics}
            />
          </TabsContent>

          <TabsContent value="library">
            <DemoLibraryManager />
          </TabsContent>

          <TabsContent value="analytics">
            <DemoAnalytics />
          </TabsContent>

          <TabsContent value="quick-actions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Production Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setShowCreator(true)}
                    className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-8 h-8" />
                    <span>New Demo</span>
                    <span className="text-xs opacity-75">Create from template</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('library')}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <Settings className="w-8 h-8" />
                    <span>Manage Templates</span>
                    <span className="text-xs opacity-75">Organize & edit</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('analytics')}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-8 h-8" />
                    <span>View Performance</span>
                    <span className="text-xs opacity-75">Conversion analytics</span>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/admin')}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <Users className="w-8 h-8" />
                    <span>Admin Dashboard</span>
                    <span className="text-xs opacity-75">Main admin panel</span>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/template8-generator')}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <Eye className="w-8 h-8" />
                    <span>Template8 Editor</span>
                    <span className="text-xs opacity-75">Direct editor access</span>
                  </Button>
                  
                  <Card className="h-24 flex flex-col items-center justify-center p-4 bg-green-50 border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">24%</div>
                      <div className="text-xs text-green-600">Avg Conversion</div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};