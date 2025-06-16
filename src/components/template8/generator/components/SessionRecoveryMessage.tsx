import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Database, HardDrive, User } from 'lucide-react';
import { Badge } from '@/components/template8/design-system/components/Badge';
import { Card, CardContent } from '@/components/template8/design-system/components/Card';
import { Flex } from '@/components/template8/design-system/components/Container';
import { Heading, Text } from '@/components/template8/design-system/components/Typography';
import { Button } from '@/components/template8/design-system/components/Button';
import { RecoverySource } from '@/hooks/useEnhancedDemoRecovery';

/**
 * Component that displays a message when a session is recovered
 */
interface SessionRecoveryMessageProps {
  showRecoveryMessage: boolean;
  onDismiss: () => void;
  recoverySource?: RecoverySource;
}

const SessionRecoveryMessage: React.FC<SessionRecoveryMessageProps> = ({
  showRecoveryMessage,
  onDismiss,
  recoverySource = 'none'
}) => {
  const getRecoveryIcon = () => {
    switch (recoverySource) {
      case 'database':
        return <Database className="w-5 h-5 text-green-600" />;
      case 'demoSite':
        return <HardDrive className="w-5 h-5 text-blue-600" />;
      case 'businessName':
        return <User className="w-5 h-5 text-purple-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getRecoveryMessage = () => {
    switch (recoverySource) {
      case 'database':
        return {
          title: 'Latest Progress Restored',
          description: 'Your most recent work has been loaded from the database.'
        };
      case 'demoSite':
        return {
          title: 'Demo Editing Resumed',
          description: 'You\'re continuing to edit your demo site with saved progress.'
        };
      case 'businessName':
        return {
          title: 'Business Profile Recovered',
          description: 'Your previous work has been restored based on business name.'
        };
      default:
        return {
          title: 'Session Restored',
          description: 'Your previous work has been recovered successfully.'
        };
    }
  };

  const { title, description } = getRecoveryMessage();

  return (
    <AnimatePresence>
      {showRecoveryMessage && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <Card variant="default" elevation="md">
            <CardContent className="p-4">
              <Flex align="center" gap="sm">
                {getRecoveryIcon()}
                <div className="flex-1">
                  <Heading as="h3" size="sm">{title}</Heading>
                  <Text size="sm" color="#666">{description}</Text>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDismiss}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </Flex>
              
              {recoverySource === 'database' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Badge variant="subtle" color="success" withDot>
                    Changes are automatically saved to database
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionRecoveryMessage;