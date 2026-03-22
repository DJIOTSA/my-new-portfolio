import { getDb } from "@/lib/db/postgres";
import { ensureDatabase } from "@/lib/db/init";
import {
  seedAbout,
  seedCertifications,
  seedContact,
  seedEducation,
  seedExperiences,
  seedHero,
  seedProjects,
  seedServices,
  seedSkills
} from "@/lib/db/seed-data";
import {
  aboutSchema,
  certificationSchema,
  contactSchema,
  educationSchema,
  experienceSchema,
  heroSchema,
  projectSchema,
  serviceSchema,
  skillCategorySchema
} from "@/lib/schemas";
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

function normalizeEntity<T>(value: unknown, fallback: T, parser: { safeParse: (input: unknown) => { success: true; data: T } | { success: false } }): T {
  const result = parser.safeParse(value);
  return result.success ? result.data : fallback;
}

function normalizeArray<T>(
  value: unknown,
  fallback: T[],
  parser: { safeParse: (input: unknown) => { success: true; data: T[] } | { success: false } }
): T[] {
  const result = parser.safeParse(value);
  return result.success ? result.data : fallback;
}

async function getPortfolioDocument<T>(sectionKey: string): Promise<T> {
  await ensureDatabase();
  const sql = getDb();
  const [document] = await sql<PortfolioDocumentRow<T>[]>`
    select data
    from portfolio_documents
    where section_key = ${sectionKey}
  `;

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
    hero: normalizeEntity(hero, seedHero, heroSchema),
    about: normalizeEntity(about, seedAbout, aboutSchema),
    skills: normalizeArray(skills, seedSkills, skillCategorySchema.array()),
    services: normalizeArray(services, seedServices, serviceSchema.array()),
    experiences: normalizeArray(experiences, seedExperiences, experienceSchema.array()),
    education: normalizeArray(education, seedEducation, educationSchema.array()),
    certifications: normalizeArray(certifications, seedCertifications, certificationSchema.array()),
    projects: normalizeArray(projects, seedProjects, projectSchema.array()),
    contact: normalizeEntity(contact, seedContact, contactSchema)
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
  const sql = getDb();
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
    await sql`
      insert into portfolio_documents (id, section_key, data, created_at, updated_at)
      values (${document.key}, ${document.key}, ${JSON.stringify(document.value)}::jsonb, ${new Date().toISOString()}, ${new Date().toISOString()})
      on conflict (section_key) do update
      set data = excluded.data,
          updated_at = excluded.updated_at
    `;
  }
}
