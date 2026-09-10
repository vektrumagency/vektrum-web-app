"use client";

import { useState } from "react";
import { SectionShell } from "@/components/section-shell";
import { ProjectCard } from "@/components/sectors/project-card";
import { SectorProject } from "@/lib/sectors-content";

type SectorPortfolioProps = {
  title: string;
  projects: SectorProject[];
  whatWeBuiltLabel: string;
  resultsLabel: string;
};

export function SectorPortfolio({ title, projects, whatWeBuiltLabel, resultsLabel }: SectorPortfolioProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionShell id="portfolio" title={title}>
      <div className="flex flex-col gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            whatWeBuiltLabel={whatWeBuiltLabel}
            resultsLabel={resultsLabel}
            tone={index % 2 === 0 ? "ink" : "accent"}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
          />
        ))}
      </div>
    </SectionShell>
  );
}
