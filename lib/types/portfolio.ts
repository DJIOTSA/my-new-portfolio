import type { LanguageCode, LocalizedResponseMeta } from "@/lib/types/types";

export interface HeroTranslation {
  firstName: string;
  lastName: string;
  headline: string;
  availabilityLabel: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface HeroEntity {
  id: string;
  profileImageUrl: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  translations: Partial<Record<LanguageCode, HeroTranslation>>;
}

export interface HeroContent extends HeroTranslation, LocalizedResponseMeta {
  id: string;
  profileImageUrl: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
}

export interface AboutHighlightTranslation {
  title: string;
  description: string;
}

export interface AboutHighlightEntity {
  id: string;
  icon: string;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, AboutHighlightTranslation>>;
}

export interface AboutSectionTranslation {
  title: string;
  paragraphs: string[];
}

export interface AboutSectionEntity {
  id: string;
  translations: Partial<Record<LanguageCode, AboutSectionTranslation>>;
  highlights: AboutHighlightEntity[];
}

export interface SkillsCategoryTranslation {
  title: string;
  skills: string[];
}

export interface SkillsCategoryEntity {
  id: string;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, SkillsCategoryTranslation>>;
}

export interface ServiceTranslation {
  title: string;
  description: string;
  features: string[];
}

export interface ServiceEntity {
  id: string;
  icon: string;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, ServiceTranslation>>;
}

export interface ExperienceTranslation {
  title: string;
  company: string;
  period: string;
  description: string[];
}

export interface ExperienceEntity {
  id: string;
  location: string | null;
  current: boolean;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, ExperienceTranslation>>;
}

export interface EducationTranslation {
  degree: string;
  institution: string;
}

export interface EducationEntity {
  id: string;
  gpa: string | null;
  type: string;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, EducationTranslation>>;
}

export interface CertificationTranslation {
  title: string;
  provider: string;
  count: string;
}

export interface CertificationEntity {
  id: string;
  type: string;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, CertificationTranslation>>;
}

export interface ProjectTranslation {
  title: string;
  description: string;
  tech: string[];
  category: string;
}

export interface ProjectEntity {
  id: string;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, ProjectTranslation>>;
}

export interface SocialLinkTranslation {
  label: string;
  value: string;
}

export interface SocialLinkEntity {
  id: string;
  icon: string;
  href: string | null;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, SocialLinkTranslation>>;
}

export interface ContactSectionTranslation {
  title: string;
  subtitle: string;
  formTitle: string;
  formTypeLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
}

export interface ContactSectionEntity {
  id: string;
  availabilityValue: string;
  translations: Partial<Record<LanguageCode, ContactSectionTranslation>>;
  contactLinks: SocialLinkEntity[];
}

export interface PortfolioContent {
  hero: HeroContent;
  about: {
    title: string;
    paragraphs: string[];
    highlights: Array<AboutHighlightTranslation & { id: string; icon: string }>;
  } & LocalizedResponseMeta;
  services: Array<ServiceTranslation & { id: string; icon: string } & LocalizedResponseMeta>;
  skills: {
    title: string;
    categories: Array<SkillsCategoryTranslation & { id: string } & LocalizedResponseMeta>;
  } & LocalizedResponseMeta;
  experiences: Array<
    ExperienceTranslation & { id: string; location: string | null; current: boolean } & LocalizedResponseMeta
  >;
  education: Array<EducationTranslation & { id: string; gpa: string | null; type: string } & LocalizedResponseMeta>;
  certifications: Array<
    CertificationTranslation & { id: string; type: string } & LocalizedResponseMeta
  >;
  projects: Array<ProjectTranslation & { id: string } & LocalizedResponseMeta>;
  contact: {
    availabilityValue: string;
    contactLinks: Array<SocialLinkTranslation & { id: string; icon: string; href: string | null } & LocalizedResponseMeta>;
  } & ContactSectionTranslation &
    LocalizedResponseMeta;
}
