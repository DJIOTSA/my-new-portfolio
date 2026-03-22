"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";
import { queryKeys } from "@/lib/query/keys";
import { useAdminQuery } from "@/hooks/use-admin-query";

interface DashboardData {
  totalPosts: number;
  publishedPosts: number;
  totalLeads: number;
  enabledLanguages: number;
}

export default function AdminOverviewPage() {
  const { locale } = useAdminLocale();
  const { data } = useAdminQuery<DashboardData>(queryKeys.dashboard, "/api/admin/dashboard");

  const cards = [
    { label: locale === "fr" ? "Articles totaux" : "Total Posts", value: data?.totalPosts ?? 0 },
    { label: locale === "fr" ? "Articles publies" : "Published Posts", value: data?.publishedPosts ?? 0 },
    { label: locale === "fr" ? "Prospects" : "Leads", value: data?.totalLeads ?? 0 },
    { label: locale === "fr" ? "Langues actives" : "Enabled Languages", value: data?.enabledLanguages ?? 0 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{locale === "fr" ? "Vue d'ensemble" : "Overview"}</h1>
        <p className="text-gray-600 mt-2">{locale === "fr" ? "Vue operationnelle du portfolio, du blog et du pipeline de prospects." : "Operational snapshot for the portfolio, blog, and lead pipeline."}</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle>{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-700">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
