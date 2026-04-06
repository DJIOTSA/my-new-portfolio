import { Calendar, ExternalLink, Globe, Heart, Linkedin, Mail, MapPin, Phone, Award, GraduationCap } from "lucide-react";
import Link from "next/link";
import { getIconComponent } from "@/components/atoms/icon-map";
import { ContactForm } from "@/components/organisms/portfolio/contact-form";
import { PortfolioHeader } from "@/components/organisms/portfolio/header";
import { ProjectCard } from "@/components/organisms/portfolio/project-card";
import { getFeaturedBlogPosts } from "@/services/blog-service";
import { getPortfolioContent } from "@/services/portfolio-service";

export default async function PortfolioPage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const content = await getPortfolioContent(lang);
  const featuredPosts = await getFeaturedBlogPosts(lang);

  return (
    <div className="min-h-screen bg-white">
      <PortfolioHeader language={content.hero.effectiveLanguage} />
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {content.hero.firstName} <br />
                <span className="text-blue-700">{content.hero.lastName}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">{content.hero.headline}</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center lg:justify-start text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  <span>{content.hero.location}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-600">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  <span>{content.hero.email}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-gray-600">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  <span>{content.hero.phone}</span>
                </div>
              </div>
              <div className="flex justify-center lg:justify-start space-x-4">
                <a href="#contact" className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold">
                  {content.hero.primaryCtaLabel}
                </a>
                <a
                  href={content.hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition-colors font-semibold flex items-center"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  {content.hero.secondaryCtaLabel}
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={content.hero.profileImageUrl} alt="Christian" className="w-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-4 rounded-full">
                  <span className="text-sm font-semibold">{content.hero.availabilityLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{content.about.title}</h2>
            <div className="w-20 h-1 bg-blue-700 mx-auto mb-8" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.about.highlights.map((highlight) => {
                const Icon = getIconComponent(highlight.icon);
                return (
                  <div key={highlight.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div className="text-blue-700 mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                    <p className="text-gray-600 text-sm">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Services I Offer</h2>
            <div className="w-20 h-1 bg-blue-700 mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive software development services to bring your ideas to life with cutting-edge technology and best practices.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.map((service) => {
              const Icon = getIconComponent(service.icon);
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="text-blue-700 mb-6 group-hover:text-blue-800 transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-16">
            <a href="#contact" className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      <section id="skills" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{content.skills.title}</h2>
            <div className="w-20 h-1 bg-blue-700 mx-auto mb-8" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {content.skills.categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{category.title}</h3>
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="w-2 h-2 bg-blue-700 rounded-full mr-4" />
                      <span className="text-gray-700 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Professional Experience</h2>
            <div className="w-20 h-1 bg-blue-700 mx-auto mb-8" />
          </div>
          <div className="space-y-8">
            {content.experiences.map((experience) => (
              <div key={experience.id} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                    <h4 className="text-xl font-semibold text-blue-700 mb-2">{experience.company}</h4>
                  </div>
                  <div className="flex flex-col lg:items-end space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">{experience.period}</span>
                      {experience.current ? (
                        <span className="ml-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs">Current</span>
                      ) : null}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{experience.location}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {experience.description.map((item) => (
                    <li key={item} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Education & Certifications</h2>
            <div className="w-20 h-1 bg-blue-700 mx-auto mb-8" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-8">
                <GraduationCap className="w-8 h-8 text-blue-700 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Education</h3>
              </div>
              <div className="space-y-6">
                {content.education.map((education) => (
                  <div key={education.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{education.degree}</h4>
                    <p className="text-blue-700 font-medium mb-2">{education.institution}</p>
                    {education.gpa ? <p className="text-gray-600 text-sm">GPA: {education.gpa}</p> : null}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center mb-8">
                <Award className="w-8 h-8 text-blue-700 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Certifications</h3>
              </div>
              <div className="space-y-6">
                {content.certifications.map((certification) => (
                  <div key={certification.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{certification.title}</h4>
                    <p className="text-blue-700 font-medium mb-2">{certification.provider}</p>
                    <p className="text-gray-600 text-sm">{certification.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Featured Projects</h2>
            <div className="w-20 h-1 bg-blue-700 mx-auto mb-8" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {content.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">From the Blog</h2>
            <div className="w-20 h-1 bg-blue-700 mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Technical writing on data science, AI integration, architecture, and product engineering.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                href={`/${lang}/blog/${post.slug}`}
                className="bg-white rounded-lg p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{post.title}</h3>
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{post.category.name}</span>
                  </div>
                  <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-blue-700 transition-colors" />
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.readingTime} min read</span>
                  <span>{post.author.name}</span>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">
                    Read article
                  </span>
                  <ExternalLink className="w-4 h-4 text-blue-700 group-hover:text-blue-800" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href={`/${lang}/blog`} className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
              Browse all articles
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">{content.contact.title}</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{content.contact.subtitle}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
              <div className="space-y-6">
                {content.contact.contactLinks.map((info) => {
                  const Icon = getIconComponent(info.icon);
                  return (
                    <div key={info.id} className="flex items-center">
                      <div className="text-blue-400 mr-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-white hover:text-blue-400 transition-colors font-medium"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-white font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">{content.contact.formTitle}</h3>
              <ContactForm labels={content.contact} />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <Link href={`/${lang}/blog`} className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors">
                Visit the blog
              </Link>
            </div>
            <p className="flex items-center justify-center text-gray-300 mb-4">
              Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by Djiotsa Christian
            </p>
            <p className="text-gray-400 text-sm">© 2025 Djiotsa Christian. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
