import { ensureDatabase } from "@/db/init";
import { insertRows, selectRows } from "@/db/supabase-rest";
import {
  aboutSchema
} from "@/db/validation/about";
import { certificationSchema } from "@/db/validation/certification";
import { contactSchema } from "@/db/validation/contact-section";
import { educationSchema } from "@/db/validation/education";
import { experienceSchema } from "@/db/validation/experience";
import { heroSchema } from "@/db/validation/hero";
import { projectSchema } from "@/db/validation/project";
import { serviceSchema } from "@/db/validation/service";
import { skillCategorySchema } from "@/db/validation/skill-category";
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

interface PortfolioDocumentRow<T> {
  data: T;
}

function normalizeEntity<T>(value: unknown, parser: { safeParse: (input: unknown) => { success: true; data: T } | { success: false } }, sectionKey: string): T {
  const result = parser.safeParse(value);
  if (!result.success) {
    throw new Error(`Portfolio document ${sectionKey} has invalid shape.`);
  }

  return result.data;
}

function normalizeArray<T>(
  value: unknown,
  parser: { safeParse: (input: unknown) => { success: true; data: T[] } | { success: false } },
  sectionKey: string
): T[] {
  const result = parser.safeParse(value);
  if (!result.success) {
    throw new Error(`Portfolio document ${sectionKey} has invalid shape.`);
  }

  return result.data;
}

async function getPortfolioDocument<T>(sectionKey: string): Promise<T> {
  await ensureDatabase();
  const [document] = await selectRows<PortfolioDocumentRow<T>>("portfolio_documents", {
    columns: "data",
    filters: [{ column: "section_key", operator: "eq", value: sectionKey }],
    limit: 1
  });

  if (!document) {
    throw new Error(`Portfolio document ${sectionKey} not found.`);
  }

  return document.data;
}

export async function getPortfolioDocuments(): Promise<{
  hero: HeroEntity;
  about: AboutSectionEntity;
  skills: SkillsCategoryEntity[];
  services: ServiceEntity[];
  experiences: ExperienceEntity[];
  education: EducationEntity[];
  certifications: CertificationEntity[];
  projects: ProjectEntity[];
  contact: ContactSectionEntity;
}> {
  const [hero, about, skills, services, experiences, education, certifications, projects, contact] =
    await Promise.all([
      getPortfolioDocument<HeroEntity>("hero"),
      getPortfolioDocument<AboutSectionEntity>("about"),
      getPortfolioDocument<SkillsCategoryEntity[]>("skills"),
      getPortfolioDocument<ServiceEntity[]>("services"),
      getPortfolioDocument<ExperienceEntity[]>("experiences"),
      getPortfolioDocument<EducationEntity[]>("education"),
      getPortfolioDocument<CertificationEntity[]>("certifications"),
      getPortfolioDocument<ProjectEntity[]>("projects"),
      getPortfolioDocument<ContactSectionEntity>("contact")
    ]);

  return {
    hero: normalizeEntity(hero, heroSchema, "hero"),
    about: normalizeEntity(about, aboutSchema, "about"),
    skills: normalizeArray(skills, skillCategorySchema.array(), "skills"),
    services: normalizeArray(services, serviceSchema.array(), "services"),
    experiences: normalizeArray(experiences, experienceSchema.array(), "experiences"),
    education: normalizeArray(education, educationSchema.array(), "education"),
    certifications: normalizeArray(certifications, certificationSchema.array(), "certifications"),
    projects: normalizeArray(projects, projectSchema.array(), "projects"),
    contact: normalizeEntity(contact, contactSchema, "contact")
  };
}

export async function savePortfolioDocuments(payload: {
  hero: HeroEntity;
  about: AboutSectionEntity;
  skills: SkillsCategoryEntity[];
  services: ServiceEntity[];
  experiences: ExperienceEntity[];
  education: EducationEntity[];
  certifications: CertificationEntity[];
  projects: ProjectEntity[];
  contact: ContactSectionEntity;
}): Promise<void> {
  await ensureDatabase();
  const documents = [
    { key: "hero", value: payload.hero },
    { key: "about", value: payload.about },
    { key: "skills", value: payload.skills },
    { key: "services", value: payload.services },
    { key: "experiences", value: payload.experiences },
    { key: "education", value: payload.education },
    { key: "certifications", value: payload.certifications },
    { key: "projects", value: payload.projects },
    { key: "contact", value: payload.contact }
  ] as const;

  for (const document of documents) {
    await insertRows("portfolio_documents", {
      id: document.key,
      section_key: document.key,
      data: document.value,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: "section_key", upsert: true, returning: "minimal" });
  }
}
