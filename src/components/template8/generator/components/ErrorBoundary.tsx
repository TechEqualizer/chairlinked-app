
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/template8/design-system/components/Button';
import { Card, CardContent } from '@/components/template8/design-system/components/Card';
import { Heading, Text } from '@/components/template8/design-system/components/Typography';
import { Flex } from '@/components/template8/design-system/components/Container';
import { Divider } from '@/components/template8/design-system/components/Divider';

/**
 * Error boundary component to catch and display errors in the generator
 */
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  isProductionPreview?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // In production preview mode, show minimal or no error UI
      if (this.props.isProductionPreview) {
        console.error('[ErrorBoundary] Error in production preview mode:', this.state.error);
        
        // Show a clean loading state instead of error details
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        );
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card variant="default" elevation="md" className="max-w-lg w-full">
            <CardContent className="p-6">
              <Flex direction="col" gap="md">
                <Flex align="center" gap="md">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <Heading as="h2" size="lg">Something went wrong</Heading>
                    <Text size="md" color="#666">The application encountered an unexpected error</Text>
                  </div>
                </Flex>

                {this.state.error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Text size="sm" weight="medium" color="#B91C1C" className="mb-1">Error Details:</Text>
                    <Text size="xs" font="mono" color="#DC2626">{this.state.error.message}</Text>
                  </div>
                )}

                <Divider />

                <Flex gap="md">
                  <Button 
                    onClick={this.handleReset}
                    variant="outline"
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    fullWidth
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="primary"
                    fullWidth
                  >
                    Reload Page
                  </Button>
                </Flex>
              </Flex>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
