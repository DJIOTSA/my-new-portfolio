import type {
  AboutSectionEntity,
  CertificationEntity,
  ContactSectionEntity,
  EducationEntity,
  ExperienceEntity,
  HeroEntity,
  ProjectEntity,
  ServiceEntity,
  SkillsCategoryEntity
} from "@/lib/types";
import type {
  BlogAuthorEntity,
  BlogCategoryEntity,
  BlogPostEntity,
  BlogTagEntity,
  LanguageEntity,
  SiteSettingsEntity
} from "@/lib/types";
import { calculateReadingTime } from "@/lib/utils";

const now = new Date().toISOString();

export const seedLanguages: LanguageEntity[] = [
  {
    id: "lang_en",
    code: "en",
    name: "English",
    nativeName: "English",
    enabled: true,
    isDefault: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "lang_fr",
    code: "fr",
    name: "French",
    nativeName: "Français",
    enabled: true,
    isDefault: false,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now
  }
];

export const seedSiteSettings: SiteSettingsEntity = {
  id: "site_settings_1",
  logoMediaId: null,
  defaultOgImageId: null,
  contactEmail: "mhulodjiotsa@gmail.com",
  linkedinUrl: "https://linkedin.com/in/djiotsa-christian-36470a253",
  xUrl: "https://x.com/mhulodjiotsa",
  githubUrl: "https://github.com/DJIOTSA",
  coursePlatformUrl: "https://www.datacamp.com/",
  translations: {
    en: {
      siteTitle: "Djiotsa Christian",
      siteDescription: "Fullstack Software Engineer portfolio, blog, and admin CMS.",
      defaultSeoTitle: "Djiotsa Christian | Fullstack Software Engineer",
      defaultSeoDescription: "Portfolio, technical blog, and consulting platform for software engineering and data science."
    },
    fr: {
      siteTitle: "Djiotsa Christian",
      siteDescription: "Portfolio, blog technique et CMS administrateur.",
      defaultSeoTitle: "Djiotsa Christian | Ingénieur logiciel fullstack",
      defaultSeoDescription: "Portfolio, blog technique et plateforme de consulting en ingénierie logicielle et data science."
    }
  },
  createdAt: now,
  updatedAt: now
};

export const seedHero: HeroEntity = {
  id: "hero_1",
  profileImageUrl: "/profile3.jpg",
  location: "Yaounde, Cameroon",
  email: "mhulodjiotsa@gmail.com",
  phone: "+237 656 222 624",
  linkedinUrl: "https://linkedin.com/in/djiotsa-christian-36470a253",
  translations: {
    en: {
      firstName: "Djiotsa",
      lastName: "Christian",
      headline:
        "Fullstack Software Engineer | Mobile & Web Application Developer | AI Enthusiast | Solution-Oriented",
      availabilityLabel: "Available",
      primaryCtaLabel: "Get In Touch",
      secondaryCtaLabel: "LinkedIn"
    },
    fr: {
      firstName: "Djiotsa",
      lastName: "Christian",
      headline:
        "Ingénieur logiciel fullstack | Développeur d'applications web et mobile | Passionné d'IA | Orienté solutions",
      availabilityLabel: "Disponible",
      primaryCtaLabel: "Me contacter",
      secondaryCtaLabel: "LinkedIn"
    }
  }
};

