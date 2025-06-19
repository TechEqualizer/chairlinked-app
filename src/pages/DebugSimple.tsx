import React, { useState, useEffect } from 'react';

const DebugSimple: React.FC = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[DebugSimple] Component mounted');
    
    try {
      const mockSites = [
        {
          id: 'demo-1',
          business_name: 'Beauty Studio Demo',
          site_slug: 'beauty-studio-demo',
          lifecycle_stage: 'ready_to_share',
          site_type: 'demo'
        },
        {
          id: 'demo-2',
          business_name: 'Hair Salon Demo',
          site_slug: 'hair-salon-demo',
          lifecycle_stage: 'shared',
          site_type: 'demo'
        },
        {
          id: 'demo-3',
          business_name: 'Photography Studio Demo',
          site_slug: 'photography-studio-draft',
          lifecycle_stage: 'draft',
          site_type: 'demo'
        }
      ];

      console.log('[DebugSimple] Mock sites loaded:', mockSites);
      setSites(mockSites);
      setLoading(false);
    } catch (err) {
      console.error('[DebugSimple] Error loading sites:', err);
      setError('Failed to load sites');
      setLoading(false);
    }
  }, []);

  const updateLifecycle = (siteId: string, newStage: string) => {
    console.log('[DebugSimple] Updating lifecycle:', { siteId, newStage });
    
    try {
      // Update localStorage
      const key = `admin_mock_lifecycle_${siteId}`;
      localStorage.setItem(key, newStage);
      console.log('[DebugSimple] Stored in localStorage:', { key, newStage });

      // Update state
      setSites(prevSites => {
        const updated = prevSites.map(site => 
          site.id === siteId 
            ? { ...site, lifecycle_stage: newStage }
            : site
        );
        console.log('[DebugSimple] Updated sites:', updated);
        return updated;
      });

      // Dispatch event
      const event = new CustomEvent('mock-lifecycle-updated', { 
        detail: { siteId, newStage } 
      });
      window.dispatchEvent(event);
      console.log('[DebugSimple] Dispatched event');
      
    } catch (err) {
      console.error('[DebugSimple] Error updating lifecycle:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Debug Simple Admin</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Debug Simple Admin</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Simple Admin</h1>
      <p>Current sites loaded: {sites.length}</p>
      
      {sites.map((site) => (
        <div key={site.id} style={{ 
          border: '1px solid #ccc', 
          padding: '20px', 
          margin: '10px 0',
          borderRadius: '8px' 
        }}>
          <h3>{site.business_name}</h3>
          <p><strong>Slug:</strong> {site.site_slug}</p>
          <p><strong>Current Stage:</strong> <span style={{ 
            backgroundColor: '#e0e0e0', 
            padding: '4px 8px', 
            borderRadius: '4px' 
          }}>{site.lifecycle_stage}</span></p>
          
          <div style={{ marginTop: '10px' }}>
            <p><strong>Actions:</strong></p>
            <button 
              onClick={() => updateLifecycle(site.id, 'draft')}
              style={{ margin: '5px', padding: '5px 10px' }}
            >
              → Draft
            </button>
            <button 
              onClick={() => updateLifecycle(site.id, 'shared')}
              style={{ margin: '5px', padding: '5px 10px' }}
            >
              → Shared
            </button>
            <button 
              onClick={() => updateLifecycle(site.id, 'claimed')}
              style={{ margin: '5px', padding: '5px 10px' }}
            >
              → Claimed
            </button>
          </div>

          <div style={{ marginTop: '10px' }}>
            <p><strong>Test URLs:</strong></p>
            <p><a href={`http://localhost:8080/demo/${site.site_slug}`} target="_blank" rel="noopener noreferrer">
              Public URL
            </a></p>
            <p><a href={`http://localhost:8080/demo/${site.site_slug}?admin=true`} target="_blank" rel="noopener noreferrer">
              Admin URL
            </a></p>
          </div>
        </div>
      ))}

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Debug Info</h3>
        <p><strong>localStorage keys:</strong></p>
        <ul>
          {Object.keys(localStorage).filter(key => key.startsWith('admin_mock_lifecycle_')).map(key => (
            <li key={key}>{key}: {localStorage.getItem(key)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DebugSimple;