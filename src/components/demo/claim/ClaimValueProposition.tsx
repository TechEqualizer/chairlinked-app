
import React from 'react';
import { Zap } from 'lucide-react';

export const ClaimValueProposition: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
      <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500 fill-current" />
        What happens next?
      </h4>
      <ul className="text-sm text-purple-700 space-y-2">
        <li className="transform hover:scale-105 transition-transform duration-200">✨ Get this exact design as your website</li>
        <li className="transform hover:scale-105 transition-transform duration-200">📱 Mobile-optimized and professional</li>
        <li className="transform hover:scale-105 transition-transform duration-200">🚀 Live within 48 hours</li>
        <li className="transform hover:scale-105 transition-transform duration-200">💬 Free consultation call included</li>
      </ul>
    </div>
  );
};