export const seedAbout: AboutSectionEntity = {
  id: "about_1",
  translations: {
    en: {
      title: "About Me",
      paragraphs: [
        "I am a disciplined and results-driven Fullstack Software Engineer with extensive experience in designing, developing, and optimizing web and mobile applications. I specialize in creating scalable, user-centric solutions while collaborating closely with clients, marketing teams, UX designers, and development teams.",
        "I thrive on translating complex business requirements into intuitive workflows and high-performance applications. I am passionate about leveraging modern technologies and applied AI to solve real-world problems, improve operational efficiency, and deliver exceptional user experiences."
      ]
    },
    fr: {
      title: "À propos de moi",
      paragraphs: [
        "Je suis un ingénieur logiciel fullstack discipliné et orienté résultats, avec une solide expérience dans la conception, le développement et l'optimisation d'applications web et mobiles.",
        "J'aime transformer des besoins métier complexes en workflows intuitifs et applications performantes, en m'appuyant sur les technologies modernes et l'IA appliquée."
      ]
    }
  },
  highlights: [
    {
      id: "about_highlight_1",
      icon: "Code",
      orderIndex: 0,
      translations: {
        en: {
          title: "Fullstack Development",
          description: "Expert in web and mobile application development"
        },
        fr: {
          title: "Développement Fullstack",
          description: "Expert du développement d'applications web et mobile"
        }
      }
    },
    {
      id: "about_highlight_2",
      icon: "Target",
      orderIndex: 1,
      translations: {
        en: {
          title: "Solution-Oriented",
          description: "Focused on delivering scalable, user-centric solutions"
        },
        fr: {
          title: "Orienté solutions",
          description: "Concentré sur des solutions scalables et centrées utilisateur"
        }
      }
    },
    {
      id: "about_highlight_3",
      icon: "Users",
      orderIndex: 2,
      translations: {
        en: {
          title: "Team Collaboration",
          description: "Strong collaboration with clients, UX, and dev teams"
        },
        fr: {
          title: "Collaboration d'équipe",
          description: "Forte collaboration avec clients, UX et équipes de développement"
        }
      }
    },
    {
      id: "about_highlight_4",
      icon: "Lightbulb",
      orderIndex: 3,
      translations: {
        en: {
          title: "AI Integration",
          description: "Passionate about leveraging AI for real-world solutions"
        },
        fr: {
          title: "Intégration IA",
          description: "Passionné par l'utilisation de l'IA pour des solutions concrètes"
        }
      }
    }
  ]
};

export const seedSkills: SkillsCategoryEntity[] = [
  {
    id: "skills_1",
    orderIndex: 0,
    translations: {
      en: {
        title: "Core Competencies",
        skills: [
          "Fullstack Application Development",
          "Solution Design & Technical Problem-Solving",
          "Code Optimization, Testing & Debugging",
          "Agile Collaboration",
          "AI & NLP Application Integration",
          "Workflow Automation",
          "Project Planning & Requirements Translation"
        ]
      },
      fr: {
        title: "Compétences clés",
        skills: [
          "Développement d'applications fullstack",
          "Conception de solutions et résolution de problèmes techniques",
          "Optimisation de code, tests et débogage",
          "Collaboration agile",
          "Intégration IA et NLP",
          "Automatisation des workflows",
          "Planification de projet et traduction des besoins"
        ]
      }
    }
  },
  {
    id: "skills_2",
    orderIndex: 1,
    translations: {
      en: {
        title: "Technical Stack",
        skills: [
          "Web Development (Frontend & Backend)",
          "Mobile Application Development",
          "Database Design & Management",
          "Cloud Infrastructure & DevOps",
          "Machine Learning & Data Science",
          "API Design & Integration",
          "Performance Optimization"
        ]
      },
      fr: {
        title: "Stack technique",
        skills: [
          "Développement web (frontend et backend)",
          "Développement mobile",
          "Conception et gestion de bases de données",
          "Infrastructure cloud et DevOps",
          "Machine learning et data science",
          "Conception et intégration d'API",
          "Optimisation des performances"
        ]
      }
    }
  }
];

