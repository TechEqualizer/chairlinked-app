
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { RouteDebugger } from "@/components/RouteDebugger";

const NotFound = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    console.error('[NotFound] 404 Error - Route not found:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      params,
      timestamp: new Date().toISOString()
    });
  }, [location, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <RouteDebugger componentName="NotFound" />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-4">
          Path: {location.pathname}
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
