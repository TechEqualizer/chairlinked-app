
import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { PaymentGate } from '@/components/PaymentGate';
import { ModernDashboardSidebar } from '@/components/dashboard/ModernDashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Mail, Phone, MessageSquare, Book, ExternalLink } from 'lucide-react';

const CustomerHelp: React.FC = () => {
  const { user } = useAuthContext();

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@chairlinked.com?subject=Support Request&body=Hi, I need help with my ChairLinked account. Here\'s my question:%0D%0A%0D%0A[Please describe your question or issue]';
  };

  const faqItems = [
    {
      question: "How do I request changes to my website?",
      answer: "You can submit customization requests through the 'Requests' page in your dashboard. Our team will review and implement changes within 2-3 business days."
    },
    {
      question: "Can I change my subscription plan?",
      answer: "Yes! Visit the 'Manage Subscription' page to upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "How do I update my business information?",
      answer: "You can update your business details by submitting a customization request or contacting our support team directly."
    },
    {
      question: "What's included in my plan?",
      answer: "Your plan includes professional website creation, hosting, analytics, and unlimited customization requests. Premium plans also include custom domain support."
    }
  ];

  return (
    <PaymentGate feature="help and support">
      <div className="min-h-screen flex w-full bg-zinc-200 gap-6 p-6">
        <ModernDashboardSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Help & Support
              </h1>
              <p className="text-slate-600 text-lg">
                Get answers to your questions and contact our support team
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Support */}
              <div className="space-y-6">
                <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      Contact Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl beautiful-shadow-sm">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-slate-900">Email Support</p>
                          <p className="text-sm text-slate-600">support@chairlinked.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl beautiful-shadow-sm">
                        <Phone className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-slate-900">Phone Support</p>
                          <p className="text-sm text-slate-600">Available Mon-Fri, 9AM-5PM EST</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={handleContactSupport} 
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl beautiful-shadow"
                    >
                      Send Support Email
                    </Button>
                  </CardContent>
                </Card>

                <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                    <CardTitle className="text-xl text-slate-900">Submit a Question</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="subject" className="text-slate-700">Subject</Label>
                      <Input 
                        id="subject" 
                        placeholder="What do you need help with?" 
                        className="mt-1 rounded-xl border-slate-300 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-slate-700">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Please describe your question or issue in detail..."
                        rows={4}
                        className="mt-1 rounded-xl border-slate-300 focus:border-indigo-500"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl beautiful-shadow">
                      Submit Question
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ and Resources */}
              <div className="space-y-6">
                <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {faqItems.map((item, index) => (
                        <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                          <h4 className="font-semibold text-slate-900 mb-3">{item.question}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Book className="w-5 h-5 text-white" />
                      </div>
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <a 
                        href="/pricing" 
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors beautiful-shadow-sm"
                      >
                        <span className="font-medium text-slate-900">View Plans & Pricing</span>
                        <ExternalLink className="w-4 h-4 text-slate-600" />
                      </a>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl beautiful-shadow-sm">
                        <span className="font-medium text-slate-900">User Guide (Coming Soon)</span>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl beautiful-shadow-sm">
                        <span className="font-medium text-slate-900">Video Tutorials (Coming Soon)</span>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PaymentGate>
  );
};

export default CustomerHelp;
