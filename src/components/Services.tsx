import { Brain, Cloud, Code, Cog, Database, Smartphone } from 'lucide-react';
import React from 'react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Web Development',
      description: 'Full-stack web application development using modern frameworks and technologies. From responsive frontend interfaces to robust backend systems.',
      features: ['React/Next.js Frontend', 'Node.js/Python Backend', 'RESTful APIs', 'Database Integration']
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile Development',
      description: 'Cross-platform mobile applications that deliver exceptional user experiences on both iOS and Android platforms.',
      features: ['React Native', 'Native Performance', 'App Store Deployment']
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Database Design',
      description: 'Scalable database architecture and optimization for efficient data management and retrieval in enterprise applications.',
      features: ['SQL/NoSQL Design', 'Performance Optimization', 'Data Migration', 'Backup Strategies']
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'Cloud & DevOps',
      description: 'Cloud infrastructure setup, CI/CD pipeline implementation, and automated deployment processes for scalable applications.',
      features: ['AWS/Azure/GCP', 'Docker Containers', 'CI/CD Pipelines', 'Infrastructure as Code']
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Integration',
      description: 'Integration of artificial intelligence and machine learning capabilities into applications for enhanced functionality.',
      features: ['NLP Processing', 'Machine Learning Models', 'Data Analysis', 'Predictive Analytics']
    },
    {
      icon: <Cog className="w-8 h-8" />,
      title: 'System Optimization',
      description: 'Performance analysis, code optimization, and system enhancement to improve application efficiency and user experience.',
      features: ['Performance Audits', 'Code Refactoring', 'Load Testing', 'Security Assessment']
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Services I Offer
          </h2>
          <div className="w-20 h-1 bg-blue-700 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive software development services to bring your ideas to life 
            with cutting-edge technology and best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="text-blue-700 mb-6 group-hover:text-blue-800 transition-colors">
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;