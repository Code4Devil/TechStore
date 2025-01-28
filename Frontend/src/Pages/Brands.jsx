import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const Brands = () => {
  const navigate = useNavigate();

  const brands = [
    { id: 1, name: 'Apple', icon: 'fab fa-apple', color: 'text-gray-800', tagline: 'Premium Innovation' },
    { id: 2, name: 'Samsung', icon: 'fas fa-mobile-alt', color: 'text-blue-600', tagline: 'Next Generation Tech' },
    { id: 3, name: 'Sony', icon: 'fas fa-headphones-alt', color: 'text-gray-800', tagline: 'Premium Audio & Visual' },
    { id: 4, name: 'Microsoft', icon: 'fab fa-microsoft', color: 'text-blue-500', tagline: 'Computing Excellence' },
    { id: 5, name: 'Dell', icon: 'fas fa-laptop', color: 'text-gray-700', tagline: 'Professional Computing' },
    { id: 6, name: 'HP', icon: 'fas fa-desktop', color: 'text-blue-700', tagline: 'Business Solutions' },
    { id: 7, name: 'LG', icon: 'fas fa-tv', color: 'text-red-600', tagline: 'Smart Living' },
    { id: 8, name: 'Asus', icon: 'fas fa-gamepad', color: 'text-blue-800', tagline: 'Gaming Innovation' },
  ];

  const handleBrandClick = (brandName) => {
    navigate(`/products?brand=${brandName}`);
  };

  return (
    <section id="popular_brands" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Brands</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Shop your favorite technology brands all in one place</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div 
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 hover:-translate-y-1 cursor-pointer"
            >
              <div className="block text-center">
                <div className="h-24 flex items-center justify-center mb-4">
                  <i className={`${brand.icon} text-5xl ${brand.color}`}></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">{brand.name}</h3>
                <p className="text-sm text-gray-600">{brand.tagline}</p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}

export default Brands;