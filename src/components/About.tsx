import React from 'react';
import { Target, Code, Users, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const highlights = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Fullstack Development',
      description: 'Expert in web and mobile application development'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Solution-Oriented',
      description: 'Focused on delivering scalable, user-centric solutions'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Collaboration',
      description: 'Strong collaboration with clients, UX, and dev teams'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'AI Integration',
      description: 'Passionate about leveraging AI for real-world solutions'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-700 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              I am a disciplined and results-driven Fullstack Software Engineer with extensive experience 
              in designing, developing, and optimizing web and mobile applications. I specialize in creating 
              scalable, user-centric solutions while collaborating closely with clients, marketing teams, 
              UX designers, and development teams.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              I thrive on translating complex business requirements into intuitive workflows and 
              high-performance applications. I am passionate about leveraging modern technologies 
              and applied AI to solve real-world problems, improve operational efficiency, and 
              deliver exceptional user experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-700 mb-3">
                  {highlight.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;