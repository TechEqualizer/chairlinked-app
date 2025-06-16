
import React from "react";
import { motion } from "framer-motion";
import ModernBackgroundRenderer from "./ModernBackgroundRenderer";

interface EditableHeroBackgroundProps {
  children: React.ReactNode;
  brandColor?: string;
  brandSecondary?: string;
  brandAccent?: string;
  backgroundType?: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
  backgroundPosition?: string;
  backgroundSize?: string;
  gradientDirection?: string;
  gradientIntensity?: string;
  overlayColor?: string;
  animatedBackground?: boolean;
  enableImageOverlay?: boolean;
  fontClass?: string;
  fontFamily?: string;
  fontWeight?: string;
  textColor?: string;
  secondaryTextColor?: string;
  onUpdate?: (updates: any) => void;
}

const EditableHeroBackground: React.FC<EditableHeroBackgroundProps> = ({
  children,
  brandColor = "#8B5CF6",
  brandSecondary = "#EC4899",
  brandAccent = "#F59E0B",
  backgroundType = "gradient",
  backgroundImage = "",
  backgroundOpacity = 0.7,
  backgroundPosition = "center",
  backgroundSize = "cover",
  gradientDirection = "135deg",
  gradientIntensity = "medium",
  overlayColor = "#000000",
  animatedBackground = false,
  enableImageOverlay = false,
  fontClass = "font-inter",
  fontFamily = "Inter",
  fontWeight = "normal",
  textColor = "#ffffff",
  secondaryTextColor = "#e5e7eb",
  onUpdate
}) => {
  return (
    <section 
      id="hero"
      className="relative min-h-screen overflow-hidden pt-20 pb-16"
      style={{ fontFamily }}
    >
      {/* Background Renderer - Use the correct props interface */}
      <ModernBackgroundRenderer
        pageData={{
          backgroundType,
          backgroundImage,
          brandColor,
          heroTheme: 'light'
        }}
        heroImage={backgroundImage}
        onUpdate={onUpdate}
      />

      {/* Content Container with proper spacing */}
      <div className="relative z-10 min-h-[calc(100vh-5rem)] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default EditableHeroBackground;
