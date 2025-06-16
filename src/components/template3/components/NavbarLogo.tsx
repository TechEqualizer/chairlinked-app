
import React from "react";
import { motion } from "framer-motion";

interface NavbarLogoProps {
  businessName: string;
  brandColor: string;
  logoUrl?: string;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({
  businessName,
  brandColor,
  logoUrl
}) => {
  return (
    <div className="flex items-center space-x-3">
      {logoUrl ? (
        <div className="relative group">
          <img 
            src={logoUrl} 
            alt={`${businessName} logo`}
            className="w-12 h-12 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))' }}
          />
        </div>
      ) : (
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold tracking-tight transition-colors duration-300 hover:opacity-80"
            style={{ color: brandColor }}
          >
            {businessName}
          </h1>
        </div>
      )}
    </div>
  );
};

export default NavbarLogo;