export const seedServices: ServiceEntity[] = [
  {
    id: "service_1",
    icon: "Code",
    orderIndex: 0,
    translations: {
      en: {
        title: "Web Development",
        description: "Full-stack web application development using modern frameworks and technologies. From responsive frontend interfaces to robust backend systems.",
        features: ["React/Next.js Frontend", "Node.js/Python Backend", "RESTful APIs", "Database Integration"]
      },
      fr: {
        title: "Développement web",
        description: "Développement d'applications web fullstack avec des frameworks modernes, du frontend responsive au backend robuste.",
        features: ["Frontend React/Next.js", "Backend Node.js/Python", "API REST", "Intégration base de données"]
      }
    }
  },
  {
    id: "service_2",
    icon: "Smartphone",
    orderIndex: 1,
    translations: {
      en: {
        title: "Mobile Development",
        description: "Cross-platform mobile applications that deliver exceptional user experiences on both iOS and Android platforms.",
        features: ["React Native", "Native Performance", "App Store Deployment"]
      },
      fr: {
        title: "Développement mobile",
        description: "Applications mobiles cross-platform offrant une excellente expérience sur iOS et Android.",
        features: ["React Native", "Performance native", "Déploiement stores"]
      }
    }
  },
  {
    id: "service_3",
    icon: "Database",
    orderIndex: 2,
    translations: {
      en: {
        title: "Database Design",
        description: "Scalable database architecture and optimization for efficient data management and retrieval in enterprise applications.",
        features: ["SQL/NoSQL Design", "Performance Optimization", "Data Migration", "Backup Strategies"]
      },
      fr: {
        title: "Conception de bases de données",
        description: "Architecture et optimisation de bases de données scalables pour des applications d'entreprise efficaces.",
        features: ["Design SQL/NoSQL", "Optimisation des performances", "Migration de données", "Stratégies de sauvegarde"]
      }
    }
  },
  {
    id: "service_4",
    icon: "Cloud",
    orderIndex: 3,
    translations: {
      en: {
        title: "Cloud & DevOps",
        description: "Cloud infrastructure setup, CI/CD pipeline implementation, and automated deployment processes for scalable applications.",
        features: ["AWS/Azure/GCP", "Docker Containers", "CI/CD Pipelines", "Infrastructure as Code"]
      },
      fr: {
        title: "Cloud et DevOps",
        description: "Infrastructure cloud, CI/CD et déploiement automatisé pour des applications scalables.",
        features: ["AWS/Azure/GCP", "Conteneurs Docker", "Pipelines CI/CD", "Infrastructure as Code"]
      }
    }
  },
  {
    id: "service_5",
    icon: "Brain",
    orderIndex: 4,
    translations: {
      en: {
        title: "AI Integration",
        description: "Integration of artificial intelligence and machine learning capabilities into applications for enhanced functionality.",
        features: ["NLP Processing", "Machine Learning Models", "Data Analysis", "Predictive Analytics"]
      },
      fr: {
        title: "Intégration IA",
        description: "Intégration de capacités d'intelligence artificielle et de machine learning dans les applications.",
        features: ["Traitement NLP", "Modèles ML", "Analyse de données", "Analytique prédictive"]
      }
    }
  },
  {
    id: "service_6",
    icon: "Cog",
    orderIndex: 5,
    translations: {
      en: {
        title: "System Optimization",
        description: "Performance analysis, code optimization, and system enhancement to improve application efficiency and user experience.",
        features: ["Performance Audits", "Code Refactoring", "Load Testing", "Security Assessment"]
      },
      fr: {
        title: "Optimisation système",
        description: "Analyse de performance, refactoring et amélioration système pour une meilleure efficacité.",
        features: ["Audits de performance", "Refactoring", "Tests de charge", "Évaluation sécurité"]
      }
    }
  }
];

