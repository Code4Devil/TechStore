import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Newsletter = () => {
  return (
    <section id="newsletter" className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Stay Updated with Latest Tech</h2>
              <p className="text-gray-600 mb-6">Subscribe to our newsletter and get exclusive deals, tech news, and product launches directly in your inbox.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <i className="fas fa-tag"></i>
                  </div>
                  <span className="text-gray-700">Exclusive discounts and deals</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <i className="fas fa-bell"></i>
                  </div>
                  <span className="text-gray-700">New product launch alerts</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <i className="fas fa-gift"></i>
                  </div>
                  <span className="text-gray-700">Special birthday rewards</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <i className="far fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input type="text" id="name" placeholder="Enter your name" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <i className="far fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input type="email" id="email" placeholder="Enter your email" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">I agree to receive marketing emails</span>
                  </label>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  Subscribe Now
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By subscribing, you agree to our Terms of Service and Privacy Policy. You may unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;