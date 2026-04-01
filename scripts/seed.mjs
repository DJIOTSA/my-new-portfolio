import { getSql, logStep } from "./db-utils.mjs";
import { randomBytes, scryptSync } from "node:crypto";

const sql = getSql();
const now = new Date().toISOString();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const languages = [
  {
    id: "lang_en",
    code: "en",
    name: "English",
    nativeName: "English",
    enabled: true,
    isDefault: true,
    sortOrder: 0
  },
  {
    id: "lang_fr",
    code: "fr",
    name: "French",
    nativeName: "Français",
    enabled: true,
    isDefault: false,
    sortOrder: 1
  }
];

const siteSettings = {
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
  }
};

const portfolioDocuments = [
  {
    sectionKey: "hero",
    data: {
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
          headline: "Fullstack Software Engineer | Mobile & Web Application Developer | AI Enthusiast | Solution-Oriented",
          availabilityLabel: "Available",
          primaryCtaLabel: "Get In Touch",
          secondaryCtaLabel: "LinkedIn"
        },
        fr: {
          firstName: "Djiotsa",
          lastName: "Christian",
          headline: "Ingénieur logiciel fullstack | Développeur d'applications web et mobile | Passionné d'IA | Orienté solutions",
          availabilityLabel: "Disponible",
          primaryCtaLabel: "Me contacter",
          secondaryCtaLabel: "LinkedIn"
        }
      }
    }
  },
  {
    sectionKey: "about",
    data: {
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
        { id: "about_highlight_1", icon: "Code", orderIndex: 0, translations: { en: { title: "Fullstack Development", description: "Expert in web and mobile application development" }, fr: { title: "Développement Fullstack", description: "Expert du développement d'applications web et mobile" } } },
        { id: "about_highlight_2", icon: "Target", orderIndex: 1, translations: { en: { title: "Solution-Oriented", description: "Focused on delivering scalable, user-centric solutions" }, fr: { title: "Orienté solutions", description: "Concentré sur des solutions scalables et centrées utilisateur" } } },
        { id: "about_highlight_3", icon: "Users", orderIndex: 2, translations: { en: { title: "Team Collaboration", description: "Strong collaboration with clients, UX, and dev teams" }, fr: { title: "Collaboration d'équipe", description: "Forte collaboration avec clients, UX et équipes de développement" } } },
        { id: "about_highlight_4", icon: "Lightbulb", orderIndex: 3, translations: { en: { title: "AI Integration", description: "Passionate about leveraging AI for real-world solutions" }, fr: { title: "Intégration IA", description: "Passionné par l'utilisation de l'IA pour des solutions concrètes" } } }
      ]
    }
  },
  {
    sectionKey: "skills",
    data: [
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
    ]
  },
  {
    sectionKey: "services",
    data: [
      { id: "service_1", icon: "Code", orderIndex: 0, translations: { en: { title: "Web Development", description: "Full-stack web application development using modern frameworks and technologies. From responsive frontend interfaces to robust backend systems.", features: ["React/Next.js Frontend", "Node.js/Python Backend", "RESTful APIs", "Database Integration"] }, fr: { title: "Développement web", description: "Développement d'applications web fullstack avec des frameworks modernes, du frontend responsive au backend robuste.", features: ["Frontend React/Next.js", "Backend Node.js/Python", "API REST", "Intégration base de données"] } } },
      { id: "service_2", icon: "Smartphone", orderIndex: 1, translations: { en: { title: "Mobile Development", description: "Cross-platform mobile applications that deliver exceptional user experiences on both iOS and Android platforms.", features: ["React Native", "Native Performance", "App Store Deployment"] }, fr: { title: "Développement mobile", description: "Applications mobiles cross-platform offrant une excellente expérience sur iOS et Android.", features: ["React Native", "Performance native", "Déploiement stores"] } } },
      { id: "service_3", icon: "Database", orderIndex: 2, translations: { en: { title: "Database Design", description: "Scalable database architecture and optimization for efficient data management and retrieval in enterprise applications.", features: ["SQL/NoSQL Design", "Performance Optimization", "Data Migration", "Backup Strategies"] }, fr: { title: "Conception de bases de données", description: "Architecture et optimisation de bases de données scalables pour des applications d'entreprise efficaces.", features: ["Design SQL/NoSQL", "Optimisation des performances", "Migration de données", "Stratégies de sauvegarde"] } } },
      { id: "service_4", icon: "Cloud", orderIndex: 3, translations: { en: { title: "Cloud & DevOps", description: "Cloud infrastructure setup, CI/CD pipeline implementation, and automated deployment processes for scalable applications.", features: ["AWS/Azure/GCP", "Docker Containers", "CI/CD Pipelines", "Infrastructure as Code"] }, fr: { title: "Cloud et DevOps", description: "Infrastructure cloud, CI/CD et déploiement automatisé pour des applications scalables.", features: ["AWS/Azure/GCP", "Conteneurs Docker", "Pipelines CI/CD", "Infrastructure as Code"] } } },
      { id: "service_5", icon: "Brain", orderIndex: 4, translations: { en: { title: "AI Integration", description: "Integration of artificial intelligence and machine learning capabilities into applications for enhanced functionality.", features: ["NLP Processing", "Machine Learning Models", "Data Analysis", "Predictive Analytics"] }, fr: { title: "Intégration IA", description: "Intégration de capacités d'intelligence artificielle et de machine learning dans les applications.", features: ["Traitement NLP", "Modèles ML", "Analyse de données", "Analytique prédictive"] } } },
      { id: "service_6", icon: "Cog", orderIndex: 5, translations: { en: { title: "System Optimization", description: "Performance analysis, code optimization, and system enhancement to improve application efficiency and user experience.", features: ["Performance Audits", "Code Refactoring", "Load Testing", "Security Assessment"] }, fr: { title: "Optimisation système", description: "Analyse de performance, refactoring et amélioration système pour une meilleure efficacité.", features: ["Audits de performance", "Refactoring", "Tests de charge", "Évaluation sécurité"] } } }
    ]
  },
  {
    sectionKey: "experiences",
    data: [
      { id: "experience_1", location: "Yaoundé, Cameroon", current: true, orderIndex: 0, translations: { en: { title: "Software Engineer", company: "Ultrasoft Technologies SARL", period: "February 2025 – Present", description: ["Developed and optimized web and mobile applications for clients in various sectors.", "Worked closely with marketing and UX teams to design user-centric solutions.", "Performed rigorous testing, debugging, and performance optimization across applications.", "Contributed to building scalable backend services for secure transactions, data management, and workflow automation.", "Integrated third-party services and APIs to expand application functionalities and streamline workflows.", "Implemented RESTful APIs to enhance communication between frontend and backend services, improving data retrieval efficiency by 30%."] }, fr: { title: "Ingénieur logiciel", company: "Ultrasoft Technologies SARL", period: "Février 2025 – Présent", description: ["Développement et optimisation d'applications web et mobiles pour différents secteurs.", "Collaboration étroite avec les équipes marketing et UX pour concevoir des solutions centrées utilisateur."] } } },
      { id: "experience_2", location: "Remote", current: true, orderIndex: 1, translations: { en: { title: "Data Scientist Apprenticeship (Learning Experience)", company: "DataCamp", period: "January 2025 – Present", description: ["Gaining hands-on experience in data analysis, visualization, and interpretation.", "Learning to clean, preprocess, and transform datasets for machine learning tasks.", "Exploring statistical modeling, predictive analytics, and data-driven decision-making.", "Practicing implementation of machine learning algorithms and evaluation metrics.", "Building small projects to apply Python, data manipulation, and visualization skills.", "Understanding workflow optimization and reproducible research practices in real-world scenarios."] }, fr: { title: "Apprentissage Data Scientist", company: "DataCamp", period: "Janvier 2025 – Présent", description: ["Expérience pratique en analyse, visualisation et interprétation de données.", "Application des bases du machine learning et de la recherche reproductible."] } } },
      { id: "experience_3", location: "Remote", current: false, orderIndex: 2, translations: { en: { title: "DevOps Engineer", company: "HNG Tech", period: "January 2025 – March 2025", description: ["Implemented continuous integration and continuous deployment (CI/CD) pipelines to streamline development workflows.", "Managed cloud infrastructure and automated deployment processes to ensure scalability and reliability."] }, fr: { title: "Ingénieur DevOps", company: "HNG Tech", period: "Janvier 2025 – Mars 2025", description: ["Mise en place de pipelines CI/CD pour fluidifier les workflows de développement."] } } }
    ]
  },
  {
    sectionKey: "education",
    data: [
      { id: "education_1", gpa: "3.37/4", type: "degree", orderIndex: 0, translations: { en: { degree: "Bachelor of Engineering in Software Engineering", institution: "University of Buea, Faculty of Engineering and Technology (FET)" }, fr: { degree: "Bachelor of Engineering en génie logiciel", institution: "University of Buea, Faculty of Engineering and Technology (FET)" } } },
      { id: "education_2", gpa: null, type: "degree", orderIndex: 1, translations: { en: { degree: "Bachelor of Science in Physics (Level 1 completed)", institution: "University of Dschang" }, fr: { degree: "Licence en physique (niveau 1 complété)", institution: "University of Dschang" } } }
    ]
  },
  {
    sectionKey: "certifications",
    data: [
      { id: "certification_1", type: "certification", orderIndex: 0, translations: { en: { title: "Software Design Thinking", provider: "IBM", count: "3 certifications" }, fr: { title: "Software Design Thinking", provider: "IBM", count: "3 certifications" } } },
      { id: "certification_2", type: "certification", orderIndex: 1, translations: { en: { title: "Product Management", provider: "Pendo", count: "2 certifications" }, fr: { title: "Product Management", provider: "Pendo", count: "2 certifications" } } }
    ]
  },
  {
    sectionKey: "projects",
    data: [
      { id: "project_1", orderIndex: 0, translations: { en: { title: "MOMO MANAGE", description: "A business management platform for small enterprises. Participated in development of both mobile and web applications, performing testing and code optimization, while collaborating with clients, marketing, UX, and development teams. Created workflows for tracking transactions, managing employees, and visualizing income and expenses.", tech: ["Business Management", "Mobile & Web", "Transaction Tracking"], category: "Business Platform" }, fr: { title: "MOMO MANAGE", description: "Plateforme de gestion d'entreprise pour petites structures, avec workflows de transactions, employés et finances.", tech: ["Gestion d'entreprise", "Mobile et web", "Suivi des transactions"], category: "Plateforme métier" } } },
      { id: "project_2", orderIndex: 1, translations: { en: { title: "UltraCollecte", description: "A secure payment application for both web and mobile platforms. Contributed to implementing robust transaction handling, ensuring data integrity, and designing scalable services that support reliable and efficient payment workflows. Streamlines financial operations for institutions.", tech: ["Payment Processing", "Security", "Financial Management"], category: "FinTech" }, fr: { title: "UltraCollecte", description: "Application de paiement sécurisée web et mobile pour des workflows financiers fiables.", tech: ["Paiement", "Sécurité", "Gestion financière"], category: "FinTech" } } }
    ]
  },
  {
    sectionKey: "contact",
    data: {
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
        { id: "contact_link_1", icon: "Mail", href: "mailto:mhulodjiotsa@gmail.com", orderIndex: 0, translations: { en: { label: "Email", value: "mhulodjiotsa@gmail.com" }, fr: { label: "Email", value: "mhulodjiotsa@gmail.com" } } },
        { id: "contact_link_2", icon: "Phone", href: "tel:+237656222624", orderIndex: 1, translations: { en: { label: "Phone", value: "+237 656 222 624" }, fr: { label: "Téléphone", value: "+237 656 222 624" } } },
        { id: "contact_link_3", icon: "Linkedin", href: "https://linkedin.com/in/djiotsa-christian-36470a253", orderIndex: 2, translations: { en: { label: "LinkedIn", value: "djiotsa-christian-36470a253" }, fr: { label: "LinkedIn", value: "djiotsa-christian-36470a253" } } }
      ]
    }
  }
];

