import React from 'react';
import { ExternalLink, Code } from 'lucide-react';

const Projects: React.FC = () => {
  const projects = [
    {
      title: 'MOMO MANAGE',
      description: 'A business management platform for small enterprises. Participated in development of both mobile and web applications, performing testing and code optimization, while collaborating with clients, marketing, UX, and development teams. Created workflows for tracking transactions, managing employees, and visualizing income and expenses.',
      tech: ['Business Management', 'Mobile & Web', 'Transaction Tracking'],
      category: 'Business Platform'
    },
    {
      title: 'UltraCollecte',
      description: 'A secure payment application for both web and mobile platforms. Contributed to implementing robust transaction handling, ensuring data integrity, and designing scalable services that support reliable and efficient payment workflows. Streamlines financial operations for institutions.',
      tech: ['Payment Processing', 'Security', 'Financial Management'],
      category: 'FinTech'
    },
    {
      title: 'Employee Goal Tracker (EGT)',
      description: 'A system for managing employee goals, tasks, and performance evaluation. Developed web and mobile functionalities, performed testing and code optimization, and collaborated with teams to ensure workflow efficiency and actionable insights for performance tracking.',
      tech: ['HR Management', 'Performance Tracking', 'Analytics'],
      category: 'Enterprise Software'
    },
    {
      title: 'Yemba Named Entity Recognition (NER)',
      description: 'An AI-powered system for identifying entities in the Yemba language. Contributed to developing web and mobile applications with intuitive interfaces for efficient textual data processing and entity recognition, showcasing expertise in NLP and AI integration.',
      tech: ['AI/NLP', 'Machine Learning', 'Language Processing'],
      category: 'AI/ML'
    },
    {
      title: 'Au Boulot',
      description: 'Built the administration dashboard for this task and project management platform on web and mobile. Implemented features for task assignment, progress tracking, and resource management, improving organizational efficiency and workflow transparency.',
      tech: ['Project Management', 'Dashboard', 'Workflow Optimization'],
      category: 'Productivity'
    },
    {
      title: 'Mhulo Portfolio',
      description: 'A professional portfolio website showcasing services and professional achievements. Contributed to both web and mobile design aspects, ensuring responsiveness and usability while collaborating with UX designers and stakeholders.',
      tech: ['Web Design', 'Responsive Design', 'Portfolio'],
      category: 'Web Development'
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-blue-700 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <Code className="w-6 h-6 text-gray-400 group-hover:text-blue-700 transition-colors" />
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;