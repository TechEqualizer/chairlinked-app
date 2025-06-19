import React from 'react';
import { SimpleSequentialEditor } from '@/components/template8/editing/SimpleSequentialEditor';

const MVPTest: React.FC = () => {
  const mockPageData = {
    heroTitle: 'Test Business',
    heroSubtitle: 'Professional beauty services',
    services: [
      { id: '1', title: 'Haircut', description: 'Professional styling', price: '$50', duration: '1 hour' }
    ],
    testimonials: [
      { id: '1', name: 'Jane Doe', content: 'Great service!', rating: 5 }
    ],
    gallery: [],
    bookingUrl: 'https://calendly.com/test'
  };

  const mockSiteData = {
    id: 'test-site-id',
    business_name: 'Test Business',
    lifecycle_stage: 'draft'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">MVP Sequential Editor Test</h1>
        <SimpleSequentialEditor
          pageData={mockPageData}
          siteData={mockSiteData}
          onUpdate={(updates) => console.log('Updates:', updates)}
          onSave={async () => console.log('Saving...')}
          onClose={() => console.log('Closing...')}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default MVPTest;