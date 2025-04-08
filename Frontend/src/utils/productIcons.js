/**
 * Utility function to get appropriate icon class based on product type
 * @param {string} type - The product type/category
 * @returns {string} - FontAwesome icon class
 */
export const getProductIconByType = (type) => {
  if (!type) return 'fas fa-box'; // Default icon
  
  // Convert to lowercase for case-insensitive matching
  const productType = type.toLowerCase();
  
  // Map product types to appropriate FontAwesome icons
  switch (productType) {
    case 'laptop':
    case 'notebook':
    case 'computer':
      return 'fas fa-laptop';
      
    case 'phone':
    case 'smartphone':
    case 'mobile':
      return 'fas fa-mobile-alt';
      
    case 'tablet':
    case 'ipad':
      return 'fas fa-tablet-alt';
      
    case 'headphone':
    case 'headphones':
    case 'earphone':
    case 'earphones':
    case 'earbuds':
      return 'fas fa-headphones';
      
    case 'camera':
    case 'dslr':
      return 'fas fa-camera';
      
    case 'tv':
    case 'television':
    case 'monitor':
    case 'display':
      return 'fas fa-tv';
      
    case 'watch':
    case 'smartwatch':
      return 'fas fa-clock';
      
    case 'speaker':
    case 'audio':
      return 'fas fa-volume-up';
      
    case 'gaming':
    case 'game':
    case 'console':
      return 'fas fa-gamepad';
      
    case 'keyboard':
      return 'fas fa-keyboard';
      
    case 'mouse':
      return 'fas fa-mouse';
      
    case 'printer':
      return 'fas fa-print';
      
    case 'storage':
    case 'drive':
    case 'ssd':
    case 'hdd':
    case 'usb':
      return 'fas fa-hdd';
      
    case 'router':
    case 'network':
    case 'wifi':
      return 'fas fa-wifi';
      
    case 'accessory':
    case 'accessories':
      return 'fas fa-plug';
      
    case 'charger':
    case 'power':
    case 'battery':
      return 'fas fa-battery-full';
      
    case 'cable':
    case 'wire':
      return 'fas fa-plug';
      
    case 'case':
    case 'cover':
    case 'protection':
      return 'fas fa-shield-alt';
      
    default:
      return 'fas fa-box'; // Default fallback icon
  }
};

/**
 * Get a color class for the icon based on product type
 * @param {string} type - The product type/category
 * @returns {string} - Tailwind CSS color class
 */
export const getIconColorByType = (type) => {
  if (!type) return 'text-gray-400'; // Default color
  
  // Convert to lowercase for case-insensitive matching
  const productType = type.toLowerCase();
  
  // Map product types to appropriate colors
  switch (productType) {
    case 'laptop':
    case 'computer':
    case 'notebook':
      return 'text-blue-500';
      
    case 'phone':
    case 'smartphone':
    case 'mobile':
      return 'text-green-500';
      
    case 'tablet':
    case 'ipad':
      return 'text-purple-500';
      
    case 'headphone':
    case 'headphones':
    case 'earphone':
    case 'earphones':
    case 'earbuds':
      return 'text-red-500';
      
    case 'accessory':
    case 'accessories':
      return 'text-yellow-500';
      
    default:
      return 'text-gray-500'; // Default color
  }
};