const blogCategories = [
  { id: "blog_category_1", parentId: null, orderIndex: 0, translations: { en: { name: "Data Science", slug: "data-science", description: "Applied machine learning, NLP, analytics, and experimentation." }, fr: { name: "Data Science", slug: "data-science", description: "Machine learning appliqué, NLP, analytique et expérimentation." } } },
  { id: "blog_category_2", parentId: null, orderIndex: 1, translations: { en: { name: "Software Engineering", slug: "software-engineering", description: "Architecture, delivery, platform design, and engineering practice." }, fr: { name: "Ingénierie logicielle", slug: "ingenierie-logicielle", description: "Architecture, delivery, design de plateforme et pratiques d'ingénierie." } } }
];

const blogTags = [
  { id: "blog_tag_1", translations: { en: { name: "NLP", slug: "nlp" }, fr: { name: "NLP", slug: "nlp" } } },
  { id: "blog_tag_2", translations: { en: { name: "MLOps", slug: "mlops" }, fr: { name: "MLOps", slug: "mlops" } } },
  { id: "blog_tag_3", translations: { en: { name: "Architecture", slug: "architecture" }, fr: { name: "Architecture", slug: "architecture" } } }
];

const blogAuthor = {
  id: "blog_author_1",
  avatarMediaId: null,
  email: "mhulodjiotsa@gmail.com",
  linkedinUrl: "https://linkedin.com/in/djiotsa-christian-36470a253",
  xUrl: "https://x.com/mhulodjiotsa",
  githubUrl: "https://github.com/DJIOTSA",
  translations: {
    en: { name: "Djiotsa Christian", bio: "Fullstack software engineer writing about data science, AI integration, and scalable product systems." },
    fr: { name: "Djiotsa Christian", bio: "Ingénieur logiciel fullstack écrivant sur la data science, l'intégration IA et les systèmes scalables." }
  }
};

