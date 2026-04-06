"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { Control, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@/components/ui";
import { useAdminLocale } from "@/components/organisms/admin/admin-locale-provider";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { adminFetch, adminJsonFetch } from "@/lib/auth/client";
import { queryKeys } from "@/lib/query/keys";
import { portfolioAdminSchema } from "@/db/validation/portfolio-admin";

type PortfolioFormValues = z.infer<typeof portfolioAdminSchema>;
type StringFieldItem = { value: string };
type StringArrayToFieldArray<T> =
  T extends string[] ? StringFieldItem[] :
  T extends Array<infer U> ? StringArrayToFieldArray<U>[] :
  T extends object ? { [K in keyof T]: StringArrayToFieldArray<T[K]> } :
  T;

type PortfolioEditorFormValues = StringArrayToFieldArray<PortfolioFormValues>;
type UploadUrlResponse = { uploadUrl: string; storageKey: string; publicUrl: string };

function createStringFieldItems(values: string[] = []): StringFieldItem[] {
  return values.map((value) => ({ value }));
}

function createEmptyPortfolio(): PortfolioEditorFormValues {
  return {
    hero: {
      id: "hero_1",
      profileImageUrl: "",
      location: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      translations: {
        en: {
          firstName: "",
          lastName: "",
          headline: "",
          availabilityLabel: "",
          primaryCtaLabel: "",
          secondaryCtaLabel: ""
        },
        fr: {
          firstName: "",
          lastName: "",
          headline: "",
          availabilityLabel: "",
          primaryCtaLabel: "",
          secondaryCtaLabel: ""
        }
      }
    },
    about: {
      id: "about_1",
      translations: {
        en: { title: "", paragraphs: createStringFieldItems() },
        fr: { title: "", paragraphs: createStringFieldItems() }
      },
      highlights: []
    },
    skills: [],
    services: [],
    experiences: [],
    education: [],
    certifications: [],
    projects: [],
    contact: {
      id: "contact_1",
      availabilityValue: "",
      translations: {
        en: {
          title: "",
          subtitle: "",
          formTitle: "",
          formTypeLabel: "",
          nameLabel: "",
          namePlaceholder: "",
          emailLabel: "",
          emailPlaceholder: "",
          subjectLabel: "",
          subjectPlaceholder: "",
          messageLabel: "",
          messagePlaceholder: "",
          submitLabel: ""
        },
        fr: {
          title: "",
          subtitle: "",
          formTitle: "",
          formTypeLabel: "",
          nameLabel: "",
          namePlaceholder: "",
          emailLabel: "",
          emailPlaceholder: "",
          subjectLabel: "",
          subjectPlaceholder: "",
          messageLabel: "",
          messagePlaceholder: "",
          submitLabel: ""
        }
      },
      contactLinks: []
    }
  };
}

function normalizeNullableString(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function normalizeStringList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function toStringList(values: StringFieldItem[]): string[] {
  return normalizeStringList(values.map((item) => item.value));
}

function toEditorValues(values: PortfolioFormValues): PortfolioEditorFormValues {
  return {
    ...values,
    about: {
      ...values.about,
      translations: {
        en: {
          ...values.about.translations.en,
          paragraphs: createStringFieldItems(values.about.translations.en.paragraphs)
        },
        fr: {
          ...values.about.translations.fr,
          paragraphs: createStringFieldItems(values.about.translations.fr.paragraphs)
        }
      }
    },
    skills: values.skills.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          skills: createStringFieldItems(entry.translations.en.skills)
        },
        fr: {
          ...entry.translations.fr,
          skills: createStringFieldItems(entry.translations.fr.skills)
        }
      }
    })),
    services: values.services.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          features: createStringFieldItems(entry.translations.en.features)
        },
        fr: {
          ...entry.translations.fr,
          features: createStringFieldItems(entry.translations.fr.features)
        }
      }
    })),
    experiences: values.experiences.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          description: createStringFieldItems(entry.translations.en.description)
        },
        fr: {
          ...entry.translations.fr,
          description: createStringFieldItems(entry.translations.fr.description)
        }
      }
    })),
    projects: values.projects.map((entry) => ({
      ...entry,
      images: createStringFieldItems(entry.images ?? []),
      translations: {
        en: {
          ...entry.translations.en,
          tech: createStringFieldItems(entry.translations.en.tech)
        },
        fr: {
          ...entry.translations.fr,
          tech: createStringFieldItems(entry.translations.fr.tech)
        }
      }
    }))
  };
}

