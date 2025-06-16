
export const PRICING_TIERS = [
  { 
    value: 'lite', 
    label: 'Lite Plan', 
    price: '$2.99/month', 
    monthlyAmount: 299, 
    description: 'Up to 3 demo sites, Basic templates',
    features: ['3 Demo Sites', 'Basic Templates', 'Email Support']
  },
  { 
    value: 'pro', 
    label: 'Pro Plan', 
    price: '$5.99/month', 
    monthlyAmount: 599, 
    description: 'Up to 10 demo sites, Premium templates, Analytics',
    features: ['10 Demo Sites', 'Premium Templates', 'Analytics Dashboard', 'Priority Support']
  },
  { 
    value: 'business', 
    label: 'Business Plan', 
    price: '$9.99/month', 
    monthlyAmount: 999, 
    description: 'Unlimited sites, All templates, Advanced analytics',
    features: ['Unlimited Sites', 'All Templates', 'Advanced Analytics', 'White-label Options', 'Phone Support']
  }
];

export const SETUP_FEE = 9700; // $97 in cents
