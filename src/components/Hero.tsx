import React from 'react';
import { MapPin, Mail, Phone, Linkedin } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Djiotsa Djouake <br />
              <span className="text-blue-700">Christian Daryn</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Fullstack Software Engineer | Mobile & Web Application Developer | AI Enthusiast | Solution-Oriented
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center lg:justify-start text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <span>Douala, Cameroon</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-gray-600">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                <span>mhulodjiotsa@gmail.com</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-gray-600">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                <span>+237 656 222 624</span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start space-x-4">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
              >
                Get In Touch
              </button>
              <a
                href="https://linkedin.com/in/djiotsa-christian-36470a253"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition-colors font-semibold flex items-center"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Christian Daryn"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-4 rounded-full">
                <span className="text-sm font-semibold">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;