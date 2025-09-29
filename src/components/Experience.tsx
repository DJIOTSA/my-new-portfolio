import { Calendar, MapPin } from 'lucide-react';
import React from 'react';

const Experience: React.FC = () => {
  const experiences = [
    {
      title: 'Software Engineer',
      company: 'Ultrasoft Technologies SARL',
      location: 'Yaoundé, Cameroon',
      period: 'February 2025 – Present',
      description:[
        "Developed and optimized web and mobile applications for clients in various sectors.",
        "Worked closely with marketing and UX teams to design user-centric solutions.",
        "Performed rigorous testing, debugging, and performance optimization across applications.",
        "Contributed to building scalable backend services for secure transactions, data management, and workflow automation.",
        "Integrated third-party services and APIs to expand application functionalities and streamline workflows.",
        "Implemented RESTful APIs to enhance communication between frontend and backend services, improving data retrieval efficiency by 30%."
    ],
      current: true
    },
    {
      title: 'Data Scientist Apprenticeship (Learning Experience)',
      company: 'DataCamp',
      location: 'Remote',
      period: 'January 2025 – Present',
      description: [
          "Gaining hands-on experience in data analysis, visualization, and interpretation.",
          "Learning to clean, preprocess, and transform datasets for machine learning tasks.",
          "Exploring statistical modeling, predictive analytics, and data-driven decision-making.",
          "Practicing implementation of machine learning algorithms and evaluation metrics.",
          "Building small projects to apply Python, data manipulation, and visualization skills.",
          "Understanding workflow optimization and reproducible research practices in real-world scenarios."
      ],
      current: true
    },
    {
      title: 'DevOps Engineer',
      company: 'HNG Tech',
      location: 'Remote',
      period: 'January 2025 – March 2025',
      description: [
        'Implemented continuous integration and continuous deployment (CI/CD) pipelines to streamline development workflows.',
        'Managed cloud infrastructure and automated deployment processes to ensure scalability and reliability.'
      ],
      current: false
    },
    {
      title: 'Sofware Engineer',
      company: 'Zepstra LTD',
      locaton: 'Buea',
      period: 'June 2023 - December 2023',
      description: [
          "Developed and optimized web and mobile applications tailored to client needs in diverse industries, enhancing user experience and engagement.",
          "Collaborated with marketing and UX teams to design intuitive, user-centric software solutions that increased customer satisfaction.",
          "Engineered scalable backend services for secure transactions, efficient data management, and automated workflows.",
          "Performed comprehensive testing, debugging, and performance tuning to ensure robust and high-performing applications.",
          "Implemented RESTful APIs and integrated third-party services to enhance application functionality and user experience."
      ],
      current: false,
    },
    {
      title: 'Hackerton & Bootcamp',
      company: 'Silicon Montain, Tech Chantier,...',
      location: 'Remote & Onsite',
      period: 'Previous Role',
      description: [
        "Participated in collaborative hackathons to solve real-world problems using software development skills.",
        "Gained hands-on experience in rapid prototyping, coding, and debugging under time constraints.",
        "Collaborated with teams to design and implement practical solutions, improving teamwork and project management skills.",
        "Learned best practices in software engineering, version control, and project deployment.",
        "Completed focused bootcamp sessions covering fullstack development, mobile applications, and modern programming workflows.",
        "Built small projects that reinforce practical understanding of web and mobile development concepts."
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