"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

interface BlogBackButtonProps {
  href: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export function BlogBackButton({
  href,
  label = "Back to blog",
  variant = "outline",
  className
}: BlogBackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push(href);
      }}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
