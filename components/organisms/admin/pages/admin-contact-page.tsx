"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useAdminLocale } from "@/components/organisms/admin/admin-locale-provider";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { adminFetch } from "@/lib/auth/client";
import { queryKeys } from "@/lib/query/keys";
import type { ContactEntryEntity } from "@/lib/types";

const leadStatuses = ["new", "reviewing", "replied", "closed"] as const;

export default function AdminContactPage() {
  const { locale } = useAdminLocale();
  const queryClient = useQueryClient();
  const { data } = useAdminQuery<ContactEntryEntity[]>(queryKeys.contactEntries, "/api/admin/contact");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await adminFetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.contactEntries });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{locale === "fr" ? "Prospects" : "Leads"}</h1>
        <p className="mt-2 text-gray-600">{locale === "fr" ? "Suivez les demandes de contact, de projet et de consultation depuis le portfolio et le blog." : "Track inbound contact, project inquiry, and consultation requests from the portfolio and blog."}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.subject}</TableCell>
                  <TableCell className="min-w-40">
                    <div className="flex items-center gap-2">
                      <Select value={entry.status} onValueChange={(value) => updateStatus(entry.id, value)} disabled={updatingId === entry.id}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {leadStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingId === entry.id ? <span className="text-xs text-gray-500">Saving...</span> : null}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md whitespace-pre-wrap text-sm text-gray-600">{entry.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data?.length ? null : (
            <p className="py-6 text-sm text-gray-500">No leads yet. New contact form submissions will appear here.</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isRefreshing}
          onClick={async () => {
            setIsRefreshing(true);
            try {
              await queryClient.invalidateQueries({ queryKey: queryKeys.contactEntries });
            } finally {
              setIsRefreshing(false);
            }
          }}
        >
          {isRefreshing ? "Refreshing..." : "Refresh leads"}
        </Button>
      </div>
    </div>
  );
}
