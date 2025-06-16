/**
 * Enhanced Unsplash Image Service for Production-Quality Designs
 * Provides sophisticated image curation based on industry, brand vibe, and quality standards
 */

type BrandVibe = 'bold' | 'modern' | 'feminine' | 'luxury';
type ImageCategory = 'hero' | 'gallery' | 'service' | 'about' | 'story' | 'testimonial';

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}

class UnsplashImageService {
  private static readonly BASE_URL = 'https://images.unsplash.com';

  // Premium curated image collections by industry and brand vibe
  private static readonly PREMIUM_IMAGE_COLLECTIONS = {
    hair_stylist: {
      luxury: {
        hero: [
          'photo-1560066984-138dadb4c035?w=1400&q=95&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1400&q=95&auto=format&fit=crop',
          'photo-1580618672591-eb180b1a973f?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1560066984-138dadb4c035?w=1200&q=95&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1200&q=95&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1200&q=95&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1200&q=95&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1200&q=95&auto=format&fit=crop',
          'photo-1527799820374-dcf8d9d4a388?w=1200&q=95&auto=format&fit=crop',
          'photo-1521590832167-7bcbfaa6381f?w=1200&q=95&auto=format&fit=crop',
          'photo-1607043225024-bb94eb8c1097?w=1200&q=95&auto=format&fit=crop',
          'photo-1580618672591-eb180b1a973f?w=1200&q=95&auto=format&fit=crop',
          'photo-1492106087820-71f1a00d2b11?w=1200&q=95&auto=format&fit=crop'
        ]
      },
      modern: {
        hero: [
          'photo-1560066984-138dadb4c035?w=1400&q=90&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1560066984-138dadb4c035?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1000&q=90&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1000&q=90&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1000&q=90&auto=format&fit=crop',
          'photo-1527799820374-dcf8d9d4a388?w=1000&q=90&auto=format&fit=crop',
          'photo-1521590832167-7bcbfaa6381f?w=1000&q=90&auto=format&fit=crop',
          'photo-1607043225024-bb94eb8c1097?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      feminine: {
        hero: [
          'photo-1560066984-138dadb4c035?w=1400&q=90&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1560066984-138dadb4c035?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1000&q=90&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1000&q=90&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1000&q=90&auto=format&fit=crop',
          'photo-1527799820374-dcf8d9d4a388?w=1000&q=90&auto=format&fit=crop',
          'photo-1521590832167-7bcbfaa6381f?w=1000&q=90&auto=format&fit=crop',
          'photo-1607043225024-bb94eb8c1097?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      bold: {
        hero: [
          'photo-1560066984-138dadb4c035?w=1400&q=90&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1560066984-138dadb4c035?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337660859-02fbefca4702?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1000&q=90&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1000&q=90&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1000&q=90&auto=format&fit=crop',
          'photo-1527799820374-dcf8d9d4a388?w=1000&q=90&auto=format&fit=crop',
          'photo-1521590832167-7bcbfaa6381f?w=1000&q=90&auto=format&fit=crop',
          'photo-1607043225024-bb94eb8c1097?w=1000&q=90&auto=format&fit=crop'
        ]
      }
    },
    barber: {
      luxury: {
        hero: [
          'photo-1622286342621-4bd786c2447c?w=1400&q=95&auto=format&fit=crop',
          'photo-1503951914875-452162b0f3f1?w=1400&q=95&auto=format&fit=crop',
          'photo-1605497788044-5a32c7078486?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1622286342621-4bd786c2447c?w=1200&q=95&auto=format&fit=crop',
          'photo-1503951914875-452162b0f3f1?w=1200&q=95&auto=format&fit=crop',
          'photo-1615043772321-b94860b6be7b?w=1200&q=95&auto=format&fit=crop',
          'photo-1605497788044-5a32c7078486?w=1200&q=95&auto=format&fit=crop',
          'photo-1621605815971-fbc98d665033?w=1200&q=95&auto=format&fit=crop',
          'photo-1634449571010-02389ed0f9b0?w=1200&q=95&auto=format&fit=crop',
          'photo-1493256338651-d82f7acb2b38?w=1200&q=95&auto=format&fit=crop',
          'photo-1512690245412-7341df2b5d5f?w=1200&q=95&auto=format&fit=crop',
          'photo-1585747501537-2c0d03a31d4e?w=1200&q=95&auto=format&fit=crop',
          'photo-1599351431202-1e0f0137899a?w=1200&q=95&auto=format&fit=crop'
        ]
      },
      modern: {
        hero: [
          'photo-1622286342621-4bd786c2447c?w=1400&q=95&auto=format&fit=crop',
          'photo-1503951914875-452162b0f3f1?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1622286342621-4bd786c2447c?w=1200&q=95&auto=format&fit=crop',
          'photo-1503951914875-452162b0f3f1?w=1200&q=95&auto=format&fit=crop',
          'photo-1615043772321-b94860b6be7b?w=1200&q=95&auto=format&fit=crop',
          'photo-1605497788044-5a32c7078486?w=1200&q=95&auto=format&fit=crop',
          'photo-1621605815971-fbc98d665033?w=1200&q=95&auto=format&fit=crop',
          'photo-1634449571010-02389ed0f9b0?w=1200&q=95&auto=format&fit=crop',
          'photo-1493256338651-d82f7acb2b38?w=1200&q=95&auto=format&fit=crop',
          'photo-1512690245412-7341df2b5d5f?w=1200&q=95&auto=format&fit=crop'
        ]
      },
      feminine: {
        hero: [
          'photo-1622286342621-4bd786c2447c?w=1400&q=95&auto=format&fit=crop',
          'photo-1605497788044-5a32c7078486?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1622286342621-4bd786c2447c?w=1200&q=95&auto=format&fit=crop',
          'photo-1503951914875-452162b0f3f1?w=1200&q=95&auto=format&fit=crop',
          'photo-1615043772321-b94860b6be7b?w=1200&q=95&auto=format&fit=crop',
          'photo-1605497788044-5a32c7078486?w=1200&q=95&auto=format&fit=crop',
          'photo-1621605815971-fbc98d665033?w=1200&q=95&auto=format&fit=crop',
          'photo-1634449571010-02389ed0f9b0?w=1200&q=95&auto=format&fit=crop',
          'photo-1493256338651-d82f7acb2b38?w=1200&q=95&auto=format&fit=crop',
          'photo-1512690245412-7341df2b5d5f?w=1200&q=95&auto=format&fit=crop'
        ]
      },
      bold: {
        hero: [
          'photo-1622286342621-4bd786c2447c?w=1400&q=95&auto=format&fit=crop',
          'photo-1503951914875-452162b0f3f1?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1622286342621-4bd786c2447c?w=1200&q=95&auto=format&fit=crop',
          'photo-1503951914875-452162b0f3f1?w=1200&q=95&auto=format&fit=crop',
          'photo-1615043772321-b94860b6be7b?w=1200&q=95&auto=format&fit=crop',
          'photo-1605497788044-5a32c7078486?w=1200&q=95&auto=format&fit=crop',
          'photo-1621605815971-fbc98d665033?w=1200&q=95&auto=format&fit=crop',
          'photo-1634449571010-02389ed0f9b0?w=1200&q=95&auto=format&fit=crop',
          'photo-1493256338651-d82f7acb2b38?w=1200&q=95&auto=format&fit=crop',
          'photo-1512690245412-7341df2b5d5f?w=1200&q=95&auto=format&fit=crop'
        ]
      }
    },
    nail_techs: {
      luxury: {
        hero: [
          'photo-1604654894610-df63bc536371?w=1400&q=95&auto=format&fit=crop',
          'photo-1604654866850-56621d7b2168?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1604654894610-df63bc536371?w=1200&q=95&auto=format&fit=crop',
          'photo-1604654866850-56621d7b2168?w=1200&q=95&auto=format&fit=crop',
          'photo-1588942792851-6ac90a24b47b?w=1200&q=95&auto=format&fit=crop',
          'photo-1601925229837-a4c5c7e4c0ae?w=1200&q=95&auto=format&fit=crop',
          'photo-1610992015762-45dca7e7928b?w=1200&q=95&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1200&q=95&auto=format&fit=crop',
          'photo-1503236823255-94609f598e71?w=1200&q=95&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1200&q=95&auto=format&fit=crop',
          'photo-1576426863848-c21f53c60b19?w=1200&q=95&auto=format&fit=crop',
          'photo-1559827260-dc66d52bef19?w=1200&q=95&auto=format&fit=crop'
        ]
      },
      modern: {
        hero: [
          'photo-1604654894610-df63bc536371?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1604654894610-df63bc536371?w=1000&q=90&auto=format&fit=crop',
          'photo-1604654866850-56621d7b2168?w=1000&q=90&auto=format&fit=crop',
          'photo-1588942792851-6ac90a24b47b?w=1000&q=90&auto=format&fit=crop',
          'photo-1601925229837-a4c5c7e4c0ae?w=1000&q=90&auto=format&fit=crop',
          'photo-1610992015762-45dca7e7928b?w=1000&q=90&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1000&q=90&auto=format&fit=crop',
          'photo-1503236823255-94609f598e71?w=1000&q=90&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      feminine: {
        hero: [
          'photo-1604654894610-df63bc536371?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1604654894610-df63bc536371?w=1000&q=90&auto=format&fit=crop',
          'photo-1604654866850-56621d7b2168?w=1000&q=90&auto=format&fit=crop',
          'photo-1588942792851-6ac90a24b47b?w=1000&q=90&auto=format&fit=crop',
          'photo-1601925229837-a4c5c7e4c0ae?w=1000&q=90&auto=format&fit=crop',
          'photo-1610992015762-45dca7e7928b?w=1000&q=90&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1000&q=90&auto=format&fit=crop',
          'photo-1503236823255-94609f598e71?w=1000&q=90&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      bold: {
        hero: [
          'photo-1604654894610-df63bc536371?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1604654894610-df63bc536371?w=1000&q=90&auto=format&fit=crop',
          'photo-1604654866850-56621d7b2168?w=1000&q=90&auto=format&fit=crop',
          'photo-1588942792851-6ac90a24b47b?w=1000&q=90&auto=format&fit=crop',
          'photo-1601925229837-a4c5c7e4c0ae?w=1000&q=90&auto=format&fit=crop',
          'photo-1610992015762-45dca7e7928b?w=1000&q=90&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1000&q=90&auto=format&fit=crop',
          'photo-1503236823255-94609f598e71?w=1000&q=90&auto=format&fit=crop',
          'photo-1595476108010-b4d1f102b1b1?w=1000&q=90&auto=format&fit=crop'
        ]
      }
    },
    estheticians: {
      luxury: {
        hero: [
          'photo-1616394584738-fc6e612e71b9?w=1400&q=95&auto=format&fit=crop',
          'photo-1560472354-b33ff0c44a43?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1616394584738-fc6e612e71b9?w=1200&q=95&auto=format&fit=crop',
          'photo-1560472354-b33ff0c44a43?w=1200&q=95&auto=format&fit=crop',
          'photo-1571019613454-1cb2f99b2d8b?w=1200&q=95&auto=format&fit=crop',
          'photo-1594824215933-a6c5f9f9d72a?w=1200&q=95&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1200&q=95&auto=format&fit=crop',
          'photo-1576426863848-c21f53c60b19?w=1200&q=95&auto=format&fit=crop',
          'photo-1570172619644-dfd03ed5d881?w=1200&q=95&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1200&q=95&auto=format&fit=crop',
          'photo-1559827260-dc66d52bef19?w=1200&q=95&auto=format&fit=crop',
          'photo-1559181567-c3190ca9959b?w=1200&q=95&auto=format&fit=crop'
        ]
      },
      modern: {
        hero: [
          'photo-1616394584738-fc6e612e71b9?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1616394584738-fc6e612e71b9?w=1000&q=90&auto=format&fit=crop',
          'photo-1560472354-b33ff0c44a43?w=1000&q=90&auto=format&fit=crop',
          'photo-1571019613454-1cb2f99b2d8b?w=1000&q=90&auto=format&fit=crop',
          'photo-1594824215933-a6c5f9f9d72a?w=1000&q=90&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1000&q=90&auto=format&fit=crop',
          'photo-1576426863848-c21f53c60b19?w=1000&q=90&auto=format&fit=crop',
          'photo-1570172619644-dfd03ed5d881?w=1000&q=90&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      feminine: {
        hero: [
          'photo-1616394584738-fc6e612e71b9?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1616394584738-fc6e612e71b9?w=1000&q=90&auto=format&fit=crop',
          'photo-1560472354-b33ff0c44a43?w=1000&q=90&auto=format&fit=crop',
          'photo-1571019613454-1cb2f99b2d8b?w=1000&q=90&auto=format&fit=crop',
          'photo-1594824215933-a6c5f9f9d72a?w=1000&q=90&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1000&q=90&auto=format&fit=crop',
          'photo-1576426863848-c21f53c60b19?w=1000&q=90&auto=format&fit=crop',
          'photo-1570172619644-dfd03ed5d881?w=1000&q=90&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      bold: {
        hero: [
          'photo-1616394584738-fc6e612e71b9?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1616394584738-fc6e612e71b9?w=1000&q=90&auto=format&fit=crop',
          'photo-1560472354-b33ff0c44a43?w=1000&q=90&auto=format&fit=crop',
          'photo-1571019613454-1cb2f99b2d8b?w=1000&q=90&auto=format&fit=crop',
          'photo-1594824215933-a6c5f9f9d72a?w=1000&q=90&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1000&q=90&auto=format&fit=crop',
          'photo-1576426863848-c21f53c60b19?w=1000&q=90&auto=format&fit=crop',
          'photo-1570172619644-dfd03ed5d881?w=1000&q=90&auto=format&fit=crop',
          'photo-1562004760-aceed7bb0fe3?w=1000&q=90&auto=format&fit=crop'
        ]
      }
    },
    makeup_artist: {
      luxury: {
        hero: [
          'photo-1487412947147-5cebf100ffc2?w=1400&q=95&auto=format&fit=crop',
          'photo-1596462502278-27bfdc403348?w=1400&q=95&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1487412947147-5cebf100ffc2?w=1200&q=95&auto=format&fit=crop',
          'photo-1596462502278-27bfdc403348?w=1200&q=95&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1200&q=95&auto=format&fit=crop',
          'photo-1561336313-0bd5e0b27ec8?w=1200&q=95&auto=format&fit=crop',
          'photo-1522337893183-7f2e363c2590?w=1200&q=95&auto=format&fit=crop',
          'photo-1502823403499-6ccfcf4fb453?w=1200&q=95&auto=format&fit=crop',
          'photo-1516975080664-ed2fc6a32937?w=1200&q=95&auto=format&fit=crop',
          'photo-1583001931096-959e9a1a6223?w=1200&q=95&auto=format&fit=crop',
          'photo-1515377905703-c4788e51af15?w=1200&q=95&auto=format&fit=crop',
          'photo-1560472354-b33ff0c44a43?w=1200&q=95&auto=format&fit=crop'
        ]
      },
      modern: {
        hero: [
          'photo-1487412947147-5cebf100ffc2?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1487412947147-5cebf100ffc2?w=1000&q=90&auto=format&fit=crop',
          'photo-1596462502278-27bfdc403348?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1000&q=90&auto=format&fit=crop',
          'photo-1561336313-0bd5e0b27ec8?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337893183-7f2e363c2590?w=1000&q=90&auto=format&fit=crop',
          'photo-1502823403499-6ccfcf4fb453?w=1000&q=90&auto=format&fit=crop',
          'photo-1516975080664-ed2fc6a32937?w=1000&q=90&auto=format&fit=crop',
          'photo-1583001931096-959e9a1a6223?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      feminine: {
        hero: [
          'photo-1487412947147-5cebf100ffc2?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1487412947147-5cebf100ffc2?w=1000&q=90&auto=format&fit=crop',
          'photo-1596462502278-27bfdc403348?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1000&q=90&auto=format&fit=crop',
          'photo-1561336313-0bd5e0b27ec8?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337893183-7f2e363c2590?w=1000&q=90&auto=format&fit=crop',
          'photo-1502823403499-6ccfcf4fb453?w=1000&q=90&auto=format&fit=crop',
          'photo-1516975080664-ed2fc6a32937?w=1000&q=90&auto=format&fit=crop',
          'photo-1583001931096-959e9a1a6223?w=1000&q=90&auto=format&fit=crop'
        ]
      },
      bold: {
        hero: [
          'photo-1487412947147-5cebf100ffc2?w=1400&q=90&auto=format&fit=crop'
        ],
        gallery: [
          'photo-1487412947147-5cebf100ffc2?w=1000&q=90&auto=format&fit=crop',
          'photo-1596462502278-27bfdc403348?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337360788-8b13dee7a37e?w=1000&q=90&auto=format&fit=crop',
          'photo-1561336313-0bd5e0b27ec8?w=1000&q=90&auto=format&fit=crop',
          'photo-1522337893183-7f2e363c2590?w=1000&q=90&auto=format&fit=crop',
          'photo-1502823403499-6ccfcf4fb453?w=1000&q=90&auto=format&fit=crop',
          'photo-1516975080664-ed2fc6a32937?w=1000&q=90&auto=format&fit=crop',
          'photo-1583001931096-959e9a1a6223?w=1000&q=90&auto=format&fit=crop'
        ]
      }
    }
  };

  // Service-to-keyword mapping for enhanced image selection
  private static readonly SERVICE_KEYWORDS = {
    'Classic Cut': 'barbershop, classic haircut, traditional barber',
    'Beard Trim': 'beard grooming, beard trim, facial hair',
    'Hot Towel Shave': 'hot towel shave, traditional shave, straight razor',
    'Haircut & Style': 'hair styling, professional haircut, salon',
    'Hair Color': 'hair coloring, highlights, hair dye',
    'Blowout': 'hair blowout, styling, voluminous hair',
    'Manicure': 'nail care, manicure, nail art',
    'Pedicure': 'foot care, pedicure, nail salon',
    'Gel Nails': 'gel manicure, nail polish, nail design',
    'Facial': 'facial treatment, skincare, spa',
    'Chemical Peel': 'skin treatment, exfoliation, facial',
    'Microdermabrasion': 'skin resurfacing, facial treatment, skincare',
    'Bridal Makeup': 'wedding makeup, bridal beauty, special occasion',
    'Event Makeup': 'special event makeup, professional makeup',
    'Makeup Lesson': 'makeup tutorial, beauty education, cosmetics',
    'Portrait Session': 'portrait photography, headshots, professional photos',
    'Event Photography': 'event coverage, celebration photography, candid shots',
    'Wedding Photography': 'wedding photos, bridal photography, ceremony',
    'Personal Training': 'fitness training, workout, gym session',
    'Group Classes': 'fitness class, group workout, exercise',
    'Nutrition Coaching': 'healthy eating, diet planning, wellness'
  };

  static optimizeImageUrl(url: string, options: ImageOptimizationOptions = {}): string {
    const { width = 1200, height, quality = 95, format = 'webp' } = options;
    
    if (!url.includes('unsplash.com')) {
      return url;
    }

    const baseUrl = url.split('?')[0];
    const params = new URLSearchParams();
    
    params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('auto', 'format');
    params.set('fit', 'crop');
    if (format) params.set('fm', format);

    return `${baseUrl}?${params.toString()}`;
  }

  static getHeroImage(industry: string, brandVibe: BrandVibe = 'modern'): string {
    const collection = this.PREMIUM_IMAGE_COLLECTIONS[industry as keyof typeof this.PREMIUM_IMAGE_COLLECTIONS];
    if (collection && collection[brandVibe]?.hero) {
      const heroImages = collection[brandVibe].hero;
      const selectedImage = heroImages[Math.floor(Math.random() * heroImages.length)];
      return `${this.BASE_URL}/${selectedImage}`;
    }
    
    // Smart fallback based on industry category
    const fallbackIndustry = this.getFallbackIndustry(industry);
    if (fallbackIndustry && fallbackIndustry !== industry) {
      return this.getHeroImage(fallbackIndustry, brandVibe);
    }
    
    // Final fallback to hair_stylist
    const fallback = this.PREMIUM_IMAGE_COLLECTIONS.hair_stylist[brandVibe].hero[0];
    return `${this.BASE_URL}/${fallback}`;
  }

  static getGalleryImages(industry: string, count: number = 8, brandVibe: BrandVibe = 'modern'): string[] {
    const collection = this.PREMIUM_IMAGE_COLLECTIONS[industry as keyof typeof this.PREMIUM_IMAGE_COLLECTIONS];
    if (collection && collection[brandVibe]?.gallery) {
      const galleryImages = collection[brandVibe].gallery;
      const shuffled = [...galleryImages].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(img => `${this.BASE_URL}/${img}`);
    }
    
    // Smart fallback based on industry category
    const fallbackIndustry = this.getFallbackIndustry(industry);
    if (fallbackIndustry && fallbackIndustry !== industry) {
      return this.getGalleryImages(fallbackIndustry, count, brandVibe);
    }
    
    // Final fallback to hair_stylist
    const fallback = this.PREMIUM_IMAGE_COLLECTIONS.hair_stylist[brandVibe].gallery;
    return fallback.slice(0, count).map(img => `${this.BASE_URL}/${img}`);
  }

  static getServiceImages(industry: string, services: string[], brandVibe: BrandVibe = 'modern'): string[] {
    // Use services to enhance image selection
    const serviceKeywords = services.map(service => this.SERVICE_KEYWORDS[service as keyof typeof this.SERVICE_KEYWORDS]).filter(Boolean);
    console.log('Service keywords for image selection:', serviceKeywords);
    
    const galleryImages = this.getGalleryImages(industry, 12, brandVibe);
    return galleryImages.slice(0, services.length || 6);
  }

  static getStoryImages(industry: string, count: number = 6, brandVibe: BrandVibe = 'modern'): string[] {
    const galleryImages = this.getGalleryImages(industry, 12, brandVibe);
    return galleryImages.slice(2, count + 2);
  }

  static getTestimonialAvatars(count: number = 3): string[] {
    const avatars = [
      'photo-1494790108755-2616b72147ce?w=150&q=80&auto=format&fit=crop&crop=face',
      'photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop&crop=face',
      'photo-1517841905240-472988babdf9?w=150&q=80&auto=format&fit=crop&crop=face',
      'photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop&crop=face',
      'photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop&crop=face'
    ];
    
    return avatars.slice(0, count).map(avatar => `${this.BASE_URL}/${avatar}`);
  }

  // Smart fallback system based on industry categories
  private static getFallbackIndustry(industry: string): string | null {
    const industryCategories = {
      beauty: ['hair_stylist', 'nail_techs', 'estheticians', 'makeup_artist'],
      health: ['personal_trainer', 'estheticians'],
      creative: ['photographer', 'makeup_artist'],
      grooming: ['barber', 'barbers', 'hair_stylist']
    };

    // Find which category the industry belongs to
    for (const [category, industries] of Object.entries(industryCategories)) {
      if (industries.includes(industry)) {
        // Return the first available industry in the same category
        return industries.find(ind => ind !== industry && this.PREMIUM_IMAGE_COLLECTIONS[ind as keyof typeof this.PREMIUM_IMAGE_COLLECTIONS]) || null;
      }
    }

    return null;
  }

  static getImagesByCategory(industry: string, category: ImageCategory, count: number = 1, brandVibe: BrandVibe = 'modern'): string[] {
    switch (category) {
      case 'hero':
        return [this.getHeroImage(industry, brandVibe)];
      case 'gallery':
        return this.getGalleryImages(industry, count, brandVibe);
      case 'about':
        return this.getGalleryImages(industry, count, brandVibe).slice(1, count + 1);
      case 'service':
        return this.getServiceImages(industry, [], brandVibe).slice(0, count);
      case 'story':
        return this.getStoryImages(industry, count, brandVibe);
      default:
        return this.getGalleryImages(industry, count, brandVibe);
    }
  }
}

export { UnsplashImageService };
