
import React from 'react';
import { User } from '@supabase/supabase-js';

interface WelcomeHeaderProps {
  user: User | null;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">
        {getTimeGreeting()}, {user?.email?.split('@')[0] || 'there'}! 👋
      </h1>
      <p className="text-gray-600 mt-2">
        Welcome to your ChairLinked dashboard. Here you can view your website performance and manage your account.
      </p>
    </div>
  );
};
