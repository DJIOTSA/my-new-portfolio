"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Code } from "lucide-react";
import type { PortfolioContent } from "@/lib/types";
import { cn } from "@/lib/utils";

type Project = PortfolioContent["projects"][number];

function clampIndex(next: number, length: number) {
  if (length === 0) {
    return 0;
  }
  return (next + length) % length;
}

export function ProjectCard({ project }: { project: Project }) {
  const images = useMemo(() => project.images ?? [], [project.images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const showControls = images.length > 1;

  function go(direction: number) {
    setActiveIndex((current) => clampIndex(current + direction, images.length));
  }

  return (
    <div className="bg-gray-50 rounded-lg p-8 hover:shadow-xl transition-all duration-300 group">
      {hasImages ? (
        <div className="relative mb-6">
          <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-200 relative">
            {images.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`${project.title} image ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={cn(
                  "object-cover transition-opacity duration-500",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
                unoptimized
                priority={index === 0}
              />
            ))}
          </div>
          {showControls ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>
              <div className="absolute bottom-3 right-3 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={`${project.id}-dot-${index}`}
                    type="button"
                    aria-label={`Go to image ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      index === activeIndex ? "bg-blue-700" : "bg-white/80"
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{project.title}</h3>
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{project.category}</span>
        </div>
        <Code className="w-6 h-6 text-gray-400 group-hover:text-blue-700 transition-colors" />
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span key={tech} className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
