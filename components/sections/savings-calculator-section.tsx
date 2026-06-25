"use client";

import { useMemo, useState } from "react";
import { Locale } from "@/lib/site-config";
import { EyebrowTag } from "@/components/eyebrow-tag";

type SavingsCalculatorSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    employeesLabel: string;
    employeesHint: string;
    hoursLabel: string;
    hoursHint: string;
    hourlyCostLabel: string;
    hourlyCostHint: string;
    automationLabel: string;
    automationHint: string;
    resultsTitle: string;
    hoursSavedLabel: string;
    monthlySavingsLabel: string;
    yearlySavingsLabel: string;
    ctaTitle: string;
    ctaLabel: string;
    disclaimer: string;
  };
  locale: Locale;
  ctaHref: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SavingsCalculatorSection({ section, locale, ctaHref }: SavingsCalculatorSectionProps) {
  const [employees, setEmployees] = useState(6);
  const [hours, setHours] = useState(8);
  const [hourlyCost, setHourlyCost] = useState(28);
  const [automationPotential, setAutomationPotential] = useState(35);

  const results = useMemo(() => {
    const weeklyHoursSaved = employees * hours * (automationPotential / 100);
    const monthlyHoursSaved = weeklyHoursSaved * 4.33;
    const monthlySavings = monthlyHoursSaved * hourlyCost;
    const yearlySavings = monthlySavings * 12;

    return {
      monthlyHoursSaved,
      monthlySavings,
      yearlySavings
    };
  }, [employees, hours, hourlyCost, automationPotential]);

  const numberFormatter = new Intl.NumberFormat(locale === "pt-PT" ? "pt-PT" : "en-US", {
    maximumFractionDigits: 0
  });
  const currencyFormatter = new Intl.NumberFormat(locale === "pt-PT" ? "pt-PT" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  });

  return (
    <section id="calculator" className="relative bg-background py-16 sm:py-24">
      <div className="mx-auto grid w-[90vw] sm:w-[80vw] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="reveal">
          <EyebrowTag label={section.eyebrow} className="mb-5 text-accent" />
          <h2 className="font-heading text-4xl uppercase leading-[0.95] tracking-tight text-text sm:text-5xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{section.description}</p>
          <div className="mt-8 rounded-2xl bg-pop p-5">
            <p className="font-heading text-xl uppercase text-ink">{section.ctaTitle}</p>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-background transition hover:-translate-y-0.5 sm:w-auto"
            >
              {section.ctaLabel}
            </a>
          </div>
        </div>

        <div className="reveal rounded-3xl bg-surface p-5 sm:p-6 lg:[animation-delay:140ms]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block rounded-2xl bg-background/60 p-4">
              <span className="block text-sm font-semibold text-text">{section.employeesLabel}</span>
              <span className="mt-1 block text-xs text-muted">{section.employeesHint}</span>
              <input
                type="number"
                min={1}
                max={500}
                value={employees}
                onChange={(event) => setEmployees(clamp(Number(event.target.value) || 1, 1, 500))}
                className="mt-4 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-text outline-none"
              />
            </label>

            <label className="block rounded-2xl bg-background/60 p-4">
              <span className="block text-sm font-semibold text-text">{section.hoursLabel}</span>
              <span className="mt-1 block text-xs text-muted">{section.hoursHint}</span>
              <input
                type="number"
                min={1}
                max={80}
                value={hours}
                onChange={(event) => setHours(clamp(Number(event.target.value) || 1, 1, 80))}
                className="mt-4 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-text outline-none"
              />
            </label>

            <label className="block rounded-2xl bg-background/60 p-4">
              <span className="block text-sm font-semibold text-text">{section.hourlyCostLabel}</span>
              <span className="mt-1 block text-xs text-muted">{section.hourlyCostHint}</span>
              <input
                type="number"
                min={1}
                max={500}
                value={hourlyCost}
                onChange={(event) => setHourlyCost(clamp(Number(event.target.value) || 1, 1, 500))}
                className="mt-4 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-text outline-none"
              />
            </label>

            <label className="block rounded-2xl bg-background/60 p-4">
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-text">
                {section.automationLabel}
                <span className="text-accent">{automationPotential}%</span>
              </span>
              <span className="mt-1 block text-xs text-muted">{section.automationHint}</span>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={automationPotential}
                onChange={(event) => setAutomationPotential(Number(event.target.value))}
                className="mt-5 w-full accent-accent"
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl bg-background/85 p-5 text-text">
            <p className="text-sm font-medium text-muted">{section.resultsTitle}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="font-heading text-2xl font-semibold">
                  {numberFormatter.format(results.monthlyHoursSaved)}
                </p>
                <p className="mt-1 text-xs text-muted">{section.hoursSavedLabel}</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold">
                  {currencyFormatter.format(results.monthlySavings)}
                </p>
                <p className="mt-1 text-xs text-muted">{section.monthlySavingsLabel}</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold">
                  {currencyFormatter.format(results.yearlySavings)}
                </p>
                <p className="mt-1 text-xs text-muted">{section.yearlySavingsLabel}</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">{section.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
