import React, { useState } from "react";
import NavbarLogo from "./components/NavbarLogo";
import DesktopNavigation from "./components/DesktopNavigation";
import CTAButton from "./components/CTAButton";
import MobileMenuButton from "./components/MobileMenuButton";
import MobileMenu from "./components/MobileMenu";

interface InstagramNavbarProps {
  businessName: string;
  brandColor?: string;
  navbarBackgroundColor?: string;
  logoUrl?: string;
  fontClass?: string;
  ctaText?: string;
  fixed?: boolean;
}

const InstagramNavbar: React.FC<InstagramNavbarProps> = ({
  businessName,
  brandColor = "#8B5CF6",
  navbarBackgroundColor = "#FFFFFF",
  logoUrl,
  fontClass = "font-inter",
  ctaText = "Book Now",
  fixed = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Stories", href: "#stories" },
    { name: "Gallery", href: "#gallery" },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleCtaClick = () => {
    const bookingElement = document.querySelector('#booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`${fixed ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-gray-100/20 transition-all duration-300 ${fontClass}`}
        style={{ 
          backgroundColor: `${navbarBackgroundColor}f5`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <NavbarLogo
              businessName={businessName}
              brandColor={brandColor}
              logoUrl={logoUrl}
            />

            <DesktopNavigation
              navItems={navItems}
              brandColor={brandColor}
              onNavClick={handleNavClick}
            />

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <CTAButton
                  ctaText={ctaText}
                  brandColor={brandColor}
                  onCtaClick={handleCtaClick}
                />
              </div>

              <MobileMenuButton
                isOpen={isMobileMenuOpen}
                brandColor={brandColor}
                onToggle={toggleMobileMenu}
              />
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          navItems={navItems}
          brandColor={brandColor}
          navbarBackgroundColor={navbarBackgroundColor}
          ctaText={ctaText}
          onNavClick={handleNavClick}
          onCtaClick={handleCtaClick}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </nav>
    </>
  );
};

export default InstagramNavbar;
