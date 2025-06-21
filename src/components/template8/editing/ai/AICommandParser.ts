import { AIAction } from './AIActionImplementer';

export class AICommandParser {
  static parseCommand(userInput: string, currentSection: string): AIAction | null {
    const input = userInput.toLowerCase().trim();
    
    // Before/After Section Creation
    if (this.matchesPatterns(input, [
      'before and after',
      'before/after',
      'before after section',
      'comparison slider',
      'image comparison'
    ])) {
      return {
        type: 'create_component',
        section: currentSection,
        data: {
          componentType: 'before_after',
          replaceSection: currentSection === 'stories' ? 'stories' : null
        },
        description: 'Create stunning before/after comparison section'
      };
    }

    // Testimonial Carousel Creation
    if (this.matchesPatterns(input, [
      'testimonial carousel',
      'testimonials carousel',
      'customer reviews carousel',
      'review slider',
      'rotating testimonials'
    ])) {
      return {
        type: 'create_component',
        section: currentSection,
        data: {
          componentType: 'testimonial_carousel'
        },
        description: 'Create testimonial carousel with customer reviews'
      };
    }

    // Contact Form Creation
    if (this.matchesPatterns(input, [
      'contact form',
      'contact us form',
      'get in touch form',
      'inquiry form',
      'booking form'
    ])) {
      return {
        type: 'create_component',
        section: currentSection,
        data: {
          componentType: 'contact_form'
        },
        description: 'Create custom contact form'
      };
    }

    // Color Enhancement
    if (this.matchesPatterns(input, [
      'vibrant colors',
      'more vibrant',
      'enhance colors',
      'brighter colors',
      'saturated colors'
    ])) {
      return {
        type: 'update_styling',
        section: currentSection,
        data: {
          colorEnhancement: {
            saturationIncrease: 0.2,
            contrastImprovement: true
          }
        },
        description: 'Enhance colors to be more vibrant'
      };
    }

    // Gradient Background
    if (this.matchesPatterns(input, [
      'gradient background',
      'gradient hero',
      'background gradient',
      'hero gradient'
    ])) {
      return {
        type: 'update_styling',
        section: 'hero',
        data: {
          gradient: {
            type: 'linear',
            direction: 'to-br'
          }
        },
        description: 'Apply gradient background to hero section'
      };
    }

    // Hide Section Commands
    if (this.matchesPatterns(input, [
      'hide stories',
      'remove stories',
      'stories section hide',
      'hide story section'
    ])) {
      return {
        type: 'hide_section',
        section: 'stories',
        data: {},
        description: 'Hide stories section'
      };
    }

    if (this.matchesPatterns(input, [
      'hide testimonials',
      'remove testimonials',
      'testimonials section hide'
    ])) {
      return {
        type: 'hide_section',
        section: 'testimonials',
        data: {},
        description: 'Hide testimonials section'
      };
    }

    if (this.matchesPatterns(input, [
      'hide gallery',
      'remove gallery',
      'gallery section hide'
    ])) {
      return {
        type: 'hide_section',
        section: 'gallery',
        data: {},
        description: 'Hide gallery section'
      };
    }

    // Brand Color Changes
    if (this.matchesPatterns(input, [
      'change brand color',
      'update brand color',
      'new brand color',
      'different color'
    ])) {
      // Extract color if mentioned
      const colorMatch = input.match(/(blue|red|green|purple|pink|orange|yellow|teal|indigo)/);
      const colorMap: Record<string, string> = {
        blue: '#3B82F6',
        red: '#EF4444',
        green: '#10B981',
        purple: '#8B5CF6',
        pink: '#EC4899',
        orange: '#F97316',
        yellow: '#EAB308',
        teal: '#14B8A6',
        indigo: '#6366F1'
      };

      return {
        type: 'update_styling',
        section: currentSection,
        data: {
          brandColor: colorMatch ? colorMap[colorMatch[1]] : '#8B5CF6'
        },
        description: `Update brand color${colorMatch ? ` to ${colorMatch[1]}` : ''}`
      };
    }

    // Hero Background Modifications
    if (this.matchesPatterns(input, [
      'hero background',
      'change hero background',
      'update hero background',
      'new hero background'
    ])) {
      return {
        type: 'modify_section',
        section: 'hero',
        data: {
          heroBackground: {
            type: 'gradient',
            gradient: ['#8B5CF6', '#EC4899'],
            direction: 'to-br'
          }
        },
        description: 'Update hero section background'
      };
    }

    // Modern/Professional Styling
    if (this.matchesPatterns(input, [
      'more modern',
      'modern design',
      'professional look',
      'contemporary style'
    ])) {
      return {
        type: 'update_styling',
        section: currentSection,
        data: {
          modernStyling: {
            borderRadius: 'increased',
            shadows: 'enhanced',
            spacing: 'optimized',
            typography: 'modern'
          }
        },
        description: 'Apply modern, professional styling'
      };
    }

    return null;
  }

  private static matchesPatterns(input: string, patterns: string[]): boolean {
    return patterns.some(pattern => 
      input.includes(pattern) || 
      this.fuzzyMatch(input, pattern)
    );
  }

  private static fuzzyMatch(input: string, pattern: string): boolean {
    const inputWords = input.split(' ');
    const patternWords = pattern.split(' ');
    
    // Check if most pattern words are found in input
    const matchedWords = patternWords.filter(word => 
      inputWords.some(inputWord => 
        inputWord.includes(word) || word.includes(inputWord)
      )
    );
    
    return matchedWords.length >= Math.ceil(patternWords.length * 0.7);
  }

  static getCommandSuggestions(currentSection: string): string[] {
    const suggestions = [
      "Create a stunning before/after section",
      "Add a testimonial carousel",
      "Make the colors more vibrant",
      "Change the hero background to a gradient",
      "Hide the stories section",
      "Create a contact form",
      "Update the brand color to blue",
      "Make the design more modern"
    ];

    return suggestions;
  }

  static getContextualSuggestions(currentSection: string): string[] {
    const sectionSuggestions: Record<string, string[]> = {
      hero: [
        "Change the hero background to a gradient",
        "Update the brand color",
        "Make the hero more modern",
        "Add a hero image"
      ],
      stories: [
        "Replace with a before/after section",
        "Hide the stories section",
        "Create an image comparison slider"
      ],
      gallery: [
        "Add image hover effects",
        "Create a photo carousel",
        "Hide the gallery section"
      ],
      testimonials: [
        "Create a testimonial carousel",
        "Add more customer reviews",
        "Hide the testimonials section"
      ],
      booking: [
        "Create a contact form",
        "Add booking functionality",
        "Update call-to-action text"
      ]
    };

    return sectionSuggestions[currentSection] || this.getCommandSuggestions(currentSection);
  }
}

export default AICommandParser;