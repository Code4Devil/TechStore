import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Touch = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">Have questions about our products or services? We're here to help.</p>

            <div className="space-y-6">
              {/* Customer Support */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-headset text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Customer Support</h3>
                  <p className="text-gray-600 mb-2">24/7 dedicated support for all your queries</p>
                  <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                    <i className="fas fa-phone"></i>
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              {/* Email Support */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Support</h3>
                  <p className="text-gray-600 mb-2">Send us an email for any technical assistance</p>
                  <a href="mailto:support@techstore.com" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                    <i className="fas fa-envelope"></i>
                    support@techstore.com
                  </a>
                </div>
              </div>

              {/* Store Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-location-dot text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Store Location</h3>
                  <p className="text-gray-600 mb-2">123 Tech Street, Silicon Valley</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                    <i className="fas fa-map"></i>
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-800 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="contact-name" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" placeholder="Your name" />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="contact-email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" placeholder="your@email.com" />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select id="contact-subject" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                  <option value="">Select a subject</option>
                  <option value="support">Product Support</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="warranty">Warranty Claim</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="contact-message" rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                Send Message
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Touch;