export const seedExperiences: ExperienceEntity[] = [
  {
    id: "experience_1",
    location: "Yaoundé, Cameroon",
    current: true,
    orderIndex: 0,
    translations: {
      en: {
        title: "Software Engineer",
        company: "Ultrasoft Technologies SARL",
        period: "February 2025 – Present",
        description: [
          "Developed and optimized web and mobile applications for clients in various sectors.",
          "Worked closely with marketing and UX teams to design user-centric solutions.",
          "Performed rigorous testing, debugging, and performance optimization across applications.",
          "Contributed to building scalable backend services for secure transactions, data management, and workflow automation.",
          "Integrated third-party services and APIs to expand application functionalities and streamline workflows.",
          "Implemented RESTful APIs to enhance communication between frontend and backend services, improving data retrieval efficiency by 30%."
        ]
      },
      fr: {
        title: "Ingénieur logiciel",
        company: "Ultrasoft Technologies SARL",
        period: "Février 2025 – Présent",
        description: [
          "Développement et optimisation d'applications web et mobiles pour différents secteurs.",
          "Collaboration étroite avec les équipes marketing et UX pour concevoir des solutions centrées utilisateur."
        ]
      }
    }
  },
  {
    id: "experience_2",
    location: "Remote",
    current: true,
    orderIndex: 1,
    translations: {
      en: {
        title: "Data Scientist Apprenticeship (Learning Experience)",
        company: "DataCamp",
        period: "January 2025 – Present",
        description: [
          "Gaining hands-on experience in data analysis, visualization, and interpretation.",
          "Learning to clean, preprocess, and transform datasets for machine learning tasks.",
          "Exploring statistical modeling, predictive analytics, and data-driven decision-making.",
          "Practicing implementation of machine learning algorithms and evaluation metrics.",
          "Building small projects to apply Python, data manipulation, and visualization skills.",
          "Understanding workflow optimization and reproducible research practices in real-world scenarios."
        ]
      },
      fr: {
        title: "Apprentissage Data Scientist",
        company: "DataCamp",
        period: "Janvier 2025 – Présent",
        description: [
          "Expérience pratique en analyse, visualisation et interprétation de données.",
          "Application des bases du machine learning et de la recherche reproductible."
        ]
      }
    }
  },
  {
    id: "experience_3",
    location: "Remote",
    current: false,
    orderIndex: 2,
    translations: {
      en: {
        title: "DevOps Engineer",
        company: "HNG Tech",
        period: "January 2025 – March 2025",
        description: [
          "Implemented continuous integration and continuous deployment (CI/CD) pipelines to streamline development workflows.",
          "Managed cloud infrastructure and automated deployment processes to ensure scalability and reliability."
        ]
      },
      fr: {
        title: "Ingénieur DevOps",
        company: "HNG Tech",
        period: "Janvier 2025 – Mars 2025",
        description: [
          "Mise en place de pipelines CI/CD pour fluidifier les workflows de développement."
        ]
      }
    }
  },
  {
    id: "experience_4",
    location: null,
    current: false,
    orderIndex: 3,
    translations: {
      en: {
        title: "Sofware Engineer",
        company: "Zepstra LTD",
        period: "June 2023 - December 2023",
        description: [
          "Developed and optimized web and mobile applications tailored to client needs in diverse industries, enhancing user experience and engagement.",
          "Collaborated with marketing and UX teams to design intuitive, user-centric software solutions that increased customer satisfaction.",
          "Engineered scalable backend services for secure transactions, efficient data management, and automated workflows.",
          "Performed comprehensive testing, debugging, and performance tuning to ensure robust and high-performing applications.",
          "Implemented RESTful APIs and integrated third-party services to enhance application functionality and user experience."
        ]
      },
      fr: {
        title: "Ingénieur logiciel",
        company: "Zepstra LTD",
        period: "Juin 2023 - Décembre 2023",
        description: [
          "Développement d'applications web et mobiles adaptées aux besoins clients."
        ]
      }
    }
  },
  {
    id: "experience_5",
    location: "Remote & Onsite",
    current: false,
    orderIndex: 4,
    translations: {
      en: {
        title: "Hackerton & Bootcamp",
        company: "Silicon Montain, Tech Chantier,...",
        period: "Previous Role",
        description: [
          "Participated in collaborative hackathons to solve real-world problems using software development skills.",
          "Gained hands-on experience in rapid prototyping, coding, and debugging under time constraints.",
          "Collaborated with teams to design and implement practical solutions, improving teamwork and project management skills.",
          "Learned best practices in software engineering, version control, and project deployment.",
          "Completed focused bootcamp sessions covering fullstack development, mobile applications, and modern programming workflows.",
          "Built small projects that reinforce practical understanding of web and mobile development concepts."
        ]
      },
      fr: {
        title: "Hackathon et Bootcamp",
        company: "Silicon Montain, Tech Chantier,...",
        period: "Expérience précédente",
        description: [
          "Participation à des hackathons collaboratifs pour résoudre des problèmes concrets."
        ]
      }
    }
  }
];

export const seedEducation: EducationEntity[] = [
  {
    id: "education_1",
    gpa: "3.37/4",
    type: "degree",
    orderIndex: 0,
    translations: {
      en: {
        degree: "Bachelor of Engineering in Software Engineering",
        institution: "University of Buea, Faculty of Engineering and Technology (FET)"
      },
      fr: {
        degree: "Bachelor of Engineering en génie logiciel",
        institution: "University of Buea, Faculty of Engineering and Technology (FET)"
      }
    }
  },
  {
    id: "education_2",
    gpa: null,
    type: "degree",
    orderIndex: 1,
    translations: {
      en: {
        degree: "Bachelor of Science in Physics (Level 1 completed)",
        institution: "University of Dschang"
      },
      fr: {
        degree: "Licence en physique (niveau 1 complété)",
        institution: "University of Dschang"
      }
    }
  }
];

