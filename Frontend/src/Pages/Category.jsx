import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const Category = () => {
  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore our wide range of electronic categories to find exactly what you need.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Category 1 */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <Link to='/laptops' className="block p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <i className="fas fa-laptop text-2xl text-blue-600"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Laptops</h3>
                <p className="text-sm text-gray-600 mb-3">Premium &amp; Budget</p>
                <span className="text-blue-600 text-sm flex items-center">
                  Shop Now
                  <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </Link>
          </div>

          {/* Category 2 */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <Link to='/phones' className="block p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <i className="fas fa-mobile-alt text-2xl text-red-600"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Smartphones</h3>
                <p className="text-sm text-gray-600 mb-3">Latest Models</p>
                <span className="text-blue-600 text-sm flex items-center">
                  Shop Now
                  <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </Link>
          </div>

          {/* Category 3 */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <Link to='/tablets' className="block p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <i className="fas fa-tablet-alt text-2xl text-purple-600"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Tablets</h3>
                <p className="text-sm text-gray-600 mb-3">All Sizes</p>
                <span className="text-blue-600 text-sm flex items-center">
                  Shop Now
                  <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </Link>
          </div>

          {/* Category 4 */}
          

          {/* Category 5 */}
         

          {/* Category 6 */}
         

          {/* Category 7 */}
        

          {/* Category 8 */}
          <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <Link to= '/accessories' className="block p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <i className="fas fa-plug text-2xl text-orange-600"></i>
                </div>
                <h3 className="font-semibold text-lg mb-2">Accessories</h3>
                <p className="text-sm text-gray-600 mb-3">All Gadgets</p>
                <span className="text-blue-600 text-sm flex items-center">
                  Shop Now
                  <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category;