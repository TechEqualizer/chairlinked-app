
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

interface RouteDebuggerProps {
  componentName: string;
}

export const RouteDebugger: React.FC<RouteDebuggerProps> = ({ componentName }) => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    console.log(`[${componentName}] Route Debug Info:`, {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      params,
      timestamp: new Date().toISOString()
    });
  }, [location, params, componentName]);

  return null;
};