export const seedCertifications: CertificationEntity[] = [
  {
    id: "certification_1",
    type: "certification",
    orderIndex: 0,
    translations: {
      en: {
        title: "Software Design Thinking",
        provider: "IBM",
        count: "3 certifications"
      },
      fr: {
        title: "Software Design Thinking",
        provider: "IBM",
        count: "3 certifications"
      }
    }
  },
  {
    id: "certification_2",
    type: "certification",
    orderIndex: 1,
    translations: {
      en: {
        title: "Product Management",
        provider: "Pendo",
        count: "2 certifications"
      },
      fr: {
        title: "Product Management",
        provider: "Pendo",
        count: "2 certifications"
      }
    }
  }
];

export const seedProjects: ProjectEntity[] = [
  {
    id: "project_1",
    orderIndex: 0,
    images: [],
    translations: {
      en: {
        title: "MOMO MANAGE",
        description: "A business management platform for small enterprises. Participated in development of both mobile and web applications, performing testing and code optimization, while collaborating with clients, marketing, UX, and development teams. Created workflows for tracking transactions, managing employees, and visualizing income and expenses.",
        tech: ["Business Management", "Mobile & Web", "Transaction Tracking"],
        category: "Business Platform"
      },
      fr: {
        title: "MOMO MANAGE",
        description: "Plateforme de gestion d'entreprise pour petites structures, avec workflows de transactions, employés et finances.",
        tech: ["Gestion d'entreprise", "Mobile et web", "Suivi des transactions"],
        category: "Plateforme métier"
      }
    }
  },
  {
    id: "project_2",
    orderIndex: 1,
    images: [],
    translations: {
      en: {
        title: "UltraCollecte",
        description: "A secure payment application for both web and mobile platforms. Contributed to implementing robust transaction handling, ensuring data integrity, and designing scalable services that support reliable and efficient payment workflows. Streamlines financial operations for institutions.",
        tech: ["Payment Processing", "Security", "Financial Management"],
        category: "FinTech"
      },
      fr: {
        title: "UltraCollecte",
        description: "Application de paiement sécurisée web et mobile pour des workflows financiers fiables.",
        tech: ["Paiement", "Sécurité", "Gestion financière"],
        category: "FinTech"
      }
    }
  },
  {
    id: "project_3",
    orderIndex: 2,
    images: [],
    translations: {
      en: {
        title: "Employee Goal Tracker (EGT)",
        description: "A system for managing employee goals, tasks, and performance evaluation. Developed web and mobile functionalities, performed testing and code optimization, and collaborated with teams to ensure workflow efficiency and actionable insights for performance tracking.",
        tech: ["HR Management", "Performance Tracking", "Analytics"],
        category: "Enterprise Software"
      },
      fr: {
        title: "Employee Goal Tracker (EGT)",
        description: "Système de gestion des objectifs, tâches et performances des employés.",
        tech: ["RH", "Suivi de performance", "Analytics"],
        category: "Logiciel d'entreprise"
      }
    }
  },
  {
    id: "project_4",
    orderIndex: 3,
    images: [],
    translations: {
      en: {
        title: "Yemba Named Entity Recognition (NER)",
        description: "An AI-powered system for identifying entities in the Yemba language. Contributed to developing web and mobile applications with intuitive interfaces for efficient textual data processing and entity recognition, showcasing expertise in NLP and AI integration.",
        tech: ["AI/NLP", "Machine Learning", "Language Processing"],
        category: "AI/ML"
      },
      fr: {
        title: "Yemba Named Entity Recognition (NER)",
        description: "Système IA d'identification d'entités en langue Yemba.",
        tech: ["IA/NLP", "Machine learning", "Traitement du langage"],
        category: "IA/ML"
      }
    }
  },
  {
    id: "project_5",
    orderIndex: 4,
    translations: {
      en: {
        title: "Au Boulot",
        description: "Built the administration dashboard for this task and project management platform on web and mobile. Implemented features for task assignment, progress tracking, and resource management, improving organizational efficiency and workflow transparency.",
        tech: ["Project Management", "Dashboard", "Workflow Optimization"],
        category: "Productivity"
      },
      fr: {
        title: "Au Boulot",
        description: "Dashboard d'administration pour une plateforme de gestion de tâches et projets.",
        tech: ["Gestion de projet", "Dashboard", "Optimisation workflow"],
        category: "Productivité"
      }
    }
  },
  {
    id: "project_6",
    orderIndex: 5,
    translations: {
      en: {
        title: "Mhulo Portfolio",
        description: "A professional portfolio website showcasing services and professional achievements. Contributed to both web and mobile design aspects, ensuring responsiveness and usability while collaborating with UX designers and stakeholders.",
        tech: ["Web Design", "Responsive Design", "Portfolio"],
        category: "Web Development"
      },
      fr: {
        title: "Mhulo Portfolio",
        description: "Portfolio professionnel présentant services et réalisations.",
        tech: ["Web design", "Responsive design", "Portfolio"],
        category: "Développement web"
      }
    }
  }
];

