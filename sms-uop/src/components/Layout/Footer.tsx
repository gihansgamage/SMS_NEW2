import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">UOP</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Society Management System</h3>
                  <p className="text-sm text-gray-400">University Of Peradeniya</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Streamlining society management for the University of Peradeniya community.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Student Service Division</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>studentservice@pdn.ac.lk</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+94 81 2393301</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>University of Peradeniya, Kandy</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="/about" className="block text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
                {/*<a href="/contact" className="block text-gray-400 hover:text-white transition-colors">*/}
                {/*  Contact Us*/}
                {/*</a>*/}
                <a href="/guidelines" className="block text-gray-400 hover:text-white transition-colors">
                  Society Guidelines
                </a>
                <a href="/help" className="block text-gray-400 hover:text-white transition-colors">
                  Help & Support
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} University of Peradeniya. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;