function fromEditorValues(values: PortfolioEditorFormValues): PortfolioFormValues {
  return {
    ...values,
    about: {
      ...values.about,
      translations: {
        en: {
          ...values.about.translations.en,
          paragraphs: toStringList(values.about.translations.en.paragraphs)
        },
        fr: {
          ...values.about.translations.fr,
          paragraphs: toStringList(values.about.translations.fr.paragraphs)
        }
      }
    },
    skills: values.skills.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          skills: toStringList(entry.translations.en.skills)
        },
        fr: {
          ...entry.translations.fr,
          skills: toStringList(entry.translations.fr.skills)
        }
      }
    })),
    services: values.services.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          features: toStringList(entry.translations.en.features)
        },
        fr: {
          ...entry.translations.fr,
          features: toStringList(entry.translations.fr.features)
        }
      }
    })),
    experiences: values.experiences.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          description: toStringList(entry.translations.en.description)
        },
        fr: {
          ...entry.translations.fr,
          description: toStringList(entry.translations.fr.description)
        }
      }
    })),
    projects: values.projects.map((entry) => ({
      ...entry,
      images: toStringList(entry.images),
      translations: {
        en: {
          ...entry.translations.en,
          tech: toStringList(entry.translations.en.tech)
        },
        fr: {
          ...entry.translations.fr,
          tech: toStringList(entry.translations.fr.tech)
        }
      }
    }))
  };
}

function normalizePortfolio(values: PortfolioFormValues): PortfolioFormValues {
  return {
    ...values,
    about: {
      ...values.about,
      translations: {
        en: {
          ...values.about.translations.en,
          paragraphs: normalizeStringList(values.about.translations.en.paragraphs)
        },
        fr: {
          ...values.about.translations.fr,
          paragraphs: normalizeStringList(values.about.translations.fr.paragraphs)
        }
      }
    },
    skills: values.skills.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          skills: normalizeStringList(entry.translations.en.skills)
        },
        fr: {
          ...entry.translations.fr,
          skills: normalizeStringList(entry.translations.fr.skills)
        }
      }
    })),
    services: values.services.map((entry) => ({
      ...entry,
      translations: {
        en: {
          ...entry.translations.en,
          features: normalizeStringList(entry.translations.en.features)
        },
        fr: {
          ...entry.translations.fr,
          features: normalizeStringList(entry.translations.fr.features)
        }
      }
    })),
    experiences: values.experiences.map((entry) => ({
      ...entry,
      location: normalizeNullableString(entry.location),
      translations: {
        en: {
          ...entry.translations.en,
          description: normalizeStringList(entry.translations.en.description)
        },
        fr: {
          ...entry.translations.fr,
          description: normalizeStringList(entry.translations.fr.description)
        }
      }
    })),
    education: values.education.map((entry) => ({
      ...entry,
      gpa: normalizeNullableString(entry.gpa)
    })),
    projects: values.projects.map((entry) => ({
      ...entry,
      images: normalizeStringList(entry.images),
      translations: {
        en: {
          ...entry.translations.en,
          tech: normalizeStringList(entry.translations.en.tech)
        },
        fr: {
          ...entry.translations.fr,
          tech: normalizeStringList(entry.translations.fr.tech)
        }
      }
    })),
    contact: {
      ...values.contact,
      contactLinks: values.contact.contactLinks.map((entry) => ({
        ...entry,
        href: normalizeNullableString(entry.href)
      }))
    }
  };
}