const blogPosts = [
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
    readingTime: 2,
    difficulty: "intermediate",
    tags: ["blog_tag_1", "blog_tag_2"],
    resources: [
      { label: "Kaggle", url: "https://www.kaggle.com/", type: "dataset" },
      { label: "DataCamp", url: "https://www.datacamp.com/", type: "course" }
    ],
    relatedPostIds: [],
    socialPublishing: { linkedinMode: "manual", xMode: "manual" },
    translations: {
      en: {
        title: "Building a Multilingual Data Science Blog That Actually Scales",
        slug: "multilingual-data-science-blog-scales",
        excerpt: "A practical content architecture for technical blogs that need multilingual SEO, structured rich content, and maintainable operations.",
        contentJson: "{\"type\":\"doc\",\"content\":[]}",
        contentHtml: "<h2>Why multilingual content matters for technical personal brands</h2><p>Publishing in multiple languages expands search surface area, improves conversion, and lets you tailor technical nuance to each audience.</p>",
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
        contentJson: "{\"type\":\"doc\",\"content\":[]}",
        contentHtml: "<h2>Pourquoi le contenu multilingue compte</h2><p>Publier en plusieurs langues améliore le SEO et la conversion.</p>",
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
    }
  }
];

const adminUser = {
  id: "admin_user_1",
  username: process.env.ADMIN_USERNAME ?? "admin",
  email: process.env.ADMIN_EMAIL ?? "admin@example.com",
  passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "change-me"),
  role: "super-admin",
  status: "active",
  emailVerifiedAt: process.env.ADMIN_FORCE_EMAIL_VERIFICATION === "true" ? null : now
};

