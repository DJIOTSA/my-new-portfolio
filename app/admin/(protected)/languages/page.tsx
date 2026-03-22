"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Switch } from "@/components/ui";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { queryKeys } from "@/lib/query/keys";
import { languageSchema } from "@/lib/schemas";

type LanguageFormValues = z.infer<typeof languageSchema>;
type LanguagesFormValues = LanguageFormValues[];
const languagesFormSchema = languageSchema.array();

export default function AdminLanguagesPage() {
  const queryClient = useQueryClient();
  const { data } = useAdminQuery<LanguagesFormValues>(queryKeys.languages, "/api/admin/languages");
  const form = useForm<{ languages: LanguagesFormValues }>({
    resolver: zodResolver(
      z.object({
        languages: languagesFormSchema
      })
    ),
    defaultValues: { languages: [] }
  });
  const languagesArray = useFieldArray({ control: form.control, name: "languages" });

  useEffect(() => {
    if (data) {
      form.reset({ languages: data });
    }
  }, [data, form]);

  async function handleSubmit(values: { languages: LanguagesFormValues }) {
    const normalizedLanguages = values.languages.map((language, index) => ({
      ...language,
      isDefault: index === values.languages.findIndex((entry) => entry.isDefault)
    }));

    await fetch("/api/admin/languages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedLanguages)
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.languages });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Languages</h1>
        <p className="mt-2 text-gray-600">Manage enabled locales, fallback order, and the public default language.</p>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {languagesArray.fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>{form.watch(`languages.${index}.code`).toUpperCase()}</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  form.setValue(
                    "languages",
                    form.getValues("languages").map((language, currentIndex) => ({
                      ...language,
                      isDefault: currentIndex === index
                    }))
                  )
                }
              >
                Mark as default
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register(`languages.${index}.name`)} />
              </div>
              <div className="space-y-2">
                <Label>Native Name</Label>
                <Input {...form.register(`languages.${index}.nativeName`)} />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  {...form.register(`languages.${index}.sortOrder`, { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.watch(`languages.${index}.enabled`)}
                    onCheckedChange={(value) => form.setValue(`languages.${index}.enabled`, value)}
                  />
                  <span className="text-sm text-gray-700">Enabled publicly</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.watch(`languages.${index}.isDefault`)}
                    onCheckedChange={(value) => {
                      if (value) {
                        form.setValue(
                          "languages",
                          form.getValues("languages").map((language, currentIndex) => ({
                            ...language,
                            isDefault: currentIndex === index
                          }))
                        );
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">Default fallback language</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button type="submit">Save languages</Button>
      </form>
    </div>
  );
}
