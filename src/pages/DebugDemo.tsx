import React, { useState } from 'react';
import { getSiteBySlug } from '@/services/supabaseChairLinked';

const DebugDemo: React.FC = () => {
  const [slug, setSlug] = useState('beauty-studio-demo');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSlug = async () => {
    setLoading(true);
    try {
      console.log('Testing slug:', slug);
      console.log('Dev mode:', import.meta.env.VITE_DEV_MODE);
      
      const response = await getSiteBySlug(slug);
      console.log('Response:', response);
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Demo Site Access</h1>
      
      <div className="mb-4">
        <p><strong>Dev Mode:</strong> {String(import.meta.env.VITE_DEV_MODE)}</p>
        <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Slug to test:
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-64"
          placeholder="beauty-studio-demo"
        />
        <button
          onClick={testSlug}
          disabled={loading}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Slug'}
        </button>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugDemo;