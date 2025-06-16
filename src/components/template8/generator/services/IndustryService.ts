export interface IndustryConfig {
  id: string;
  name: string;
  category: string;
  defaultServices: Array<{
    title: string;
    description: string;
    price: string;
    duration?: string;
  }>;
  brandColors: string[];
  fontFamily: string;
  taglineTemplates: string[];
  headlineTemplates: string[];
  subheadlineTemplates: string[];
  heroImageKeywords: string[];
  storyTemplates: Array<{
    title: string;
    ctaText: string;
  }>;
  testimonialTemplates: Array<{
    name: string;
    text: string;
    rating: number;
    service: string;
  }>;
}

export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  'barber': {
    id: 'barber',
    name: 'Barber',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Classic Men\'s Cut',
        description: 'Traditional barbering with precision and style',
        price: '$35',
        duration: '45 min'
      },
      {
        title: 'Beard Trim & Shape',
        description: 'Expert beard trimming and styling',
        price: '$25',
        duration: '30 min'
      },
      {
        title: 'Hot Towel Shave',
        description: 'Traditional straight razor shave with hot towel',
        price: '$45',
        duration: '60 min'
      }
    ],
    brandColors: ['#2D3748', '#4A5568', '#718096', '#E53E3E'],
    fontFamily: 'Inter',
    taglineTemplates: [
      'Sharp Cuts, Classic Style',
      'Where Tradition Meets Modern Style',
      'Crafting Confidence, One Cut at a Time'
    ],
    headlineTemplates: [
      'Master Barbering for the Modern Man',
      'Classic Cuts, Contemporary Style',
      'Expert Grooming & Traditional Service',
      'Your Local Neighborhood Barber'
    ],
    subheadlineTemplates: [
      'Experience traditional barbering with modern techniques in a relaxed, professional atmosphere',
      'From classic cuts to modern styles, our skilled barbers deliver precision grooming services you can trust',
      'Step into our shop for expert grooming services that keep you looking sharp and feeling confident',
      'Quality barbering services with attention to detail and a commitment to excellence in every cut'
    ],
    heroImageKeywords: ['barber shop', 'men\'s haircut', 'traditional barbering'],
    storyTemplates: [
      { title: 'New Client Special', ctaText: 'Book Your Cut' },
      { title: 'Beard Grooming', ctaText: 'Get Styled' },
      { title: 'Father & Son Cuts', ctaText: 'Book Together' }
    ],
    testimonialTemplates: [
      {
        name: 'Mike R.',
        text: 'Best barber in town! Always leaves me looking sharp.',
        rating: 5,
        service: 'Classic Men\'s Cut'
      },
      {
        name: 'James T.',
        text: 'Amazing beard trim. Exactly what I was looking for.',
        rating: 5,
        service: 'Beard Trim & Shape'
      },
      {
        name: 'Robert K.',
        text: 'The hot towel shave is incredible. Such a relaxing experience.',
        rating: 5,
        service: 'Hot Towel Shave'
      }
    ]
  },
  'hair-stylist': {
    id: 'hair-stylist',
    name: 'Hair Stylist',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Haircut & Style',
        description: 'Professional cut and styling for all hair types',
        price: '$75',
        duration: '90 min'
      },
      {
        title: 'Color Treatment',
        description: 'Full color, highlights, or touch-ups',
        price: '$150',
        duration: '2-3 hours'
      },
      {
        title: 'Blowout & Style',
        description: 'Professional blow dry and styling',
        price: '$45',
        duration: '45 min'
      }
    ],
    brandColors: ['#E91E63', '#9C27B0', '#673AB7', '#FF5722'],
    fontFamily: 'Playfair Display',
    taglineTemplates: [
      'Transform Your Look, Transform Your Life',
      'Where Beautiful Hair Begins',
      'Your Hair, Your Crown'
    ],
    headlineTemplates: [
      'Unleash Your Hair\'s Potential',
      'Expert Hair Styling & Color',
      'Professional Hair Transformation',
      'Your Dream Hair Awaits'
    ],
    subheadlineTemplates: [
      'Experience personalized hair care with our expert stylists who understand your unique style and needs',
      'From cuts to color, we create stunning looks that enhance your natural beauty and boost your confidence',
      'Professional salon services using premium products to give you the hair you\'ve always wanted',
      'Book your appointment today and discover why clients trust us with their most important style decisions'
    ],
    heroImageKeywords: ['hair salon', 'hair styling', 'professional haircut'],
    storyTemplates: [
      { title: 'New Client Special', ctaText: 'Book Now' },
      { title: 'Color Transformation', ctaText: 'Get Quote' },
      { title: 'Bridal Package', ctaText: 'Learn More' }
    ],
    testimonialTemplates: [
      {
        name: 'Sarah M.',
        text: 'Amazing color work! My hair has never looked better.',
        rating: 5,
        service: 'Color Treatment'
      },
      {
        name: 'Jessica L.',
        text: 'The best haircut I\'ve ever had. Highly recommend!',
        rating: 5,
        service: 'Haircut & Style'
      },
      {
        name: 'Amanda K.',
        text: 'Professional service and beautiful results every time.',
        rating: 5,
        service: 'Blowout & Style'
      }
    ]
  },
  'nail-tech': {
    id: 'nail-tech',
    name: 'Nail Technician',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Gel Manicure',
        description: 'Long-lasting gel polish manicure',
        price: '$45',
        duration: '60 min'
      },
      {
        title: 'Acrylic Extensions',
        description: 'Full set acrylic nail extensions',
        price: '$65',
        duration: '90 min'
      },
      {
        title: 'Nail Art Design',
        description: 'Custom nail art and designs',
        price: '$25',
        duration: '30 min'
      }
    ],
    brandColors: ['#FF1744', '#E91E63', '#9C27B0', '#FF6F00'],
    fontFamily: 'Inter',
    taglineTemplates: [
      'Nails That Make a Statement',
      'Perfect Nails, Perfect You',
      'Your Nails, Our Art'
    ],
    headlineTemplates: [
      'Beautiful Nails, Every Time',
      'Expert Nail Art & Care',
      'Premium Nail Services',
      'Nails That Turn Heads'
    ],
    subheadlineTemplates: [
      'Professional nail services using the finest products and latest techniques for stunning, long-lasting results',
      'From classic manicures to intricate nail art, we create beautiful nails that reflect your personal style',
      'Experience the difference of expert nail care in a relaxing, clean, and welcoming environment',
      'Book your appointment and treat yourself to the nail care you deserve with our skilled technicians'
    ],
    heroImageKeywords: ['nail salon', 'manicure', 'nail art'],
    storyTemplates: [
      { title: 'Gel Manicure Special', ctaText: 'Book Today' },
      { title: 'Custom Nail Art', ctaText: 'Design Now' },
      { title: 'Bridal Nails', ctaText: 'Schedule' }
    ],
    testimonialTemplates: [
      {
        name: 'Maria S.',
        text: 'Beautiful nail art that lasts weeks!',
        rating: 5,
        service: 'Nail Art Design'
      },
      {
        name: 'Lisa R.',
        text: 'Best gel manicure in town. Always perfect.',
        rating: 5,
        service: 'Gel Manicure'
      },
      {
        name: 'Emma T.',
        text: 'Love my acrylic extensions. So natural looking!',
        rating: 5,
        service: 'Acrylic Extensions'
      }
    ]
  },
  'esthetician': {
    id: 'esthetician',
    name: 'Esthetician',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'European Facial',
        description: 'Deep cleansing and rejuvenating facial treatment',
        price: '$85',
        duration: '75 min'
      },
      {
        title: 'Chemical Peel',
        description: 'Professional chemical exfoliation treatment',
        price: '$120',
        duration: '45 min'
      },
      {
        title: 'Microdermabrasion',
        description: 'Gentle skin resurfacing treatment',
        price: '$95',
        duration: '60 min'
      }
    ],
    brandColors: ['#4CAF50', '#66BB6A', '#81C784', '#E8F5E8'],
    fontFamily: 'Poppins',
    taglineTemplates: [
      'Reveal Your Natural Glow',
      'Healthy Skin, Confident You',
      'Where Skincare Meets Science'
    ],
    headlineTemplates: [
      'Transform Your Skin, Transform Your Confidence',
      'Professional Skincare Treatments',
      'Radiant Skin Awaits You',
      'Expert Facial & Skincare Services'
    ],
    subheadlineTemplates: [
      'Experience the power of professional skincare with customized treatments designed for your unique skin needs',
      'Our licensed estheticians use advanced techniques and premium products to reveal your healthiest, most radiant skin',
      'From anti-aging to acne treatment, we provide expert skincare solutions in a relaxing, spa-like environment',
      'Discover the difference professional skincare makes with treatments tailored specifically to your skin type and goals'
    ],
    heroImageKeywords: ['facial treatment', 'skincare', 'esthetician'],
    storyTemplates: [
      { title: 'First-Time Client Special', ctaText: 'Book Consultation' },
      { title: 'Anti-Aging Package', ctaText: 'Learn More' },
      { title: 'Acne Treatment Plan', ctaText: 'Get Started' }
    ],
    testimonialTemplates: [
      {
        name: 'Jennifer K.',
        text: 'My skin has never looked better! Such professional care.',
        rating: 5,
        service: 'European Facial'
      },
      {
        name: 'Ashley M.',
        text: 'The chemical peel gave me amazing results. Highly recommend!',
        rating: 5,
        service: 'Chemical Peel'
      },
      {
        name: 'Rachel D.',
        text: 'Expert knowledge and such a relaxing experience.',
        rating: 5,
        service: 'Microdermabrasion'
      }
    ]
  },
  'makeup-artist': {
    id: 'makeup-artist',
    name: 'Makeup Artist',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Bridal Makeup',
        description: 'Complete bridal makeup including trial',
        price: '$200',
        duration: '2 hours'
      },
      {
        title: 'Special Event Makeup',
        description: 'Professional makeup for special occasions',
        price: '$85',
        duration: '60 min'
      },
      {
        title: 'Makeup Lesson',
        description: 'Learn professional makeup techniques',
        price: '$120',
        duration: '90 min'
      }
    ],
    brandColors: ['#E91E63', '#F06292', '#FFB74D', '#FFECB3'],
    fontFamily: 'Playfair Display',
    taglineTemplates: [
      'Enhance Your Natural Beauty',
      'Artistry That Inspires',
      'Where Beauty Meets Art'
    ],
    headlineTemplates: [
      'Professional Makeup Artistry',
      'Bring Out Your Best Self',
      'Expert Makeup for Every Occasion',
      'Beauty That Makes a Statement'
    ],
    subheadlineTemplates: [
      'Professional makeup artistry for weddings, special events, and photoshoots with techniques that enhance your natural beauty',
      'From bridal glam to everyday elegance, our expert makeup artists create looks that make you feel confident and beautiful',
      'Experience the artistry of professional makeup with personalized looks designed to complement your unique features',
      'Let our skilled makeup artists create the perfect look for your special day with premium products and expert techniques'
    ],
    heroImageKeywords: ['makeup artist', 'bridal makeup', 'beauty'],
    storyTemplates: [
      { title: 'Bridal Package', ctaText: 'Book Trial' },
      { title: 'Photo Shoot Ready', ctaText: 'Get Glam' },
      { title: 'Makeup Lessons', ctaText: 'Learn Now' }
    ],
    testimonialTemplates: [
      {
        name: 'Emily R.',
        text: 'Absolutely stunning bridal makeup! Felt like a princess.',
        rating: 5,
        service: 'Bridal Makeup'
      },
      {
        name: 'Sophia L.',
        text: 'Perfect makeup for my photo shoot. So professional!',
        rating: 5,
        service: 'Special Event Makeup'
      },
      {
        name: 'Madison T.',
        text: 'Learned so much in my makeup lesson. Amazing teacher!',
        rating: 5,
        service: 'Makeup Lesson'
      }
    ]
  },
  'lash-technician': {
    id: 'lash-technician',
    name: 'Lash Technician',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Classic Lash Extensions',
        description: 'Natural-looking individual lash extensions',
        price: '$120',
        duration: '2 hours'
      },
      {
        title: 'Volume Lash Extensions',
        description: 'Fuller, dramatic volume lash extensions',
        price: '$150',
        duration: '2.5 hours'
      },
      {
        title: 'Lash Lift & Tint',
        description: 'Natural lash enhancement with lift and tint',
        price: '$75',
        duration: '60 min'
      }
    ],
    brandColors: ['#9C27B0', '#BA68C8', '#E1BEE7', '#F3E5F5'],
    fontFamily: 'Poppins',
    taglineTemplates: [
      'Eyes That Captivate',
      'Lashes That Wow',
      'Wake Up Beautiful'
    ],
    headlineTemplates: [
      'Stunning Lash Extensions',
      'Beautiful Lashes, Every Day',
      'Professional Lash Artistry',
      'Enhance Your Natural Beauty'
    ],
    subheadlineTemplates: [
      'Professional lash extension services using premium products and expert techniques for naturally beautiful, long-lasting results',
      'Wake up every morning with perfect lashes that enhance your natural beauty and save you time in your daily routine',
      'From natural enhancement to dramatic volume, our certified lash technicians create customized looks just for you',
      'Experience the confidence that comes with beautiful, professionally applied lash extensions that last for weeks'
    ],
    heroImageKeywords: ['lash extensions', 'eyelashes', 'beauty treatment'],
    storyTemplates: [
      { title: 'First Set Special', ctaText: 'Book Now' },
      { title: 'Volume Upgrade', ctaText: 'Get Dramatic' },
      { title: 'Lash Lift Special', ctaText: 'Natural Lift' }
    ],
    testimonialTemplates: [
      {
        name: 'Olivia P.',
        text: 'Best lash extensions ever! They look so natural and beautiful.',
        rating: 5,
        service: 'Classic Lash Extensions'
      },
      {
        name: 'Isabella M.',
        text: 'Love my volume lashes! Such dramatic and gorgeous results.',
        rating: 5,
        service: 'Volume Lash Extensions'
      },
      {
        name: 'Ava S.',
        text: 'The lash lift gave me perfect natural lashes. Amazing!',
        rating: 5,
        service: 'Lash Lift & Tint'
      }
    ]
  },
  'massage-therapist': {
    id: 'massage-therapist',
    name: 'Massage Therapist',
    category: 'Wellness',
    defaultServices: [
      {
        title: 'Swedish Relaxation Massage',
        description: 'Full body relaxation massage therapy',
        price: '$90',
        duration: '60 min'
      },
      {
        title: 'Deep Tissue Massage',
        description: 'Therapeutic deep tissue muscle work',
        price: '$110',
        duration: '60 min'
      },
      {
        title: 'Hot Stone Massage',
        description: 'Relaxing massage with heated stones',
        price: '$130',
        duration: '75 min'
      }
    ],
    brandColors: ['#795548', '#8D6E63', '#A1887F', '#D7CCC8'],
    fontFamily: 'Merriweather',
    taglineTemplates: [
      'Healing Touch, Peaceful Mind',
      'Restore Your Body & Soul',
      'Therapeutic Wellness'
    ],
    headlineTemplates: [
      'Professional Massage Therapy',
      'Therapeutic Healing & Relaxation',
      'Restore Your Body Naturally',
      'Expert Therapeutic Massage'
    ],
    subheadlineTemplates: [
      'Licensed massage therapy services designed to relieve pain, reduce stress, and promote healing through expert therapeutic touch',
      'Experience the healing power of professional massage therapy in a peaceful, relaxing environment designed for your wellness',
      'Our certified massage therapists provide customized treatments to address your specific needs and promote overall wellness',
      'Discover relief from pain and stress with therapeutic massage treatments tailored to your body\'s unique needs'
    ],
    heroImageKeywords: ['massage therapy', 'spa treatment', 'wellness'],
    storyTemplates: [
      { title: 'Stress Relief Package', ctaText: 'Book Session' },
      { title: 'Pain Management', ctaText: 'Get Relief' },
      { title: 'Couples Massage', ctaText: 'Relax Together' }
    ],
    testimonialTemplates: [
      {
        name: 'Michael J.',
        text: 'Amazing therapeutic massage! Feel so much better.',
        rating: 5,
        service: 'Deep Tissue Massage'
      },
      {
        name: 'Sarah W.',
        text: 'So relaxing and professional. Best massage ever!',
        rating: 5,
        service: 'Swedish Relaxation Massage'
      },
      {
        name: 'David K.',
        text: 'Hot stone massage was incredible. So therapeutic!',
        rating: 5,
        service: 'Hot Stone Massage'
      }
    ]
  },
  'brow-specialist': {
    id: 'brow-specialist',
    name: 'Brow Specialist',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Brow Shaping & Design',
        description: 'Professional eyebrow shaping and design',
        price: '$45',
        duration: '30 min'
      },
      {
        title: 'Microblading',
        description: 'Semi-permanent eyebrow enhancement',
        price: '$350',
        duration: '2.5 hours'
      },
      {
        title: 'Brow Lamination',
        description: 'Brow styling treatment for fuller look',
        price: '$65',
        duration: '45 min'
      }
    ],
    brandColors: ['#6D4C41', '#8D6E63', '#BCAAA4', '#EFEBE9'],
    fontFamily: 'Lato',
    taglineTemplates: [
      'Perfect Brows, Perfect You',
      'Frame Your Face Beautifully',
      'Brow Artistry at Its Best'
    ],
    headlineTemplates: [
      'Expert Eyebrow Services',
      'Beautiful Brows, Every Day',
      'Professional Brow Artistry',
      'Transform Your Brows'
    ],
    subheadlineTemplates: [
      'Professional eyebrow services including shaping, microblading, and lamination to enhance your natural beauty',
      'Expert brow artistry that frames your face perfectly with techniques tailored to your unique features and style',
      'From classic shaping to semi-permanent microblading, we create beautiful brows that enhance your confidence',
      'Transform your brows with our professional services designed to give you perfectly shaped eyebrows every day'
    ],
    heroImageKeywords: ['eyebrow shaping', 'microblading', 'brow treatment'],
    storyTemplates: [
      { title: 'Brow Transformation', ctaText: 'Book Now' },
      { title: 'Microblading Special', ctaText: 'Learn More' },
      { title: 'Brow Maintenance', ctaText: 'Schedule' }
    ],
    testimonialTemplates: [
      {
        name: 'Taylor B.',
        text: 'My brows look amazing! Such professional work.',
        rating: 5,
        service: 'Brow Shaping & Design'
      },
      {
        name: 'Hannah C.',
        text: 'Best microblading experience! Love my new brows.',
        rating: 5,
        service: 'Microblading'
      },
      {
        name: 'Chloe A.',
        text: 'Brow lamination gave me the fullest brows ever!',
        rating: 5,
        service: 'Brow Lamination'
      }
    ]
  },
  'permanent-makeup': {
    id: 'permanent-makeup',
    name: 'Permanent Makeup Artist',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Microblading Eyebrows',
        description: 'Natural-looking eyebrow microblading',
        price: '$400',
        duration: '3 hours'
      },
      {
        title: 'Lip Blushing',
        description: 'Semi-permanent lip color enhancement',
        price: '$350',
        duration: '2.5 hours'
      },
      {
        title: 'Permanent Eyeliner',
        description: 'Long-lasting eyeliner application',
        price: '$300',
        duration: '2 hours'
      }
    ],
    brandColors: ['#AD1457', '#C2185B', '#E91E63', '#F8BBD9'],
    fontFamily: 'Playfair Display',
    taglineTemplates: [
      'Wake Up Beautiful Every Day',
      'Effortless Beauty, Lasting Results',
      'Professional Permanent Makeup'
    ],
    headlineTemplates: [
      'Semi-Permanent Beauty Solutions',
      'Wake Up With Perfect Makeup',
      'Professional Cosmetic Tattooing',
      'Effortless Beauty Every Day'
    ],
    subheadlineTemplates: [
      'Professional semi-permanent makeup services including microblading, lip blushing, and eyeliner for effortless daily beauty',
      'Wake up every morning with perfect makeup that saves time and enhances your natural features with lasting results',
      'Expert cosmetic tattooing services using advanced techniques and premium pigments for natural, beautiful results',
      'Transform your daily routine with professional permanent makeup that enhances your features and boosts confidence'
    ],
    heroImageKeywords: ['permanent makeup', 'cosmetic tattoo', 'microblading'],
    storyTemplates: [
      { title: 'Microblading Special', ctaText: 'Book Consultation' },
      { title: 'Lip Enhancement', ctaText: 'Get Luscious Lips' },
      { title: 'Perfect Eyeliner', ctaText: 'Never Smudge Again' }
    ],
    testimonialTemplates: [
      {
        name: 'Victoria S.',
        text: 'Love my microbladed brows! So natural and perfect.',
        rating: 5,
        service: 'Microblading Eyebrows'
      },
      {
        name: 'Natalie R.',
        text: 'Lip blushing gave me the perfect natural color!',
        rating: 5,
        service: 'Lip Blushing'
      },
      {
        name: 'Samantha K.',
        text: 'Perfect eyeliner every day! Best decision ever.',
        rating: 5,
        service: 'Permanent Eyeliner'
      }
    ]
  },
  'spray-tan': {
    id: 'spray-tan',
    name: 'Spray Tan Specialist',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Custom Spray Tan',
        description: 'Professional airbrush tan application',
        price: '$55',
        duration: '30 min'
      },
      {
        title: 'Bridal Tan Package',
        description: 'Complete bridal tanning package with trial',
        price: '$120',
        duration: '60 min'
      },
      {
        title: 'Mobile Spray Tan',
        description: 'Professional spray tan at your location',
        price: '$75',
        duration: '45 min'
      }
    ],
    brandColors: ['#FF8A65', '#FFAB91', '#FFCCBC', '#FFF3E0'],
    fontFamily: 'Nunito',
    taglineTemplates: [
      'Golden Glow, Year Round',
      'Safe Sun-Kissed Beauty',
      'Your Perfect Tan Awaits'
    ],
    headlineTemplates: [
      'Professional Spray Tan Services',
      'Custom Airbrush Tanning',
      'Safe, Beautiful Tanning',
      'Glow Without the Sun'
    ],
    subheadlineTemplates: [
      'Professional spray tanning services using premium, organic solutions for a natural, sun-kissed glow without UV damage',
      'Get the perfect golden tan year-round with our custom airbrush tanning that enhances your natural beauty safely',
      'Expert spray tan application with personalized color matching for a flawless, streak-free tan that looks natural',
      'Achieve a beautiful, healthy-looking tan without sun exposure using our professional-grade tanning solutions'
    ],
    heroImageKeywords: ['spray tan', 'airbrush tan', 'golden glow'],
    storyTemplates: [
      { title: 'First Tan Special', ctaText: 'Get Glowing' },
      { title: 'Event Ready Tan', ctaText: 'Book Now' },
      { title: 'Mobile Service', ctaText: 'At-Home Tan' }
    ],
    testimonialTemplates: [
      {
        name: 'Brooke T.',
        text: 'Perfect natural-looking tan! Love the results.',
        rating: 5,
        service: 'Custom Spray Tan'
      },
      {
        name: 'Kaitlyn M.',
        text: 'Amazing bridal package! Looked perfect for my wedding.',
        rating: 5,
        service: 'Bridal Tan Package'
      },
      {
        name: 'Lauren H.',
        text: 'Mobile service was so convenient and professional!',
        rating: 5,
        service: 'Mobile Spray Tan'
      }
    ]
  },
  'waxing-specialist': {
    id: 'waxing-specialist',
    name: 'Waxing Specialist',
    category: 'Beauty',
    defaultServices: [
      {
        title: 'Brazilian Wax',
        description: 'Complete intimate area waxing service',
        price: '$65',
        duration: '30 min'
      },
      {
        title: 'Full Leg Wax',
        description: 'Complete leg hair removal service',
        price: '$75',
        duration: '45 min'
      },
      {
        title: 'Eyebrow Wax',
        description: 'Professional eyebrow shaping and wax',
        price: '$25',
        duration: '15 min'
      }
    ],
    brandColors: ['#8BC34A', '#9CCC65', '#AED581', '#DCEDC8'],
    fontFamily: 'Open Sans',
    taglineTemplates: [
      'Smooth Skin, Confident You',
      'Professional Hair Removal',
      'Silky Smooth Results'
    ],
    headlineTemplates: [
      'Expert Waxing Services',
      'Professional Hair Removal',
      'Smooth, Beautiful Skin',
      'Gentle, Effective Waxing'
    ],
    subheadlineTemplates: [
      'Professional waxing services using premium products and gentle techniques for smooth, long-lasting hair removal results',
      'Experience comfortable, effective hair removal with our expert waxing specialists in a clean, private environment',
      'Get silky smooth skin with our professional waxing services designed for your comfort and beautiful results',
      'Trust our experienced waxing specialists for gentle, thorough hair removal that leaves your skin smooth and beautiful'
    ],
    heroImageKeywords: ['waxing service', 'hair removal', 'smooth skin'],
    storyTemplates: [
      { title: 'First-Time Special', ctaText: 'Book Now' },
      { title: 'Summer Ready', ctaText: 'Get Smooth' },
      { title: 'Monthly Package', ctaText: 'Save More' }
    ],
    testimonialTemplates: [
      {
        name: 'Megan F.',
        text: 'Best waxing experience! So professional and gentle.',
        rating: 5,
        service: 'Brazilian Wax'
      },
      {
        name: 'Ashley G.',
        text: 'Amazing results! Skin is so smooth and beautiful.',
        rating: 5,
        service: 'Full Leg Wax'
      },
      {
        name: 'Nicole J.',
        text: 'Perfect eyebrow shape every time. Love coming here!',
        rating: 5,
        service: 'Eyebrow Wax'
      }
    ]
  },
  'photographer': {
    id: 'photographer',
    name: 'Photographer',
    category: 'Creative',
    defaultServices: [
      {
        title: 'Portrait Session',
        description: 'Professional portrait photography',
        price: '$200',
        duration: '2 hours'
      },
      {
        title: 'Event Photography',
        description: 'Complete event coverage',
        price: '$500',
        duration: '4-6 hours'
      },
      {
        title: 'Wedding Package',
        description: 'Full wedding day photography',
        price: '$1500',
        duration: '8 hours'
      }
    ],
    brandColors: ['#37474F', '#455A64', '#546E7A', '#FF7043'],
    fontFamily: 'Playfair Display',
    taglineTemplates: [
      'Capturing Life\'s Beautiful Moments',
      'Your Story Through My Lens',
      'Timeless Memories, Perfect Shots'
    ],
    headlineTemplates: [
      'Capturing Your Perfect Moments',
      'Professional Photography Services',
      'Stories Worth Remembering',
      'Moments Made Timeless'
    ],
    subheadlineTemplates: [
      'Professional photography services that capture the essence of your special moments with artistic vision and technical expertise',
      'From intimate portraits to grand celebrations, we create stunning visual stories that you\'ll treasure forever',
      'Award-winning photographer specializing in capturing authentic emotions and beautiful compositions for every occasion',
      'Let us preserve your most precious memories with our creative eye and professional approach to photography'
    ],
    heroImageKeywords: ['photographer', 'camera', 'photography studio'],
    storyTemplates: [
      { title: 'Portrait Sessions', ctaText: 'Book Now' },
      { title: 'Wedding Packages', ctaText: 'View Packages' },
      { title: 'Event Coverage', ctaText: 'Get Quote' }
    ],
    testimonialTemplates: [
      {
        name: 'David & Sarah',
        text: 'Our wedding photos are absolutely stunning!',
        rating: 5,
        service: 'Wedding Package'
      },
      {
        name: 'Rachel M.',
        text: 'Professional and creative. Love my portraits!',
        rating: 5,
        service: 'Portrait Session'
      },
      {
        name: 'Tom K.',
        text: 'Captured our event perfectly. Highly recommend!',
        rating: 5,
        service: 'Event Photography'
      }
    ]
  }
};

export class IndustryService {
  static getIndustries(): IndustryConfig[] {
    return Object.values(INDUSTRY_CONFIGS);
  }

  static getIndustryById(id: string): IndustryConfig | null {
    return INDUSTRY_CONFIGS[id] || null;
  }

  static getIndustriesByCategory(category: string): IndustryConfig[] {
    return Object.values(INDUSTRY_CONFIGS).filter(industry => industry.category === category);
  }

  static generateIndustryContent(industryId: string, businessName: string) {
    const industry = this.getIndustryById(industryId);
    if (!industry) {
      // Fallback for custom industries
      return {
        services: [
          {
            title: 'Professional Service',
            description: 'Expert service tailored to your needs',
            price: '$75',
            duration: '60 min'
          },
          {
            title: 'Premium Package',
            description: 'Comprehensive service package',
            price: '$150',
            duration: '90 min'
          },
          {
            title: 'Consultation',
            description: 'Initial consultation and planning',
            price: '$50',
            duration: '30 min'
          }
        ],
        brandColor: '#8B5CF6',
        fontFamily: 'Inter',
        tagline: `Professional ${businessName} Services`,
        headline: `Expert ${businessName} You Can Trust`,
        subheadline: 'Professional services delivered with expertise and care to meet your unique needs and exceed your expectations',
        stories: [
          { title: 'Book Appointment', ctaText: 'Schedule Now' },
          { title: 'Learn More', ctaText: 'Get Info' },
          { title: 'Contact Us', ctaText: 'Get Quote' }
        ],
        testimonials: [
          {
            name: 'Alex M.',
            text: 'Outstanding service and professional results!',
            rating: 5,
            service: 'Professional Service'
          },
          {
            name: 'Jordan K.',
            text: 'Highly recommend! Exceeded all expectations.',
            rating: 5,
            service: 'Premium Package'
          },
          {
            name: 'Casey L.',
            text: 'Great consultation and helpful guidance.',
            rating: 5,
            service: 'Consultation'
          }
        ],
        heroImageKeywords: ['professional service', 'business', 'consultation']
      };
    }

    return {
      services: industry.defaultServices,
      brandColor: industry.brandColors[0],
      fontFamily: industry.fontFamily,
      tagline: industry.taglineTemplates[0].replace('Your', businessName),
      headline: industry.headlineTemplates[0],
      subheadline: industry.subheadlineTemplates[0],
      stories: industry.storyTemplates,
      testimonials: industry.testimonialTemplates,
      heroImageKeywords: industry.heroImageKeywords
    };
  }
}
