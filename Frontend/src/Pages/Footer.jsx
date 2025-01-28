import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">TechStore</h3>
            <p>Your one-stop destination for premium electronics and cutting-edge technology.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Special Offers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  My Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Order Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  Returns &amp; Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chevron-right text-xs"></i>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="fas fa-location-dot mt-1"></i>
                <span>123 Tech Street, Silicon Valley, CA 94025, USA</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone"></i>
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope"></i>
                <span>support@techstore.com</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-clock"></i>
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm">Payment Methods:</span>
              <div className="flex gap-3">
                <i className="fab fa-cc-visa text-2xl"></i>
                <i className="fab fa-cc-mastercard text-2xl"></i>
                <i className="fab fa-cc-amex text-2xl"></i>
                <i className="fab fa-cc-paypal text-2xl"></i>
                <i className="fab fa-cc-apple-pay text-2xl"></i>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Shipping Partners:</span>
              <div className="flex gap-3">
                <i className="fas fa-truck text-xl"></i>
                <i className="fas fa-box text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 TechStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;