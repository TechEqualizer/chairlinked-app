
import React from "react";

interface EditingFlowLayoutProps {
  children: React.ReactNode;
}

/** Modern professional layout with sophisticated background and glass morphism effects */
const EditingFlowLayout: React.FC<EditingFlowLayoutProps> = ({ children }) => (
  <div 
    className="fixed inset-0 z-[50] overflow-hidden quick-edit-container"
    style={{
      background: `
        linear-gradient(135deg, #667eea 0%, #764ba2 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
      `,
      zIndex: 50
    }}
  >
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-2000" />
    </div>
    
    {/* Glass morphism overlay */}
    <div className="absolute inset-0 backdrop-blur-[0.5px] bg-gradient-to-br from-white/[0.08] to-transparent" />
    
    {children}
  </div>
);

export default EditingFlowLayout;