function StringListField({
  control,
  register,
  name,
  label,
  addLabel
}: {
  control: Control<any>;
  register: UseFormRegister<any>;
  name: string;
  label: string;
  addLabel: string;
}) {
  const list = useFieldArray({
    control,
    name: name as never
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" onClick={() => list.append({ value: "" })}>
          {addLabel}
        </Button>
      </div>
      {list.fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <LabeledInput label={`${label} ${index + 1}`} wrapperClassName="flex-1" {...register(`${name}.${index}.value`)} />
          <Button
            type="button"
            variant="outline"
            onClick={() => list.remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

function ProjectImagesField({
  control,
  projectIndex,
  projectId
}: {
  control: Control<PortfolioEditorFormValues>;
  projectIndex: number;
  projectId: string;
}) {
  const imagesArray = useFieldArray({
    control,
    name: `projects.${projectIndex}.images` as const
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    event.target.value = "";
    setUploading(true);
    setUploadError(null);

    try {
      const sanitizedProjectId = projectId.replace(/[^a-zA-Z0-9_-]/g, "-") || "project";
      const uploadRequest = await adminJsonFetch<UploadUrlResponse>("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          directory: `portfolio/projects/${sanitizedProjectId}`
        })
      });

      const uploadResponse = await fetch(uploadRequest.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      imagesArray.append({ value: uploadRequest.publicUrl });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function moveUp(index: number) {
    if (index === 0) return;
    imagesArray.move(index, index - 1);
  }

  function moveDown(index: number) {
    if (index === imagesArray.fields.length - 1) return;
    imagesArray.move(index, index + 1);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label>Images</Label>
          <p className="text-xs text-gray-500">Upload to Supabase Storage; first image is used as the cover.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={openFilePicker} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>
      {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
      {imagesArray.fields.length === 0 ? (
        <p className="text-sm text-gray-500">No images yet. Upload to add the first one.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {imagesArray.fields.map((field, index) => (
            <div key={field.id} className="border rounded-md p-2 bg-white shadow-sm">
              <div className="aspect-[16/9] overflow-hidden rounded bg-gray-100">
                {field.value ? (
                  <img src={field.value} alt={`Project image ${index + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gray-100" />
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-500 truncate">{field.value}</span>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => moveUp(index)} disabled={index === 0}>
                    Up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => moveDown(index)}
                    disabled={index === imagesArray.fields.length - 1}
                  >
                    Down
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => imagesArray.remove(index)}>
                    Remove
                  </Button>
                </div>
              </div>
              {index === 0 ? <p className="text-[11px] text-blue-700 mt-1">Cover image</p> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TranslationTabs({
  enContent,
  frContent
}: {
  enContent: ReactNode;
  frContent: ReactNode;
}) {
  return (
    <Tabs defaultValue="en" className="space-y-4">
      <TabsList>
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="fr">French</TabsTrigger>
      </TabsList>
      <TabsContent value="en" className="space-y-4">
        {enContent}
      </TabsContent>
      <TabsContent value="fr" className="space-y-4">
        {frContent}
      </TabsContent>
    </Tabs>
  );
}

function Field({
  label,
  children,
  className
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `space-y-2 ${className}` : "space-y-2"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function LabeledInput({
  label,
  wrapperClassName,
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  wrapperClassName?: string;
}) {
  return (
    <Field label={label} className={wrapperClassName}>
      <Input {...props} />
    </Field>
  );
}

function LabeledTextarea({
  label,
  wrapperClassName,
  ...props
}: ComponentProps<typeof Textarea> & {
  label: string;
  wrapperClassName?: string;
}) {
  return (
    <Field label={label} className={wrapperClassName}>
      <Textarea {...props} />
    </Field>
  );
}

function ProjectCardFields({
  control,
  register,
  index,
  onRemove,
  fieldId
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
  index: number;
  onRemove: () => void;
  fieldId: string;
}) {
  const projectId = useWatch({ control, name: `projects.${index}.id` });

  return (
    <Card key={fieldId}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Project {index + 1}</CardTitle>
        <Button type="button" variant="outline" onClick={onRemove}>
          Remove
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="ID" {...register(`projects.${index}.id`)} />
          <LabeledInput label="Order" type="number" {...register(`projects.${index}.orderIndex`, { valueAsNumber: true })} />
        </div>
        <ProjectImagesField control={control} projectIndex={index} projectId={projectId || `project_${index + 1}`} />
        <TranslationTabs
          enContent={
            <div className="space-y-4">
              <LabeledInput label="Title" {...register(`projects.${index}.translations.en.title`)} />
              <LabeledTextarea label="Description" {...register(`projects.${index}.translations.en.description`)} />
              <LabeledInput label="Category" {...register(`projects.${index}.translations.en.category`)} />
              <StringListField control={control} register={register} name={`projects.${index}.translations.en.tech`} label="Tech stack" addLabel="Add tech" />
            </div>
          }
          frContent={
            <div className="space-y-4">
              <LabeledInput label="Titre" {...register(`projects.${index}.translations.fr.title`)} />
              <LabeledTextarea label="Description" {...register(`projects.${index}.translations.fr.description`)} />
              <LabeledInput label="Categorie" {...register(`projects.${index}.translations.fr.category`)} />
              <StringListField control={control} register={register} name={`projects.${index}.translations.fr.tech`} label="Technologies" addLabel="Ajouter une technologie" />
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}

function HeroSection({ register }: { register: UseFormRegister<PortfolioEditorFormValues> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>ID</Label>
            <Input {...register("hero.id")} />
          </div>
          <div className="space-y-2">
            <Label>Profile Image URL</Label>
            <Input {...register("hero.profileImageUrl")} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...register("hero.location")} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register("hero.email")} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register("hero.phone")} />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input {...register("hero.linkedinUrl")} />
          </div>
        </div>
        <TranslationTabs
          enContent={
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput label="First Name" {...register("hero.translations.en.firstName")} />
              <LabeledInput label="Last Name" {...register("hero.translations.en.lastName")} />
              <LabeledTextarea label="Headline" {...register("hero.translations.en.headline")} wrapperClassName="md:col-span-2" />
              <LabeledInput label="Availability Label" {...register("hero.translations.en.availabilityLabel")} />
              <LabeledInput label="Primary CTA Label" {...register("hero.translations.en.primaryCtaLabel")} />
              <LabeledInput label="Secondary CTA Label" {...register("hero.translations.en.secondaryCtaLabel")} />
            </div>
          }
          frContent={
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput label="Prenom" {...register("hero.translations.fr.firstName")} />
              <LabeledInput label="Nom" {...register("hero.translations.fr.lastName")} />
              <LabeledTextarea label="Titre" {...register("hero.translations.fr.headline")} wrapperClassName="md:col-span-2" />
              <LabeledInput label="Label Disponibilite" {...register("hero.translations.fr.availabilityLabel")} />
              <LabeledInput label="Label CTA Principal" {...register("hero.translations.fr.primaryCtaLabel")} />
              <LabeledInput label="Label CTA Secondaire" {...register("hero.translations.fr.secondaryCtaLabel")} />
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}

function AboutSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const highlightsArray = useFieldArray({ control, name: "about.highlights" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>ID</Label>
          <Input {...register("about.id")} />
        </div>
        <TranslationTabs
          enContent={
            <div className="space-y-4">
              <LabeledInput label="Title" {...register("about.translations.en.title")} />
              <StringListField control={control} register={register} name="about.translations.en.paragraphs" label="Paragraphs" addLabel="Add paragraph" />
            </div>
          }
          frContent={
            <div className="space-y-4">
              <LabeledInput label="Titre" {...register("about.translations.fr.title")} />
              <StringListField control={control} register={register} name="about.translations.fr.paragraphs" label="Paragraphes" addLabel="Ajouter un paragraphe" />
            </div>
          }
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Highlights</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                highlightsArray.append({
                  id: `highlight_${Date.now()}`,
                  icon: "",
                  orderIndex: highlightsArray.fields.length,
                  translations: {
                    en: { title: "", description: "" },
                    fr: { title: "", description: "" }
                  }
                })
              }
            >
              Add highlight
            </Button>
          </div>
          {highlightsArray.fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Highlight {index + 1}</CardTitle>
                <Button type="button" variant="outline" onClick={() => highlightsArray.remove(index)}>
                  Remove
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <LabeledInput label="ID" {...register(`about.highlights.${index}.id`)} />
                  <LabeledInput label="Icon" {...register(`about.highlights.${index}.icon`)} />
                  <LabeledInput label="Order" type="number" {...register(`about.highlights.${index}.orderIndex`, { valueAsNumber: true })} />
                </div>
                <TranslationTabs
                  enContent={
                    <div className="grid gap-4 md:grid-cols-2">
                      <LabeledInput label="Title" {...register(`about.highlights.${index}.translations.en.title`)} />
                      <LabeledInput label="Description" {...register(`about.highlights.${index}.translations.en.description`)} />
                    </div>
                  }
                  frContent={
                    <div className="grid gap-4 md:grid-cols-2">
                      <LabeledInput label="Titre" {...register(`about.highlights.${index}.translations.fr.title`)} />
                      <LabeledInput label="Description" {...register(`about.highlights.${index}.translations.fr.description`)} />
                    </div>
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SkillsSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const skillsArray = useFieldArray({ control, name: "skills" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Skills</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            skillsArray.append({
              id: `skills_${Date.now()}`,
              orderIndex: skillsArray.fields.length,
              translations: {
                en: { title: "", skills: [] },
                fr: { title: "", skills: [] }
              }
            })
          }
        >
          Add category
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {skillsArray.fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Category {index + 1}</CardTitle>
              <Button type="button" variant="outline" onClick={() => skillsArray.remove(index)}>
                Remove
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label="ID" {...register(`skills.${index}.id`)} />
                <LabeledInput label="Order" type="number" {...register(`skills.${index}.orderIndex`, { valueAsNumber: true })} />
              </div>
              <TranslationTabs
                enContent={
                  <div className="space-y-4">
                    <LabeledInput label="Title" {...register(`skills.${index}.translations.en.title`)} />
                    <StringListField control={control} register={register} name={`skills.${index}.translations.en.skills`} label="Skill items" addLabel="Add skill" />
                  </div>
                }
                frContent={
                  <div className="space-y-4">
                    <LabeledInput label="Titre" {...register(`skills.${index}.translations.fr.title`)} />
                    <StringListField control={control} register={register} name={`skills.${index}.translations.fr.skills`} label="Competences" addLabel="Ajouter une competence" />
                  </div>
                }
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function ServicesSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const servicesArray = useFieldArray({ control, name: "services" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Services</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            servicesArray.append({
              id: `service_${Date.now()}`,
              icon: "",
              orderIndex: servicesArray.fields.length,
              translations: {
                en: { title: "", description: "", features: [] },
                fr: { title: "", description: "", features: [] }
              }
            })
          }
        >
          Add service
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {servicesArray.fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Service {index + 1}</CardTitle>
              <Button type="button" variant="outline" onClick={() => servicesArray.remove(index)}>
                Remove
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <LabeledInput label="ID" {...register(`services.${index}.id`)} />
                <LabeledInput label="Icon" {...register(`services.${index}.icon`)} />
                <LabeledInput label="Order" type="number" {...register(`services.${index}.orderIndex`, { valueAsNumber: true })} />
              </div>
              <TranslationTabs
                enContent={
                  <div className="space-y-4">
                    <LabeledInput label="Title" {...register(`services.${index}.translations.en.title`)} />
                    <LabeledTextarea label="Description" {...register(`services.${index}.translations.en.description`)} />
                    <StringListField control={control} register={register} name={`services.${index}.translations.en.features`} label="Features" addLabel="Add feature" />
                  </div>
                }
                frContent={
                  <div className="space-y-4">
                    <LabeledInput label="Titre" {...register(`services.${index}.translations.fr.title`)} />
                    <LabeledTextarea label="Description" {...register(`services.${index}.translations.fr.description`)} />
                    <StringListField control={control} register={register} name={`services.${index}.translations.fr.features`} label="Fonctionnalites" addLabel="Ajouter une fonctionnalite" />
                  </div>
                }
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function ExperiencesSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const experiencesArray = useFieldArray({ control, name: "experiences" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Experiences</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            experiencesArray.append({
              id: `experience_${Date.now()}`,
              location: null,
              current: false,
              orderIndex: experiencesArray.fields.length,
              translations: {
                en: { title: "", company: "", period: "", description: [] },
                fr: { title: "", company: "", period: "", description: [] }
              }
            })
          }
        >
          Add experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiencesArray.fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Experience {index + 1}</CardTitle>
              <Button type="button" variant="outline" onClick={() => experiencesArray.remove(index)}>
                Remove
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <LabeledInput label="ID" {...register(`experiences.${index}.id`)} />
                <LabeledInput label="Location" {...register(`experiences.${index}.location`)} />
                <LabeledInput label="Order" type="number" {...register(`experiences.${index}.orderIndex`, { valueAsNumber: true })} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" {...register(`experiences.${index}.current`)} />
                <span className="text-sm text-gray-700">Current role</span>
              </div>
              <TranslationTabs
                enContent={
                  <div className="space-y-4">
                    <LabeledInput label="Title" {...register(`experiences.${index}.translations.en.title`)} />
                    <LabeledInput label="Company" {...register(`experiences.${index}.translations.en.company`)} />
                    <LabeledInput label="Period" {...register(`experiences.${index}.translations.en.period`)} />
                    <StringListField control={control} register={register} name={`experiences.${index}.translations.en.description`} label="Responsibilities" addLabel="Add responsibility" />
                  </div>
                }
                frContent={
                  <div className="space-y-4">
                    <LabeledInput label="Titre" {...register(`experiences.${index}.translations.fr.title`)} />
                    <LabeledInput label="Entreprise" {...register(`experiences.${index}.translations.fr.company`)} />
                    <LabeledInput label="Periode" {...register(`experiences.${index}.translations.fr.period`)} />
                    <StringListField control={control} register={register} name={`experiences.${index}.translations.fr.description`} label="Responsabilites" addLabel="Ajouter une responsabilite" />
                  </div>
                }
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function EducationSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const educationArray = useFieldArray({ control, name: "education" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Education</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            educationArray.append({
              id: `education_${Date.now()}`,
              gpa: null,
              type: "",
              orderIndex: educationArray.fields.length,
              translations: {
                en: { degree: "", institution: "" },
                fr: { degree: "", institution: "" }
              }
            })
          }
        >
          Add education
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {educationArray.fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Education {index + 1}</CardTitle>
              <Button type="button" variant="outline" onClick={() => educationArray.remove(index)}>
                Remove
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <LabeledInput label="ID" {...register(`education.${index}.id`)} />
                <LabeledInput label="Type" {...register(`education.${index}.type`)} />
                <LabeledInput label="GPA" {...register(`education.${index}.gpa`)} />
                <LabeledInput label="Order" type="number" {...register(`education.${index}.orderIndex`, { valueAsNumber: true })} />
              </div>
              <TranslationTabs
                enContent={
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledInput label="Degree" {...register(`education.${index}.translations.en.degree`)} />
                    <LabeledInput label="Institution" {...register(`education.${index}.translations.en.institution`)} />
                  </div>
                }
                frContent={
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledInput label="Diplome" {...register(`education.${index}.translations.fr.degree`)} />
                    <LabeledInput label="Institution" {...register(`education.${index}.translations.fr.institution`)} />
                  </div>
                }
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function CertificationsSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const certificationsArray = useFieldArray({ control, name: "certifications" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Certifications</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            certificationsArray.append({
              id: `certification_${Date.now()}`,
              type: "",
              orderIndex: certificationsArray.fields.length,
              translations: {
                en: { title: "", provider: "", count: "" },
                fr: { title: "", provider: "", count: "" }
              }
            })
          }
        >
          Add certification
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {certificationsArray.fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Certification {index + 1}</CardTitle>
              <Button type="button" variant="outline" onClick={() => certificationsArray.remove(index)}>
                Remove
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <LabeledInput label="ID" {...register(`certifications.${index}.id`)} />
                <LabeledInput label="Type" {...register(`certifications.${index}.type`)} />
                <LabeledInput label="Order" type="number" {...register(`certifications.${index}.orderIndex`, { valueAsNumber: true })} />
              </div>
              <TranslationTabs
                enContent={
                  <div className="grid gap-4 md:grid-cols-3">
                    <LabeledInput label="Title" {...register(`certifications.${index}.translations.en.title`)} />
                    <LabeledInput label="Provider" {...register(`certifications.${index}.translations.en.provider`)} />
                    <LabeledInput label="Count" {...register(`certifications.${index}.translations.en.count`)} />
                  </div>
                }
                frContent={
                  <div className="grid gap-4 md:grid-cols-3">
                    <LabeledInput label="Titre" {...register(`certifications.${index}.translations.fr.title`)} />
                    <LabeledInput label="Fournisseur" {...register(`certifications.${index}.translations.fr.provider`)} />
                    <LabeledInput label="Nombre" {...register(`certifications.${index}.translations.fr.count`)} />
                  </div>
                }
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function ProjectsSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const projectsArray = useFieldArray({ control, name: "projects" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Projects</CardTitle>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            projectsArray.append({
              id: `project_${Date.now()}`,
              orderIndex: projectsArray.fields.length,
              images: [],
              translations: {
                en: { title: "", description: "", tech: [], category: "" },
                fr: { title: "", description: "", tech: [], category: "" }
              }
            })
          }
        >
          Add project
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectsArray.fields.map((field, index) => (
          <ProjectCardFields
            key={field.id}
            fieldId={field.id}
            control={control}
            register={register}
            index={index}
            onRemove={() => projectsArray.remove(index)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ContactSection({
  control,
  register
}: {
  control: Control<PortfolioEditorFormValues>;
  register: UseFormRegister<PortfolioEditorFormValues>;
}) {
  const linksArray = useFieldArray({ control, name: "contact.contactLinks" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput label="ID" {...register("contact.id")} />
          <LabeledInput label="Availability Value" {...register("contact.availabilityValue")} />
        </div>
        <TranslationTabs
          enContent={
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput label="Title" {...register("contact.translations.en.title")} />
              <LabeledInput label="Subtitle" {...register("contact.translations.en.subtitle")} />
              <LabeledInput label="Form Title" {...register("contact.translations.en.formTitle")} />
              <LabeledInput label="Form Type Label" {...register("contact.translations.en.formTypeLabel")} />
              <LabeledInput label="Name Label" {...register("contact.translations.en.nameLabel")} />
              <LabeledInput label="Name Placeholder" {...register("contact.translations.en.namePlaceholder")} />
              <LabeledInput label="Email Label" {...register("contact.translations.en.emailLabel")} />
              <LabeledInput label="Email Placeholder" {...register("contact.translations.en.emailPlaceholder")} />
              <LabeledInput label="Subject Label" {...register("contact.translations.en.subjectLabel")} />
              <LabeledInput label="Subject Placeholder" {...register("contact.translations.en.subjectPlaceholder")} />
              <LabeledInput label="Message Label" {...register("contact.translations.en.messageLabel")} />
              <LabeledInput label="Message Placeholder" {...register("contact.translations.en.messagePlaceholder")} />
              <LabeledInput label="Submit Label" wrapperClassName="md:col-span-2" {...register("contact.translations.en.submitLabel")} />
            </div>
          }
          frContent={
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput label="Titre" {...register("contact.translations.fr.title")} />
              <LabeledInput label="Sous-titre" {...register("contact.translations.fr.subtitle")} />
              <LabeledInput label="Titre du Formulaire" {...register("contact.translations.fr.formTitle")} />
              <LabeledInput label="Label Type Formulaire" {...register("contact.translations.fr.formTypeLabel")} />
              <LabeledInput label="Label Nom" {...register("contact.translations.fr.nameLabel")} />
              <LabeledInput label="Placeholder Nom" {...register("contact.translations.fr.namePlaceholder")} />
              <LabeledInput label="Label Email" {...register("contact.translations.fr.emailLabel")} />
              <LabeledInput label="Placeholder Email" {...register("contact.translations.fr.emailPlaceholder")} />
              <LabeledInput label="Label Sujet" {...register("contact.translations.fr.subjectLabel")} />
              <LabeledInput label="Placeholder Sujet" {...register("contact.translations.fr.subjectPlaceholder")} />
              <LabeledInput label="Label Message" {...register("contact.translations.fr.messageLabel")} />
              <LabeledInput label="Placeholder Message" {...register("contact.translations.fr.messagePlaceholder")} />
              <LabeledInput label="Label Envoyer" wrapperClassName="md:col-span-2" {...register("contact.translations.fr.submitLabel")} />
            </div>
          }
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Contact Links</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                linksArray.append({
                  id: `contact_link_${Date.now()}`,
                  icon: "",
                  href: null,
                  orderIndex: linksArray.fields.length,
                  translations: {
                    en: { label: "", value: "" },
                    fr: { label: "", value: "" }
                  }
                })
              }
            >
              Add link
            </Button>
          </div>
          {linksArray.fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Link {index + 1}</CardTitle>
                <Button type="button" variant="outline" onClick={() => linksArray.remove(index)}>
                  Remove
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <LabeledInput label="ID" {...register(`contact.contactLinks.${index}.id`)} />
                  <LabeledInput label="Icon" {...register(`contact.contactLinks.${index}.icon`)} />
                  <LabeledInput label="Href" {...register(`contact.contactLinks.${index}.href`)} />
                  <LabeledInput label="Order" type="number" {...register(`contact.contactLinks.${index}.orderIndex`, { valueAsNumber: true })} />
                </div>
                <TranslationTabs
                  enContent={
                    <div className="grid gap-4 md:grid-cols-2">
                      <LabeledInput label="Label" {...register(`contact.contactLinks.${index}.translations.en.label`)} />
                      <LabeledInput label="Value" {...register(`contact.contactLinks.${index}.translations.en.value`)} />
                    </div>
                  }
                  frContent={
                    <div className="grid gap-4 md:grid-cols-2">
                      <LabeledInput label="Label" {...register(`contact.contactLinks.${index}.translations.fr.label`)} />
                      <LabeledInput label="Valeur" {...register(`contact.contactLinks.${index}.translations.fr.value`)} />
                    </div>
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortfolioEditor() {
  const queryClient = useQueryClient();
  const { locale } = useAdminLocale();
  const { data } = useAdminQuery<PortfolioFormValues>(queryKeys.portfolio, "/api/admin/portfolio");
  const form = useForm<PortfolioEditorFormValues>({
    defaultValues: createEmptyPortfolio()
  });
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(toEditorValues(data));
    }
  }, [data, form]);

  async function handleSubmit(values: PortfolioEditorFormValues) {
    const payload = portfolioAdminSchema.parse(normalizePortfolio(fromEditorValues(values)));
    await adminFetch("/api/admin/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.portfolio });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{locale === "fr" ? "Editeur du portfolio" : "Portfolio Editor"}</h1>
        <p className="mt-2 text-gray-600">
          {locale === "fr"
            ? "Chaque section du portfolio est maintenant editee avec de vrais champs de formulaire."
            : "Each portfolio section is now editable with real form fields."}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <TabsContent value="hero">
            <HeroSection register={form.register} />
          </TabsContent>
          <TabsContent value="about">
            <AboutSection control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsSection control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="services">
            <ServicesSection control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="experiences">
            <ExperiencesSection control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="education">
            <EducationSection control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="certifications">
            <CertificationsSection control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsSection control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="contact">
            <ContactSection control={form.control} register={form.register} />
          </TabsContent>
        </Tabs>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (locale === "fr" ? "Enregistrement..." : "Saving...") : locale === "fr" ? "Enregistrer le portfolio" : "Save portfolio"}
        </Button>
      </form>
    </div>
  );
}
