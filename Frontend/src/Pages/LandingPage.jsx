import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className=''>
     
      <section id="hero" className="pt-24 md:pt-32 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
                Next-Gen Tech <br />
                <span className="text-blue-600">Best Prices</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0">
                Discover the latest electronics and gadgets with exclusive deals and unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to='/products' className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300">
                  Shop Now
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              
              </div>
              <div className="flex items-center justify-center md:justify-start gap-8 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Fast</div>
                  <div className="text-sm text-gray-600">Delivery</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-indigo-200 rounded-full filter blur-3xl opacity-30"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <i className="fas fa-laptop text-6xl py-10 lg:py-28"></i>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-center font-semibold">Live Deals Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;