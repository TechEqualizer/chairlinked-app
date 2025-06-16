import React from "react";

/**
 * A simple banner component to indicate admin mode
 */
const AdminBanner: React.FC = () => {
  return (
    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
      Admin Mode
    </div>
  );
};

export default AdminBanner;