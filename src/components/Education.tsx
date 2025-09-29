import { Award, GraduationCap } from 'lucide-react';
import React from 'react';

const Education: React.FC = () => {
  const education = [
    {
      degree: 'Bachelor of Engineering in Software Engineering',
      institution: 'University of Buea, Faculty of Engineering and Technology (FET)',
      gpa: '3.37/4',
      type: 'degree'
    },
    {
      degree: "Bachelor of Science in Physics (Level 1 completed)",
      institution: 'University of Dschang',
      type: 'degree'
    }
  ];

  const certifications = [
    {
      title: 'Software Design Thinking',
      provider: 'IBM',
      count: '3 certifications',
      type: 'certification'
    },
    {
      title: 'Product Management',
      provider: 'Pendo',
      count: '2 certifications',
      type: 'certification'
    }
  ];

  return (
    <section id="education" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Education & Certifications
          </h2>
          <div className="w-20 h-1 bg-blue-700 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <div className="flex items-center mb-8">
              <GraduationCap className="w-8 h-8 text-blue-700 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Education</h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {edu.degree}
                  </h4>
                  <p className="text-blue-700 font-medium mb-2">
                    {edu.institution}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-600 text-sm">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center mb-8">
              <Award className="w-8 h-8 text-blue-700 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Certifications</h3>
            </div>
            
            <div className="space-y-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {cert.title}
                  </h4>
                  <p className="text-blue-700 font-medium mb-2">
                    {cert.provider}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {cert.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;