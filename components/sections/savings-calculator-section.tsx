"use client";

import { useMemo, useState } from "react";
import { Locale } from "@/lib/site-config";

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
    <section id="calculator" className="relative border-y border-border/80 bg-background/55 py-16 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="reveal">
          <p className="mb-4 inline-flex rounded-full border border-border bg-surface/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {section.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{section.description}</p>
          <div className="mt-8 rounded-2xl border border-accent/25 bg-accent/10 p-5">
            <p className="font-heading text-xl font-semibold text-text">{section.ctaTitle}</p>
            <a
              href={ctaHref}
              className="mt-4 inline-flex w-full justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 sm:w-auto"
            >
              {section.ctaLabel}
            </a>
          </div>
        </div>

        <div className="reveal rounded-3xl border border-border bg-surface p-5 shadow-glow sm:p-6 lg:[animation-delay:140ms]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block rounded-2xl border border-border bg-background/60 p-4">
              <span className="block text-sm font-semibold text-text">{section.employeesLabel}</span>
              <span className="mt-1 block text-xs text-muted">{section.employeesHint}</span>
              <input
                type="number"
                min={1}
                max={500}
                value={employees}
                onChange={(event) => setEmployees(clamp(Number(event.target.value) || 1, 1, 500))}
                className="mt-4 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition focus:border-accent/70"
              />
            </label>

            <label className="block rounded-2xl border border-border bg-background/60 p-4">
              <span className="block text-sm font-semibold text-text">{section.hoursLabel}</span>
              <span className="mt-1 block text-xs text-muted">{section.hoursHint}</span>
              <input
                type="number"
                min={1}
                max={80}
                value={hours}
                onChange={(event) => setHours(clamp(Number(event.target.value) || 1, 1, 80))}
                className="mt-4 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition focus:border-accent/70"
              />
            </label>

            <label className="block rounded-2xl border border-border bg-background/60 p-4">
              <span className="block text-sm font-semibold text-text">{section.hourlyCostLabel}</span>
              <span className="mt-1 block text-xs text-muted">{section.hourlyCostHint}</span>
              <input
                type="number"
                min={1}
                max={500}
                value={hourlyCost}
                onChange={(event) => setHourlyCost(clamp(Number(event.target.value) || 1, 1, 500))}
                className="mt-4 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition focus:border-accent/70"
              />
            </label>

            <label className="block rounded-2xl border border-border bg-background/60 p-4">
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

          <div className="mt-5 rounded-2xl border border-accent/25 bg-text p-5 text-white">
            <p className="text-sm font-medium text-white/70">{section.resultsTitle}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="font-heading text-2xl font-semibold">
                  {numberFormatter.format(results.monthlyHoursSaved)}
                </p>
                <p className="mt-1 text-xs text-white/65">{section.hoursSavedLabel}</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold">
                  {currencyFormatter.format(results.monthlySavings)}
                </p>
                <p className="mt-1 text-xs text-white/65">{section.monthlySavingsLabel}</p>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold">
                  {currencyFormatter.format(results.yearlySavings)}
                </p>
                <p className="mt-1 text-xs text-white/65">{section.yearlySavingsLabel}</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">{section.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