function sqlLiteral(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function jsonLiteral(value) {
  return `${sqlLiteral(JSON.stringify(value))}::jsonb`;
}

function buildSeedSql() {
  const statements = [];

  for (const language of languages) {
    statements.push(`insert into languages (id, code, name, native_name, enabled, is_default, sort_order, created_at, updated_at)
values (${sqlLiteral(language.id)}, ${sqlLiteral(language.code)}, ${sqlLiteral(language.name)}, ${sqlLiteral(language.nativeName)}, ${sqlLiteral(language.enabled)}, ${sqlLiteral(language.isDefault)}, ${sqlLiteral(language.sortOrder)}, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (id) do update set
  code = excluded.code,
  name = excluded.name,
  native_name = excluded.native_name,
  enabled = excluded.enabled,
  is_default = excluded.is_default,
  sort_order = excluded.sort_order,
  updated_at = excluded.updated_at;`);
  }

  statements.push(`insert into site_settings (id, logo_media_id, default_og_image_id, contact_email, linkedin_url, x_url, github_url, course_platform_url, translations, created_at, updated_at)
values (${sqlLiteral(siteSettings.id)}, ${sqlLiteral(siteSettings.logoMediaId)}, ${sqlLiteral(siteSettings.defaultOgImageId)}, ${sqlLiteral(siteSettings.contactEmail)}, ${sqlLiteral(siteSettings.linkedinUrl)}, ${sqlLiteral(siteSettings.xUrl)}, ${sqlLiteral(siteSettings.githubUrl)}, ${sqlLiteral(siteSettings.coursePlatformUrl)}, ${jsonLiteral(siteSettings.translations)}, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (id) do update set
  contact_email = excluded.contact_email,
  linkedin_url = excluded.linkedin_url,
  x_url = excluded.x_url,
  github_url = excluded.github_url,
  course_platform_url = excluded.course_platform_url,
  translations = excluded.translations,
  updated_at = excluded.updated_at;`);

  for (const document of portfolioDocuments) {
    statements.push(`insert into portfolio_documents (id, section_key, data, created_at, updated_at)
values (${sqlLiteral(document.sectionKey)}, ${sqlLiteral(document.sectionKey)}, ${jsonLiteral(document.data)}, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (section_key) do update set
  data = excluded.data,
  updated_at = excluded.updated_at;`);
  }

  for (const category of blogCategories) {
    statements.push(`insert into blog_categories (id, parent_id, order_index, translations, created_at, updated_at)
values (${sqlLiteral(category.id)}, ${sqlLiteral(category.parentId)}, ${sqlLiteral(category.orderIndex)}, ${jsonLiteral(category.translations)}, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (id) do update set
  parent_id = excluded.parent_id,
  order_index = excluded.order_index,
  translations = excluded.translations,
  updated_at = excluded.updated_at;`);
  }

  for (const tag of blogTags) {
    statements.push(`insert into blog_tags (id, translations, created_at, updated_at)
values (${sqlLiteral(tag.id)}, ${jsonLiteral(tag.translations)}, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (id) do update set
  translations = excluded.translations,
  updated_at = excluded.updated_at;`);
  }

  statements.push(`insert into blog_authors (id, avatar_media_id, email, linkedin_url, x_url, github_url, translations, created_at, updated_at)
values (${sqlLiteral(blogAuthor.id)}, ${sqlLiteral(blogAuthor.avatarMediaId)}, ${sqlLiteral(blogAuthor.email)}, ${sqlLiteral(blogAuthor.linkedinUrl)}, ${sqlLiteral(blogAuthor.xUrl)}, ${sqlLiteral(blogAuthor.githubUrl)}, ${jsonLiteral(blogAuthor.translations)}, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (id) do update set
  email = excluded.email,
  linkedin_url = excluded.linkedin_url,
  x_url = excluded.x_url,
  github_url = excluded.github_url,
  translations = excluded.translations,
  updated_at = excluded.updated_at;`);

  for (const post of blogPosts) {
    statements.push(`insert into blog_posts (id, author_id, category_id, status, featured, published_at, scheduled_at, cover_media_id, og_image_media_id, reading_time, difficulty, tags, resources, related_post_ids, social_publishing, translations, created_at, updated_at)
values (${sqlLiteral(post.id)}, ${sqlLiteral(post.authorId)}, ${sqlLiteral(post.categoryId)}, ${sqlLiteral(post.status)}, ${sqlLiteral(post.featured)}, ${sqlLiteral(post.publishedAt)}, ${sqlLiteral(post.scheduledAt)}, ${sqlLiteral(post.coverMediaId)}, ${sqlLiteral(post.ogImageMediaId)}, ${sqlLiteral(post.readingTime)}, ${sqlLiteral(post.difficulty)}, ${jsonLiteral(post.tags)}, ${jsonLiteral(post.resources)}, ${jsonLiteral(post.relatedPostIds)}, ${jsonLiteral(post.socialPublishing)}, ${jsonLiteral(post.translations)}, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (id) do update set
  author_id = excluded.author_id,
  category_id = excluded.category_id,
  status = excluded.status,
  featured = excluded.featured,
  published_at = excluded.published_at,
  scheduled_at = excluded.scheduled_at,
  cover_media_id = excluded.cover_media_id,
  og_image_media_id = excluded.og_image_media_id,
  reading_time = excluded.reading_time,
  difficulty = excluded.difficulty,
  tags = excluded.tags,
  resources = excluded.resources,
  related_post_ids = excluded.related_post_ids,
  social_publishing = excluded.social_publishing,
  translations = excluded.translations,
  updated_at = excluded.updated_at;`);
  }

  statements.push(`insert into admin_users (id, username, email, password_hash, role, status, email_verified_at, last_login_at, created_at, updated_at)
values (${sqlLiteral(adminUser.id)}, ${sqlLiteral(adminUser.username)}, ${sqlLiteral(adminUser.email)}, ${sqlLiteral(adminUser.passwordHash)}, ${sqlLiteral(adminUser.role)}, ${sqlLiteral(adminUser.status)}, ${sqlLiteral(adminUser.emailVerifiedAt)}, null, ${sqlLiteral(now)}, ${sqlLiteral(now)})
on conflict (username) do update set
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role,
  status = excluded.status,
  email_verified_at = coalesce(admin_users.email_verified_at, excluded.email_verified_at),
  updated_at = excluded.updated_at;`);

  return `${statements.join("\n\n")}\n`;
}

async function seed() {
  logStep("Seeding PostgreSQL content...");
  await sql.unsafe(buildSeedSql());
  logStep("Seed completed.");
}

try {
  await seed();
} finally {
  await sql.end({ timeout: 1 });
}