export const seedContact: ContactSectionEntity = {
  id: "contact_1",
  availabilityValue: "Onsite & Remote",
  translations: {
    en: {
      title: "Let's Work Together",
      subtitle: "I'm always interested in new opportunities and exciting projects. Let's discuss how we can bring your ideas to life.",
      formTitle: "Quick Contact",
      formTypeLabel: "Inquiry Type",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "Tell me what you need",
      messageLabel: "Message",
      messagePlaceholder: "Tell me about your project...",
      submitLabel: "Send Message"
    },
    fr: {
      title: "Travaillons ensemble",
      subtitle: "Je suis toujours intéressé par de nouvelles opportunités et des projets ambitieux.",
      formTitle: "Contact rapide",
      formTypeLabel: "Type de demande",
      nameLabel: "Nom",
      namePlaceholder: "Votre nom",
      emailLabel: "Email",
      emailPlaceholder: "vous@email.com",
      subjectLabel: "Sujet",
      subjectPlaceholder: "Expliquez votre besoin",
      messageLabel: "Message",
      messagePlaceholder: "Parlez-moi de votre projet...",
      submitLabel: "Envoyer"
    }
  },
  contactLinks: [
    {
      id: "contact_link_1",
      icon: "Mail",
      href: "mailto:mhulodjiotsa@gmail.com",
      orderIndex: 0,
      translations: {
        en: { label: "Email", value: "mhulodjiotsa@gmail.com" },
        fr: { label: "Email", value: "mhulodjiotsa@gmail.com" }
      }
    },
    {
      id: "contact_link_2",
      icon: "Phone",
      href: "tel:+237656222624",
      orderIndex: 1,
      translations: {
        en: { label: "Phone", value: "+237 656 222 624" },
        fr: { label: "Téléphone", value: "+237 656 222 624" }
      }
    },
    {
      id: "contact_link_3",
      icon: "Linkedin",
      href: "https://linkedin.com/in/djiotsa-christian-36470a253",
      orderIndex: 2,
      translations: {
        en: { label: "LinkedIn", value: "djiotsa-christian-36470a253" },
        fr: { label: "LinkedIn", value: "djiotsa-christian-36470a253" }
      }
    },
    {
      id: "contact_link_4",
      icon: "MapPin",
      href: null,
      orderIndex: 3,
      translations: {
        en: { label: "Location", value: "Yaounde, Cameroon" },
        fr: { label: "Localisation", value: "Yaounde, Cameroun" }
      }
    },
    {
      id: "contact_link_5",
      icon: "Globe",
      href: null,
      orderIndex: 4,
      translations: {
        en: { label: "Availability", value: "Onsite & Remote" },
        fr: { label: "Disponibilité", value: "Sur site et à distance" }
      }
    }
  ]
};

