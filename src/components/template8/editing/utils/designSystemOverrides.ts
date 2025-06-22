// Design System Override Utilities
// Handles CSS variable overrides that allow Quick Editor to override design system tokens

export interface EnhancedSelectedElement {
  elementRole: string;
  sectionId: string;
  element: HTMLElement;
  [key: string]: any;
}

// Apply design system override using CSS custom properties
export const applyDesignSystemOverride = (
  element: HTMLElement, 
  property: string, 
  value: string, 
  enhancedElement: EnhancedSelectedElement
) => {
  // Generate unique CSS variable names for this element's overrides
  const elementId = enhancedElement.elementRole || element.tagName.toLowerCase();
  const sectionId = enhancedElement.sectionId || 'global';
  const overrideVar = `--quick-edit-${sectionId}-${elementId}-${property}`;
  
  // Apply the override to the document root so it's available globally
  document.documentElement.style.setProperty(overrideVar, value);
  
  // Create a high-specificity CSS class that uses the override variable
  const overrideClass = `quick-edit-override-${sectionId}-${elementId}-${property}`;
  
  // Check if the override CSS rule already exists
  let styleSheet = document.getElementById('quick-edit-overrides') as HTMLStyleElement;
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'quick-edit-overrides';
    document.head.appendChild(styleSheet);
  }
  
  // Generate CSS rule with high specificity that overrides design system
  const cssRule = `.quick-edit-container .${overrideClass} { ${property}: var(${overrideVar}) !important; }`;
  
  // Add the rule if it doesn't exist
  if (!styleSheet.textContent?.includes(overrideClass)) {
    styleSheet.textContent += cssRule + '\n';
  }
  
  // Apply the override class to the element
  element.classList.add(overrideClass);
  
  console.log('[DesignSystemOverrides] Applied override:', {
    element: elementId,
    section: sectionId,
    property,
    value,
    variable: overrideVar,
    class: overrideClass
  });
  
  // Store override in sessionStorage for persistence across editor switches
  const overrideKey = `quickEditOverrides_${sectionId}_${elementId}`;
  const existingOverrides = JSON.parse(sessionStorage.getItem(overrideKey) || '{}');
  existingOverrides[property] = value;
  sessionStorage.setItem(overrideKey, JSON.stringify(existingOverrides));
};

// Restore all design system overrides from sessionStorage
export const restoreDesignSystemOverrides = () => {
  const keys = Object.keys(sessionStorage).filter(key => key.startsWith('quickEditOverrides_'));
  
  keys.forEach(key => {
    const overrides = JSON.parse(sessionStorage.getItem(key) || '{}');
    const [, sectionId, elementId] = key.split('_');
    
    Object.entries(overrides).forEach(([property, value]) => {
      const overrideVar = `--quick-edit-${sectionId}-${elementId}-${property}`;
      document.documentElement.style.setProperty(overrideVar, value as string);
      
      const overrideClass = `quick-edit-override-${sectionId}-${elementId}-${property}`;
      
      // Ensure CSS rule exists
      let styleSheet = document.getElementById('quick-edit-overrides') as HTMLStyleElement;
      if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'quick-edit-overrides';
        document.head.appendChild(styleSheet);
      }
      
      const cssRule = `.quick-edit-container .${overrideClass} { ${property}: var(${overrideVar}) !important; }`;
      if (!styleSheet.textContent?.includes(overrideClass)) {
        styleSheet.textContent += cssRule + '\n';
      }
      
      // Apply class to matching elements (with a small delay to ensure DOM is ready)
      setTimeout(() => {
        const elements = document.querySelectorAll(`[data-section="${sectionId}"] [data-role="${elementId}"]`);
        elements.forEach(el => el.classList.add(overrideClass));
      }, 100);
    });
  });
  
  console.log(`[DesignSystemOverrides] Restored ${keys.length} override groups`);
};

// Clear all design system overrides
export const clearDesignSystemOverrides = () => {
  // Remove all override CSS variables
  const keys = Object.keys(sessionStorage).filter(key => key.startsWith('quickEditOverrides_'));
  keys.forEach(key => sessionStorage.removeItem(key));
  
  // Remove override stylesheet
  const styleSheet = document.getElementById('quick-edit-overrides');
  if (styleSheet) {
    styleSheet.remove();
  }
  
  // Remove all override CSS variables from document
  const documentStyle = document.documentElement.style;
  for (let i = documentStyle.length - 1; i >= 0; i--) {
    const property = documentStyle[i];
    if (property.startsWith('--quick-edit-')) {
      documentStyle.removeProperty(property);
    }
  }
  
  console.log('[DesignSystemOverrides] Cleared all overrides');
};

// Get all current design system overrides
export const getDesignSystemOverrides = () => {
  const keys = Object.keys(sessionStorage).filter(key => key.startsWith('quickEditOverrides_'));
  const allOverrides: Record<string, Record<string, string>> = {};
  
  keys.forEach(key => {
    const overrides = JSON.parse(sessionStorage.getItem(key) || '{}');
    allOverrides[key] = overrides;
  });
  
  return allOverrides;
};

// UNIVERSAL COLOR OVERRIDES - Works on ANY element regardless of design system
export const restoreUniversalColorOverrides = () => {
  const overrideKey = 'universalColorOverrides';
  const overrides = JSON.parse(sessionStorage.getItem(overrideKey) || '{}');
  
  if (Object.keys(overrides).length === 0) return;
  
  console.log('[DesignSystemOverrides] Restoring universal color overrides:', overrides);
  
  // Create or get the universal overrides stylesheet
  let styleSheet = document.getElementById('quick-edit-universal-overrides') as HTMLStyleElement;
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'quick-edit-universal-overrides';
    document.head.appendChild(styleSheet);
  }
  
  // Clear existing content
  styleSheet.textContent = '';
  
  // Apply each override
  Object.entries(overrides).forEach(([elementId, override]: [string, any]) => {
    const { color, selector } = override;
    
    // Create CSS rule for this element
    const cssRule = `${selector}, ${selector} * { color: ${color} !important; }`;
    styleSheet.textContent += cssRule + '\n';
    
    // Also apply direct inline styles to matching elements
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.color = color;
      htmlElement.style.setProperty('color', color, 'important');
      
      // Apply to child text nodes
      const textNodes = htmlElement.querySelectorAll('*');
      textNodes.forEach(child => {
        const childElement = child as HTMLElement;
        if (childElement.children.length === 0 && childElement.textContent?.trim()) {
          childElement.style.color = color;
          childElement.style.setProperty('color', color, 'important');
        }
      });
    });
  });
  
  console.log(`[DesignSystemOverrides] Restored ${Object.keys(overrides).length} universal color overrides`);
};

// Clear universal color overrides
export const clearUniversalColorOverrides = () => {
  sessionStorage.removeItem('universalColorOverrides');
  
  const styleSheet = document.getElementById('quick-edit-universal-overrides');
  if (styleSheet) {
    styleSheet.remove();
  }
  
  // Remove data attributes from elements
  const elements = document.querySelectorAll('[data-quick-edit-id]');
  elements.forEach(element => {
    element.removeAttribute('data-quick-edit-id');
    const htmlElement = element as HTMLElement;
    htmlElement.style.removeProperty('color');
  });
  
  console.log('[DesignSystemOverrides] Cleared all universal color overrides');
};