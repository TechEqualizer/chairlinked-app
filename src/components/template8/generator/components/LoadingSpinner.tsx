import React from 'react';
import { Spinner } from '@/components/template8/design-system/components/Spinner';
import { Flex } from '@/components/template8/design-system/components/Container';
import { Text } from '@/components/template8/design-system/components/Typography';

/**
 * A reusable loading spinner component with customizable size and message
 */
interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = 'md',
  className = ""
}) => {
  const spinnerSize = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  }[size] as 'sm' | 'md' | 'lg';

  const textSize = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  }[size] as 'xs' | 'sm' | 'md';

  return (
    <Flex direction="col" align="center" justify="center" gap="sm" className={className}>
      <Spinner size={spinnerSize} color="#8B5CF6" />
      {message && (
        <Text size={textSize} weight="medium" color="#666">
          {message}
        </Text>
      )}
    </Flex>
  );
};

export default LoadingSpinner;