export const seedBlogCategories: BlogCategoryEntity[] = [
  {
    id: "blog_category_1",
    parentId: null,
    orderIndex: 0,
    translations: {
      en: {
        name: "Data Science",
        slug: "data-science",
        description: "Applied machine learning, NLP, analytics, and experimentation."
      },
      fr: {
        name: "Data Science",
        slug: "data-science",
        description: "Machine learning appliqué, NLP, analytique et expérimentation."
      }
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "blog_category_2",
    parentId: null,
    orderIndex: 1,
    translations: {
      en: {
        name: "Software Engineering",
        slug: "software-engineering",
        description: "Architecture, delivery, platform design, and engineering practice."
      },
      fr: {
        name: "Ingénierie logicielle",
        slug: "ingenierie-logicielle",
        description: "Architecture, delivery, design de plateforme et pratiques d'ingénierie."
      }
    },
    createdAt: now,
    updatedAt: now
  }
];

export const seedBlogTags: BlogTagEntity[] = [
  {
    id: "blog_tag_1",
    translations: {
      en: { name: "NLP", slug: "nlp" },
      fr: { name: "NLP", slug: "nlp" }
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "blog_tag_2",
    translations: {
      en: { name: "MLOps", slug: "mlops" },
      fr: { name: "MLOps", slug: "mlops" }
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "blog_tag_3",
    translations: {
      en: { name: "Architecture", slug: "architecture" },
      fr: { name: "Architecture", slug: "architecture" }
    },
    createdAt: now,
    updatedAt: now
  }
];

export const seedBlogAuthor: BlogAuthorEntity = {
  id: "blog_author_1",
  avatarMediaId: null,
  email: "mhulodjiotsa@gmail.com",
  linkedinUrl: "https://linkedin.com/in/djiotsa-christian-36470a253",
  xUrl: "https://x.com/mhulodjiotsa",
  githubUrl: "https://github.com/DJIOTSA",
  translations: {
    en: {
      name: "Djiotsa Christian",
      bio: "Fullstack software engineer writing about data science, AI integration, and scalable product systems."
    },
    fr: {
      name: "Djiotsa Christian",
      bio: "Ingénieur logiciel fullstack écrivant sur la data science, l'intégration IA et les systèmes scalables."
    }
  },
  createdAt: now,
  updatedAt: now
};

const blogPostOneHtml = `
  <h2>Why multilingual content matters for technical personal brands</h2>
  <p>Publishing in multiple languages expands search surface area, improves conversion, and lets you tailor technical nuance to each audience.</p>
  <pre><code class="language-ts">type TranslationMap = Record&lt;string, { title: string; slug: string }&gt;;</code></pre>
  <p>Store root-level operational fields separately and keep language-specific presentation inside a translation map.</p>
`;

const blogPostTwoHtml = `
  <h2>From portfolio to platform</h2>
  <p>A portfolio that ships technical content, lead capture, and social publishing outperforms a static resume.</p>
  <p>Think in systems: content model, routing model, metadata model, and editorial workflow.</p>
`;

export const seedBlogPosts: BlogPostEntity[] = [
  {
    id: "blog_post_1",
    authorId: "blog_author_1",
    categoryId: "blog_category_1",
    status: "published",
    featured: true,
    publishedAt: "2026-03-16T10:00:00.000Z",
    scheduledAt: null,
    coverMediaId: null,
    ogImageMediaId: null,
    readingTime: calculateReadingTime(blogPostOneHtml),
    difficulty: "intermediate",
    tags: ["blog_tag_1", "blog_tag_2"],
    resources: [
      { label: "Kaggle", url: "https://www.kaggle.com/", type: "dataset" },
      { label: "DataCamp", url: "https://www.datacamp.com/", type: "course" }
    ],
    relatedPostIds: ["blog_post_2"],
    socialPublishing: {
      linkedinMode: "manual",
      xMode: "manual"
    },
    translations: {
      en: {
        title: "Building a Multilingual Data Science Blog That Actually Scales",
        slug: "multilingual-data-science-blog-scales",
        excerpt: "A practical content architecture for technical blogs that need multilingual SEO, structured rich content, and maintainable operations.",
        contentJson: JSON.stringify({ type: "doc", content: [] }),
        contentHtml: blogPostOneHtml,
        seoTitle: "Multilingual Data Science Blog Architecture",
        seoDescription: "How to structure multilingual technical content for SEO and long-term maintainability.",
        canonicalUrl: "http://localhost:3000/en/blog/multilingual-data-science-blog-scales",
        courseCtaTitle: "Want a production-ready content platform?",
        courseCtaDescription: "Hire me to build multilingual content systems for your product or personal brand.",
        courseCtaLabel: "Book a consulting call",
        courseCtaUrl: "http://localhost:3000/en#contact",
        socialShareTitle: "How to scale a multilingual technical blog",
        socialShareDescription: "A cleaner architecture for SEO-first technical publishing."
      },
      fr: {
        title: "Concevoir un blog data science multilingue qui passe à l'échelle",
        slug: "blog-data-science-multilingue-scalable",
        excerpt: "Une architecture de contenu pratique pour un blog technique multilingue, SEO et maintenable.",
        contentJson: JSON.stringify({ type: "doc", content: [] }),
        contentHtml: blogPostOneHtml,
        seoTitle: "Architecture d'un blog data science multilingue",
        seoDescription: "Structurer du contenu technique multilingue pour le SEO et la maintenabilité.",
        canonicalUrl: "http://localhost:3000/fr/blog/blog-data-science-multilingue-scalable",
        courseCtaTitle: "Besoin d'une plateforme de contenu robuste ?",
        courseCtaDescription: "Je conçois des systèmes de contenu multilingues pour produits et marques personnelles.",
        courseCtaLabel: "Réserver un appel",
        courseCtaUrl: "http://localhost:3000/fr#contact",
        socialShareTitle: "Comment scaler un blog technique multilingue",
        socialShareDescription: "Une architecture plus propre pour la publication technique orientée SEO."
      }
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "blog_post_2",
    authorId: "blog_author_1",
    categoryId: "blog_category_2",
    status: "published",
    featured: true,
    publishedAt: "2026-03-18T08:30:00.000Z",
    scheduledAt: null,
    coverMediaId: null,
    ogImageMediaId: null,
    readingTime: calculateReadingTime(blogPostTwoHtml),
    difficulty: "beginner",
    tags: ["blog_tag_3"],
    resources: [{ label: "Next.js", url: "https://nextjs.org/", type: "docs" }],
    relatedPostIds: ["blog_post_1"],
    socialPublishing: {
      linkedinMode: "auto",
      xMode: "manual"
    },
    translations: {
      en: {
        title: "Turning a Static Portfolio Into a Content Platform",
        slug: "turning-static-portfolio-into-content-platform",
        excerpt: "A portfolio should work as a publishing engine, not just a brochure.",
        contentJson: JSON.stringify({ type: "doc", content: [] }),
        contentHtml: blogPostTwoHtml,
        seoTitle: "Static Portfolio to Content Platform",
        seoDescription: "Upgrade a basic portfolio into a scalable content and lead-generation platform.",
        canonicalUrl: "http://localhost:3000/en/blog/turning-static-portfolio-into-content-platform",
        courseCtaTitle: "Need help modernizing your site?",
        courseCtaDescription: "I build high-signal marketing and content systems for technical founders and operators.",
        courseCtaLabel: "Start a project",
        courseCtaUrl: "http://localhost:3000/en#contact",
        socialShareTitle: "A portfolio should be a platform",
        socialShareDescription: "Why static personal sites underperform compared to content systems."
      },
      fr: {
        title: "Transformer un portfolio statique en plateforme de contenu",
        slug: "transformer-portfolio-statique-plateforme-contenu",
        excerpt: "Un portfolio doit être un moteur de publication, pas seulement une brochure.",
        contentJson: JSON.stringify({ type: "doc", content: [] }),
        contentHtml: blogPostTwoHtml,
        seoTitle: "Du portfolio statique à la plateforme de contenu",
        seoDescription: "Faire évoluer un portfolio simple vers une plateforme de contenu et génération de leads.",
        canonicalUrl: "http://localhost:3000/fr/blog/transformer-portfolio-statique-plateforme-contenu",
        courseCtaTitle: "Besoin d'aide pour moderniser votre site ?",
        courseCtaDescription: "Je conçois des plateformes de contenu et marketing pour profils techniques.",
        courseCtaLabel: "Démarrer un projet",
        courseCtaUrl: "http://localhost:3000/fr#contact",
        socialShareTitle: "Un portfolio doit être une plateforme",
        socialShareDescription: "Pourquoi les sites personnels statiques sont limités."
      }
    },
    createdAt: now,
    updatedAt: now
  }
];
