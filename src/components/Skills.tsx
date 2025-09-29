import React from 'react';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: 'Core Competencies',
      skills: [
        'Fullstack Application Development',
        'Solution Design & Technical Problem-Solving',
        'Code Optimization, Testing & Debugging',
        'Agile Collaboration',
        'AI & NLP Application Integration',
        'Workflow Automation',
        'Project Planning & Requirements Translation'
      ]
    },
    {
      title: 'Technical Stack',
      skills: [
        'Web Development (Frontend & Backend)',
        'Mobile Application Development',
        'Database Design & Management',
        'Cloud Infrastructure & DevOps',
        'Machine Learning & Data Science',
        'API Design & Integration',
        'Performance Optimization'
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Core Competencies
          </h2>
          <div className="w-20 h-1 bg-blue-700 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-700 rounded-full mr-4"></div>
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;