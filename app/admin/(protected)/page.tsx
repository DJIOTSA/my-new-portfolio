"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { queryKeys } from "@/lib/query/keys";
import { useAdminQuery } from "@/hooks/use-admin-query";

interface DashboardData {
  totalPosts: number;
  publishedPosts: number;
  totalLeads: number;
  enabledLanguages: number;
}

export default function AdminOverviewPage() {
  const { data } = useAdminQuery<DashboardData>(queryKeys.dashboard, "/api/admin/dashboard");

  const cards = [
    { label: "Total Posts", value: data?.totalPosts ?? 0 },
    { label: "Published Posts", value: data?.publishedPosts ?? 0 },
    { label: "Leads", value: data?.totalLeads ?? 0 },
    { label: "Enabled Languages", value: data?.enabledLanguages ?? 0 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600 mt-2">Operational snapshot for the portfolio, blog, and lead pipeline.</p>
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
