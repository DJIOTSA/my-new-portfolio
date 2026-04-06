import { resolveLocalizedValue } from "@/lib/utils";
import type { PortfolioContent } from "@/lib/types";
import { getPortfolioDocuments } from "@/repositories/portfolio-repository";
import { resolveRequestedLanguage } from "@/services/language-service";

export async function getPortfolioContent(language: string | undefined): Promise<PortfolioContent> {
  const { requestedLanguage, effectiveRequestedLanguage, defaultLanguage } =
    await resolveRequestedLanguage(language);
  const documents = await getPortfolioDocuments();

  const heroResult = resolveLocalizedValue(documents.hero.translations, effectiveRequestedLanguage, defaultLanguage);
  const aboutResult = resolveLocalizedValue(documents.about.translations, effectiveRequestedLanguage, defaultLanguage);
  const skillsTitle = heroResult.effectiveLanguage === "fr" ? "Compétences clés" : "Core Competencies";

  return {
    hero: {
      id: documents.hero.id,
      profileImageUrl: documents.hero.profileImageUrl,
      location: documents.hero.location,
      email: documents.hero.email,
      phone: documents.hero.phone,
      linkedinUrl: documents.hero.linkedinUrl,
      requestedLanguage,
      effectiveLanguage: heroResult.effectiveLanguage,
      isFallback: heroResult.isFallback,
      ...heroResult.value
    },
    about: {
      requestedLanguage,
      effectiveLanguage: aboutResult.effectiveLanguage,
      isFallback: aboutResult.isFallback,
      title: aboutResult.value.title,
      paragraphs: aboutResult.value.paragraphs,
      highlights: documents.about.highlights
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .map((highlight) => {
          const result = resolveLocalizedValue(highlight.translations, effectiveRequestedLanguage, defaultLanguage);
          return {
            id: highlight.id,
            icon: highlight.icon,
            requestedLanguage,
            effectiveLanguage: result.effectiveLanguage,
            isFallback: result.isFallback,
            ...result.value
          };
        })
    },
    skills: {
      requestedLanguage,
      effectiveLanguage: effectiveRequestedLanguage,
      isFallback: false,
      title: skillsTitle,
      categories: documents.skills
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .map((category) => {
          const result = resolveLocalizedValue(category.translations, effectiveRequestedLanguage, defaultLanguage);
          return {
            id: category.id,
            requestedLanguage,
            effectiveLanguage: result.effectiveLanguage,
            isFallback: result.isFallback,
            ...result.value
          };
        })
    },
    services: documents.services
      .sort((left, right) => left.orderIndex - right.orderIndex)
      .map((service) => {
        const result = resolveLocalizedValue(service.translations, effectiveRequestedLanguage, defaultLanguage);
        return {
          id: service.id,
          icon: service.icon,
          requestedLanguage,
          effectiveLanguage: result.effectiveLanguage,
          isFallback: result.isFallback,
          ...result.value
        };
      }),
    experiences: documents.experiences
      .sort((left, right) => left.orderIndex - right.orderIndex)
      .map((experience) => {
        const result = resolveLocalizedValue(experience.translations, effectiveRequestedLanguage, defaultLanguage);
        return {
          id: experience.id,
          location: experience.location,
          current: experience.current,
          requestedLanguage,
          effectiveLanguage: result.effectiveLanguage,
          isFallback: result.isFallback,
          ...result.value
        };
      }),
    education: documents.education
      .sort((left, right) => left.orderIndex - right.orderIndex)
      .map((education) => {
        const result = resolveLocalizedValue(education.translations, effectiveRequestedLanguage, defaultLanguage);
        return {
          id: education.id,
          gpa: education.gpa,
          type: education.type,
          requestedLanguage,
          effectiveLanguage: result.effectiveLanguage,
          isFallback: result.isFallback,
          ...result.value
        };
      }),
    certifications: documents.certifications
      .sort((left, right) => left.orderIndex - right.orderIndex)
      .map((certification) => {
        const result = resolveLocalizedValue(certification.translations, effectiveRequestedLanguage, defaultLanguage);
        return {
          id: certification.id,
          type: certification.type,
          requestedLanguage,
          effectiveLanguage: result.effectiveLanguage,
          isFallback: result.isFallback,
          ...result.value
        };
      }),
    projects: documents.projects
      .sort((left, right) => left.orderIndex - right.orderIndex)
      .map((project) => {
        const result = resolveLocalizedValue(project.translations, effectiveRequestedLanguage, defaultLanguage);
        return {
          id: project.id,
          images: project.images ?? [],
          requestedLanguage,
          effectiveLanguage: result.effectiveLanguage,
          isFallback: result.isFallback,
          ...result.value
        };
      }),
    contact: (() => {
      const result = resolveLocalizedValue(documents.contact.translations, effectiveRequestedLanguage, defaultLanguage);
      return {
        availabilityValue: documents.contact.availabilityValue,
        requestedLanguage,
        effectiveLanguage: result.effectiveLanguage,
        isFallback: result.isFallback,
        ...result.value,
        contactLinks: documents.contact.contactLinks
          .sort((left, right) => left.orderIndex - right.orderIndex)
          .map((link) => {
            const localizedLink = resolveLocalizedValue(link.translations, effectiveRequestedLanguage, defaultLanguage);
            return {
              id: link.id,
              icon: link.icon,
              href: link.href,
              requestedLanguage,
              effectiveLanguage: localizedLink.effectiveLanguage,
              isFallback: localizedLink.isFallback,
              ...localizedLink.value
            };
          })
      };
    })()
  };
}
