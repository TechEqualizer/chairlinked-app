
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Play, Users, Palette, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  completed?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ChairLinked',
    description: 'Create a professional website for your business in minutes, not hours.',
    icon: <Users className="h-6 w-6" />,
    action: 'Get Started'
  },
  {
    id: 'generate',
    title: 'Generate Your Site',
    description: 'Tell us about your business and we\'ll create a custom website template.',
    icon: <Palette className="h-6 w-6" />,
    action: 'Create Site'
  },
  {
    id: 'customize',
    title: 'Customize Everything',
    description: 'Edit text, upload images, and adjust colors to match your brand perfectly.',
    icon: <Play className="h-6 w-6" />,
    action: 'Start Editing'
  },
  {
    id: 'publish',
    title: 'Go Live',
    description: 'Publish your site and start attracting customers with your professional web presence.',
    icon: <Rocket className="h-6 w-6" />,
    action: 'Publish Site'
  }
];

interface CustomerOnboardingFlowProps {
  currentStep?: string;
  onStepComplete?: (stepId: string) => void;
  onClose?: () => void;
}

const CustomerOnboardingFlow: React.FC<CustomerOnboardingFlowProps> = ({
  currentStep = 'welcome',
  onStepComplete,
  onClose
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleStepAction = (stepId: string) => {
    setCompletedSteps(prev => [...prev, stepId]);
    onStepComplete?.(stepId);
    
    const currentIndex = onboardingSteps.findIndex(step => step.id === stepId);
    const nextStep = onboardingSteps[currentIndex + 1];
    if (nextStep) {
      setActiveStep(nextStep.id);
    } else {
      onClose?.();
    }
  };

  const currentStepData = onboardingSteps.find(step => step.id === activeStep);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {onboardingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-500'
                      : step.id === activeStep
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                Skip
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {currentStepData && (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    {currentStepData.icon}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentStepData.title}
                </h2>
                
                <p className="text-gray-600">
                  {currentStepData.description}
                </p>
                
                {currentStepData.action && (
                  <Button
                    onClick={() => handleStepAction(activeStep)}
                    className="w-full"
                  >
                    {currentStepData.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerOnboardingFlow;
