import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="flex items-center justify-center text-gray-300 mb-4">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by Christian Daryn
          </p>
          <p className="text-gray-400 text-sm">
            © 2025 Djiotsa Djouake Christian Daryn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;