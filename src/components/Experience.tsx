import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const Experience: React.FC = () => {
  const experiences = [
    {
      title: 'Software Engineer',
      company: 'Ultrasoft Technologies SARL',
      location: 'Yaoundé, Cameroon',
      period: 'February 2025 – Present',
      description: [
        'Developed and optimized web and mobile applications for clients in various sectors.',
        'Worked closely with marketing and UX teams to design user-centric solutions.',
        'Performed rigorous testing, debugging, and performance optimization across applications.',
        'Contributed to building scalable backend services for secure transactions, data management, and workflow automation.'
      ],
      current: true
    },
    {
      title: 'DevOps Engineer',
      company: 'HNG Tech',
      location: 'Remote',
      period: 'January 2025 – Present',
      description: [
        'Implemented continuous integration and continuous deployment (CI/CD) pipelines to streamline development workflows.',
        'Managed cloud infrastructure and automated deployment processes to ensure scalability and reliability.'
      ],
      current: true
    },
    {
      title: 'Data Scientist',
      company: 'DataCamp',
      location: 'Remote',
      period: 'January 2025 – Present',
      description: [
        'Analyzed and interpreted complex datasets to provide actionable insights.',
        'Developed predictive models and machine learning algorithms to support data-driven decision-making.'
      ],
      current: true
    },
    {
      title: 'Software Developer',
      company: 'Hackerton',
      location: 'Remote',
      period: 'Previous Role',
      description: [
        'Participated in designing and maintaining web applications, focusing on improving usability and efficiency.',
        'Collaborated with teams to implement client requirements into actionable software solutions.'
      ],
      current: false
    }
  ];

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Professional Experience
          </h2>
          <div className="w-20 h-1 bg-blue-700 mx-auto mb-8"></div>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {exp.title}
                  </h3>
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">
                    {exp.company}
                  </h4>
                </div>
                
                <div className="flex flex-col lg:items-end space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">{exp.period}</span>
                    {exp.current && (
                      <span className="ml-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {exp.description.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;