"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale, SiteConfig } from "@/lib/site-config";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5">
      <h2 className="font-heading text-lg font-semibold text-text">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm text-text outline-none focus:border-accent"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-slate-50 px-3 py-2 text-sm text-text outline-none focus:border-accent"
      />
    </label>
  );
}

export default function AdminPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadConfig() {
      const response = await fetch("/api/admin/config", { cache: "no-store" });
      if (!response.ok) {
        router.push("/admin/login");
        return;
      }
      const data = (await response.json()) as { config: SiteConfig };
      setConfig(data.config);
      setLoading(false);
    }

    void loadConfig();
  }, [router]);

  function updateLocaleField<K extends keyof SiteConfig["locales"][Locale]>(
    key: K,
    updater: (current: SiteConfig["locales"][Locale][K]) => SiteConfig["locales"][Locale][K]
  ) {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        locales: {
          ...prev.locales,
          [locale]: {
            ...prev.locales[locale],
            [key]: updater(prev.locales[locale][key])
          }
        }
      };
    });
  }

  function updateBrandField(key: keyof SiteConfig["brand"], value: string) {
    setConfig((prev) => (prev ? { ...prev, brand: { ...prev.brand, [key]: value } } : prev));
  }

  async function saveConfig() {
    if (!config) return;
    setSaving(true);
    setStatus("");
    const response = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config })
    });
    setSaving(false);
    setStatus(response.ok ? "Saved successfully." : "Failed to save.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading || !config) {
    return <main className="p-10 text-sm text-muted">Loading admin...</main>;
  }

  const content = config.locales[locale];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text">Vektrum Admin</h1>
          <p className="mt-1 text-sm text-muted">Edit important website content in a visual UI.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`rounded-full px-3 py-1.5 text-xs ${locale === "en" ? "bg-text text-white" : "bg-white text-muted border border-border"}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLocale("pt-PT")}
            className={`rounded-full px-3 py-1.5 text-xs ${locale === "pt-PT" ? "bg-text text-white" : "bg-white text-muted border border-border"}`}
          >
            PT-PT
          </button>
          <button
            type="button"
            onClick={() => setLocale("es")}
            className={`rounded-full px-3 py-1.5 text-xs ${locale === "es" ? "bg-text text-white" : "bg-white text-muted border border-border"}`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={saveConfig}
            disabled={saving}
            className="ml-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <SectionCard title="Brand & Contact">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Contact Email" value={config.brand.email} onChange={(v) => updateBrandField("email", v)} />
            <Field label="Main Domain" value={config.brand.domain} onChange={(v) => updateBrandField("domain", v)} />
          </div>
        </SectionCard>

        <SectionCard title={`Hero (${locale})`}>
          <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(v) => updateLocaleField("hero", (c) => ({ ...c, eyebrow: v }))} />
          <Field label="Title" value={content.hero.title} onChange={(v) => updateLocaleField("hero", (c) => ({ ...c, title: v }))} />
          <TextArea label="Subtitle" value={content.hero.subtitle} onChange={(v) => updateLocaleField("hero", (c) => ({ ...c, subtitle: v }))} />
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Primary CTA" value={content.hero.primaryCta} onChange={(v) => updateLocaleField("hero", (c) => ({ ...c, primaryCta: v }))} />
            <Field label="Secondary CTA" value={content.hero.secondaryCta} onChange={(v) => updateLocaleField("hero", (c) => ({ ...c, secondaryCta: v }))} />
          </div>
        </SectionCard>

        <SectionCard title={`Value Proposition Highlights (${locale})`}>
          {content.valueProp.highlights.map((item, index) => (
            <div key={`${item.metric}-${index}`} className="grid gap-3 md:grid-cols-2">
              <Field
                label={`Metric ${index + 1}`}
                value={item.metric}
                onChange={(v) =>
                  updateLocaleField("valueProp", (c) => ({
                    ...c,
                    highlights: c.highlights.map((h, i) => (i === index ? { ...h, metric: v } : h))
                  }))
                }
              />
              <Field
                label={`Description ${index + 1}`}
                value={item.description}
                onChange={(v) =>
                  updateLocaleField("valueProp", (c) => ({
                    ...c,
                    highlights: c.highlights.map((h, i) => (i === index ? { ...h, description: v } : h))
                  }))
                }
              />
            </div>
          ))}
          <Field
            label="Teams Label"
            value={content.valueProp.teamsLabel}
            onChange={(v) => updateLocaleField("valueProp", (c) => ({ ...c, teamsLabel: v }))}
          />
        </SectionCard>

        <SectionCard title={`Reviews (${locale})`}>
          {content.reviews.map((review, index) => (
            <div key={`${review.name}-${index}`} className="rounded-xl border border-border bg-slate-50 p-3">
              <div className="grid gap-3 md:grid-cols-3">
                <Field
                  label="Name"
                  value={review.name}
                  onChange={(v) =>
                    updateLocaleField("reviews", (c) => c.map((r, i) => (i === index ? { ...r, name: v } : r)))
                  }
                />
                <Field
                  label="Role"
                  value={review.role}
                  onChange={(v) =>
                    updateLocaleField("reviews", (c) => c.map((r, i) => (i === index ? { ...r, role: v } : r)))
                  }
                />
                <Field
                  label="Company"
                  value={review.company}
                  onChange={(v) =>
                    updateLocaleField("reviews", (c) => c.map((r, i) => (i === index ? { ...r, company: v } : r)))
                  }
                />
              </div>
              <div className="mt-3">
                <TextArea
                  label="Quote"
                  value={review.quote}
                  onChange={(v) =>
                    updateLocaleField("reviews", (c) => c.map((r, i) => (i === index ? { ...r, quote: v } : r)))
                  }
                />
              </div>
            </div>
          ))}
        </SectionCard>
      </div>

      {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
    </main>
  );
}
