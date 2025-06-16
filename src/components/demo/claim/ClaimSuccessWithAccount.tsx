
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClaimSuccessWithAccountProps {
  businessName: string;
  email: string;
  name: string;
  demoSiteId: string;
  onClose: () => void;
}

export const ClaimSuccessWithAccount: React.FC<ClaimSuccessWithAccountProps> = ({
  businessName,
  email,
  name,
  onClose
}) => {
  return (
    <div className="space-y-6">
      {/* Success Message */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Account Created & Site Claimed! 🎉
        </h2>
        <p className="text-gray-600">
          Welcome to ChairLinked, <strong>{name}</strong>! Your account has been created and 
          <strong> {businessName}</strong> is now yours.
        </p>
      </motion.div>

      {/* Email Verification Notice */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 rounded-xl p-4 border border-blue-200"
      >
        <h3 className="font-semibold text-blue-900 mb-2">📧 Check Your Email</h3>
        <p className="text-blue-800 text-sm">
          We've sent a verification link to <strong>{email}</strong>. 
          Please verify your email to fully activate your account and access all features.
        </p>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
      >
        <h3 className="font-semibold text-purple-900 mb-3">🚀 What's Next?</h3>
        <ul className="space-y-2 text-sm text-purple-800">
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-purple-600">1</span>
            </div>
            <span><strong>Verify your email</strong> to unlock all dashboard features</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-purple-600">2</span>
            </div>
            <span><strong>Access your customer dashboard</strong> to manage your site</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-purple-600">3</span>
            </div>
            <span><strong>Customize your website</strong> content and design</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-purple-600">4</span>
            </div>
            <span><strong>Go live</strong> with your professional website</span>
          </li>
        </ul>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => window.location.href = '/auth'}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Sign In to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button onClick={onClose} variant="outline" className="px-6">
          Close
        </Button>
      </div>
    </div>
  );
};
