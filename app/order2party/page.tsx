"use client";

import { FormEvent, useRef, useState } from "react";

type UploadResponse = {
  ok: boolean;
  message: string;
  requestId?: string;
};

export default function Order2PartyPage() {
  const [pin, setPin] = useState("");
  const [supplier, setSupplier] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<UploadResponse | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!pin.trim()) {
      setStatus({ ok: false, message: "Please enter your access PIN." });
      return;
    }

    if (!file) {
      setStatus({ ok: false, message: "Please choose an Excel file before uploading." });
      return;
    }

    const body = new FormData();
    body.set("pin", pin.trim());
    body.set("file", file, file.name);

    if (supplier.trim()) {
      body.set("supplier", supplier.trim());
    }

    setLoading(true);

    try {
      const response = await fetch("/api/order2party/upload", {
        method: "POST",
        body
      });

      const payload = (await response.json()) as UploadResponse;
      setStatus(payload);

      if (response.ok) {
        setFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    } catch {
      setStatus({ ok: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const statusTone = status?.ok
    ? "border-emerald-400/40 bg-emerald-50 text-emerald-800"
    : "border-rose-400/40 bg-rose-50 text-rose-700";

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_15%,rgba(34,211,238,0.25),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.23),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(14,165,233,0.14),transparent_40%),linear-gradient(to_bottom,#eaf5ff,#eef6ff_40%,#f7fbff)]" />
      <div className="pointer-events-none absolute -left-20 top-20 -z-10 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 -z-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

      <section className="relative mx-auto w-full max-w-2xl rounded-[30px] border border-cyan-200/60 bg-white/80 p-6 shadow-[0_30px_90px_-35px_rgba(14,116,144,0.7)] backdrop-blur-xl md:p-8">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-[30px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500" />

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700/80">Secure Intake Node</p>
            <h1 className="mt-2 font-heading text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
              Order2Party Upload Portal
            </h1>
            <p className="mt-2 max-w-lg text-sm text-slate-600">
              Drop your supplier spreadsheet and forward it directly to the orchestrator pipeline.
            </p>
          </div>
          <span className="rounded-full border border-cyan-300/70 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
            Managed by Order2Party agents
          </span>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Access PIN</span>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Supplier (optional)</span>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Example: Acme Foods"
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Excel File</span>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </label>

          {file ? (
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 px-4 py-2 text-xs text-cyan-800">
              Selected file: <span className="font-semibold">{file.name}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-20px_rgba(14,116,144,0.9)] transition hover:from-cyan-600 hover:via-sky-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>

        {status ? (
          <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${statusTone}`}>
            <p>
              {status.message}
              {status.requestId ? ` (request: ${status.requestId})` : ""}
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
