
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditingGlassCard } from "@/components/ui/enhanced-glass-morphism";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class StoryEditErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Story Edit Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <EditingGlassCard variant="content" className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-12 w-12 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Story Editor Error
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Something went wrong while loading the story editor. This might be due to corrupted story data.
              </p>
              {this.state.error && (
                <details className="text-xs text-gray-500 mb-4">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
            <Button
              onClick={this.handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
          </div>
        </EditingGlassCard>
      );
    }

    return this.props.children;
  }
}

export default StoryEditErrorBoundary;
