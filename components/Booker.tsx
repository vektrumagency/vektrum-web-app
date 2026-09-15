"use client";

import { useEffect, useMemo, useReducer } from "react";

type Locale = "en" | "pt-PT" | "es";

type Slot = {
  startUTC: string;
  endUTC: string;
  label: string;
  weekOffset: number;
};

type BookerProps = {
  name?: string;
  email?: string;
  locale?: Locale;
};

type Status = "loading" | "list" | "empty" | "confirming" | "success" | "taken" | "error";

type State = {
  status: Status;
  slots: Slot[];
  selectedDay: string | null;
  selected: Slot | null;
  name: string;
  email: string;
  note: string;
  meetLink: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; slots: Slot[] }
  | { type: "FETCH_ERROR" }
  | { type: "SELECT_DAY"; day: string }
  | { type: "SELECT_SLOT"; slot: Slot }
  | { type: "CANCEL_SELECT" }
  | { type: "SET_FIELD"; field: "name" | "email" | "note"; value: string }
  | { type: "CONFIRM_START" }
  | { type: "CONFIRM_SUCCESS"; meetLink: string | null }
  | { type: "CONFIRM_TAKEN"; slots: Slot[] }
  | { type: "CONFIRM_ERROR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, status: "loading" };
    case "FETCH_SUCCESS":
      return { ...state, status: action.slots.length ? "list" : "empty", slots: action.slots };
    case "FETCH_ERROR":
      return { ...state, status: "error" };
    case "SELECT_DAY":
      return { ...state, selectedDay: action.day, selected: null };
    case "SELECT_SLOT":
      return { ...state, selected: action.slot };
    case "CANCEL_SELECT":
      return { ...state, selected: null };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "CONFIRM_START":
      return { ...state, status: "confirming" };
    case "CONFIRM_SUCCESS":
      return { ...state, status: "success", meetLink: action.meetLink };
    case "CONFIRM_TAKEN":
      return { ...state, status: "taken", slots: action.slots, selected: null, selectedDay: null };
    case "CONFIRM_ERROR":
      return { ...state, status: "error" };
    default:
      return state;
  }
}

const COPY: Record<
  Locale,
  {
    tag: string;
    intl: string;
    homeHref: string;
    heading: string;
    subheading: string;
    loading: string;
    empty: string;
    error: string;
    retry: string;
    pickTime: string;
    nameLabel: string;
    emailLabel: string;
    noteLabel: string;
    noteHint: string;
    confirmCta: string;
    back: string;
    backToCalendar: string;
    successTitle: string;
    successBody: string;
    detailsWith: string;
    duration: string;
    addToCalendar: string;
    google: string;
    outlook: string;
    apple: string;
    meetCta: string;
    backToSite: string;
    takenTitle: string;
    takenBody: string;
    tzPrefix: string;
  }
> = {
  "pt-PT": {
    tag: "pt-PT",
    intl: "pt-PT",
    homeHref: "/",
    heading: "Marcar uma chamada",
    subheading: "Escolha um dia com disponibilidade e depois o horário.",
    loading: "A carregar disponibilidade...",
    empty: "Sem horários nos próximos 30 dias. Contacte-nos diretamente.",
    error: "Não foi possível carregar os horários. Tente novamente.",
    retry: "Tentar novamente",
    pickTime: "Horários disponíveis",
    nameLabel: "Nome",
    emailLabel: "Email",
    noteLabel: "Nota",
    noteHint: "opcional",
    confirmCta: "Confirmar marcação",
    back: "Escolher outro horário",
    backToCalendar: "Voltar ao calendário",
    successTitle: "Marcação confirmada",
    successBody: "Enviámos um convite para o seu email.",
    detailsWith: "Reunião com a Vektrum",
    duration: "30 minutos",
    addToCalendar: "Adicionar ao calendário",
    google: "Google",
    outlook: "Outlook",
    apple: "Apple / .ics",
    meetCta: "Abrir Google Meet",
    backToSite: "Voltar ao site",
    takenTitle: "Esse horário já foi reservado",
    takenBody: "Escolha outro horário disponível.",
    tzPrefix: "Horários no seu fuso:"
  },
  en: {
    tag: "en",
    intl: "en-GB",
    homeHref: "/?lang=en",
    heading: "Book a call",
    subheading: "Pick a day with availability, then a time.",
    loading: "Loading availability...",
    empty: "No times in the next 30 days. Please contact us directly.",
    error: "Could not load available times. Please try again.",
    retry: "Retry",
    pickTime: "Available times",
    nameLabel: "Name",
    emailLabel: "Email",
    noteLabel: "Note",
    noteHint: "optional",
    confirmCta: "Confirm booking",
    back: "Choose another time",
    backToCalendar: "Back to calendar",
    successTitle: "Booking confirmed",
    successBody: "We sent an invite to your email.",
    detailsWith: "Meeting with Vektrum",
    duration: "30 minutes",
    addToCalendar: "Add to calendar",
    google: "Google",
    outlook: "Outlook",
    apple: "Apple / .ics",
    meetCta: "Open Google Meet",
    backToSite: "Back to site",
    takenTitle: "That time was just taken",
    takenBody: "Please choose another available time.",
    tzPrefix: "Times in your timezone:"
  },
  es: {
    tag: "es",
    intl: "es-ES",
    homeHref: "/?lang=es",
    heading: "Reservar una llamada",
    subheading: "Elige un día con disponibilidad y luego la hora.",
    loading: "Cargando disponibilidad...",
    empty: "No hay horarios en los próximos 30 días. Contáctanos directamente.",
    error: "No se pudieron cargar los horarios. Inténtalo de nuevo.",
    retry: "Reintentar",
    pickTime: "Horarios disponibles",
    nameLabel: "Nombre",
    emailLabel: "Email",
    noteLabel: "Nota",
    noteHint: "opcional",
    confirmCta: "Confirmar reserva",
    back: "Elegir otro horario",
    backToCalendar: "Volver al calendario",
    successTitle: "Reserva confirmada",
    successBody: "Te hemos enviado una invitación por email.",
    detailsWith: "Reunión con Vektrum",
    duration: "30 minutos",
    addToCalendar: "Añadir al calendario",
    google: "Google",
    outlook: "Outlook",
    apple: "Apple / .ics",
    meetCta: "Abrir Google Meet",
    backToSite: "Volver al sitio",
    takenTitle: "Ese horario acaba de ser reservado",
    takenBody: "Elige otro horario disponible.",
    tzPrefix: "Horarios en tu zona horaria:"
  }
};

// YYYY-MM-DD in the visitor's local timezone.
function dayKey(d: Date): string {
  return d.toLocaleDateString("en-CA");
}

// Compact UTC timestamp for calendar links / .ics: YYYYMMDDTHHMMSSZ
function stampUTC(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildIcs(startUTC: string, endUTC: string, summary: string, description: string, location: string): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vektrum//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${stampUTC(startUTC)}-vektrum@vektrum.agency`,
    `DTSTAMP:${stampUTC(new Date().toISOString())}`,
    `DTSTART:${stampUTC(startUTC)}`,
    `DTEND:${stampUTC(endUTC)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

export function Booker({ name = "", email = "", locale = "pt-PT" }: BookerProps) {
  const t = COPY[locale];
  const [state, dispatch] = useReducer(reducer, {
    status: "loading",
    slots: [],
    selectedDay: null,
    selected: null,
    name,
    email,
    note: "",
    meetLink: null
  });

  const timeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "Europe/Lisbon";
    }
  }, []);

  function loadAvailability() {
    dispatch({ type: "FETCH_START" });
    fetch("/api/booking/availability")
      .then((res) => res.json())
      .then((data: { slots?: Slot[] }) => dispatch({ type: "FETCH_SUCCESS", slots: data.slots ?? [] }))
      .catch(() => dispatch({ type: "FETCH_ERROR" }));
  }

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });
    fetch("/api/booking/availability")
      .then((res) => res.json())
      .then((data: { slots?: Slot[] }) => {
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", slots: data.slots ?? [] });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "FETCH_ERROR" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Slots grouped by local day.
  const byDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of state.slots) {
      const k = dayKey(new Date(slot.startUTC));
      const bucket = map.get(k) ?? [];
      bucket.push(slot);
      map.set(k, bucket);
    }
    for (const bucket of map.values()) bucket.sort((a, b) => a.startUTC.localeCompare(b.startUTC));
    return map;
  }, [state.slots]);

  // 6-week grid starting on the Monday of the current week.
  const grid = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dow = (start.getDay() + 6) % 7; // Mon = 0
    start.setDate(start.getDate() - dow);
    const days: Date[] = [];
    for (let i = 0; i < 42; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const weekdayHeaders = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(t.intl, { weekday: "short" });
    // Monday-first week
    const base = new Date(2026, 5, 1); // 2026-06-01 is a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return fmt.format(d);
    });
  }, [t.intl]);

  const todayKey = dayKey(new Date());

  async function confirmBooking() {
    if (!state.selected) return;
    dispatch({ type: "CONFIRM_START" });
    try {
      const res = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          note: state.note,
          startUTC: state.selected.startUTC,
          _hp: ""
        })
      });
      const data = await res.json();
      if (res.status === 409 || data.status === "taken") {
        dispatch({ type: "CONFIRM_TAKEN", slots: data.slots ?? [] });
        return;
      }
      if (!res.ok || data.status !== "confirmed") {
        dispatch({ type: "CONFIRM_ERROR" });
        return;
      }
      dispatch({ type: "CONFIRM_SUCCESS", meetLink: data.meetLink ?? null });
    } catch {
      dispatch({ type: "CONFIRM_ERROR" });
    }
  }

  if (state.status === "loading") {
    return (
      <div className="rounded-3xl border border-border bg-surface/85 p-6 md:p-8">
        <div className="h-6 w-40 animate-pulse rounded bg-border/60" />
        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-border/40" />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">{t.loading}</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-3xl border border-border bg-surface/85 p-6">
        <p className="text-sm text-muted">{t.error}</p>
        <button
          type="button"
          onClick={loadAvailability}
          className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:w-auto"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  if (state.status === "empty") {
    return (
      <div className="rounded-3xl border border-border bg-surface/85 p-6">
        <p className="text-sm text-muted">{t.empty}</p>
        <a href={t.homeHref} className="mt-4 inline-flex text-sm font-semibold text-accent underline underline-offset-4">
          {t.backToSite}
        </a>
      </div>
    );
  }

  if (state.status === "success" && state.selected) {
    const start = state.selected.startUTC;
    const end = state.selected.endUTC;
    const summary = t.detailsWith;
    const meet = state.meetLink ?? "";
    const details = meet ? `Google Meet: ${meet}` : summary;
    const when = new Date(start).toLocaleString(t.intl, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    });
    const gStart = stampUTC(start);
    const gEnd = stampUTC(end);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(summary)}&dates=${gStart}/${gEnd}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(meet)}`;
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(summary)}&startdt=${encodeURIComponent(start)}&enddt=${encodeURIComponent(end)}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(meet)}`;
    const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(start, end, summary, details, meet))}`;
    const calBtn =
      "inline-flex items-center justify-center rounded-full border border-border bg-background/55 px-4 py-2.5 text-sm font-semibold text-text transition hover:border-accent/50 hover:bg-accent/10";

    return (
      <div className="rounded-3xl border border-accent/20 bg-surface/85 p-6 shadow-glow md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">✓</p>
        <h3 className="mt-2 font-heading text-2xl uppercase tracking-tight text-text">{t.successTitle}</h3>
        <p className="mt-2 text-sm text-muted">{t.successBody}</p>

        <dl className="mt-5 space-y-1 rounded-2xl border border-border bg-background/55 p-4 text-sm">
          <div className="font-semibold text-text">{when}</div>
          <div className="text-muted">
            {t.detailsWith} · {t.duration}
          </div>
        </dl>

        <p className="mt-5 mb-2 text-sm font-semibold text-text">{t.addToCalendar}</p>
        <div className="flex flex-wrap gap-2">
          <a href={googleUrl} target="_blank" rel="noreferrer" className={calBtn}>
            {t.google}
          </a>
          <a href={outlookUrl} target="_blank" rel="noreferrer" className={calBtn}>
            {t.outlook}
          </a>
          <a href={icsHref} download="vektrum.ics" className={calBtn}>
            {t.apple}
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {meet ? (
            <a
              href={meet}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-accent underline underline-offset-4"
            >
              {t.meetCta}
            </a>
          ) : null}
          <a
            href={t.homeHref}
            className="ml-auto inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft"
          >
            {t.backToSite}
          </a>
        </div>
      </div>
    );
  }

  const daySlots = state.selectedDay ? byDay.get(state.selectedDay) ?? [] : [];

  return (
    <div className="rounded-3xl border border-border bg-surface/85 p-6 shadow-glow md:p-8">
      <h3 className="font-heading text-2xl uppercase tracking-tight text-text">{t.heading}</h3>
      <p className="mt-2 text-sm text-muted">{t.subheading}</p>

      {state.status === "taken" ? (
        <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 p-4">
          <p className="text-sm font-semibold text-text">{t.takenTitle}</p>
          <p className="mt-1 text-sm text-muted">{t.takenBody}</p>
        </div>
      ) : null}

      {!state.selected ? (
        <div className="mt-6">
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdayHeaders.map((w, i) => (
              <div key={i} className="pb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                {w}
              </div>
            ))}
            {grid.map((d) => {
              const k = dayKey(d);
              const has = byDay.has(k);
              const isPast = k < todayKey;
              const isSelected = k === state.selectedDay;
              return (
                <button
                  key={k}
                  type="button"
                  disabled={!has}
                  aria-pressed={isSelected}
                  onClick={() => dispatch({ type: "SELECT_DAY", day: k })}
                  className={[
                    "relative flex aspect-square items-center justify-center rounded-xl text-sm transition",
                    has
                      ? "cursor-pointer font-semibold text-text hover:border-accent/50 hover:bg-accent/10 border border-border"
                      : "cursor-default text-muted/40",
                    isSelected ? "border-accent bg-accent/15 text-text" : "",
                    isPast && !has ? "opacity-40" : ""
                  ].join(" ")}
                >
                  {d.getDate()}
                  {has ? (
                    <span
                      className={[
                        "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-accent" : "bg-emerald-500"
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-muted">
            {t.tzPrefix} {timeZone}
          </p>

          {/* Times for the selected day */}
          {state.selectedDay ? (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{t.pickTime}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {daySlots.map((slot) => (
                  <button
                    key={slot.startUTC}
                    type="button"
                    onClick={() => dispatch({ type: "SELECT_SLOT", slot })}
                    className="rounded-xl border border-border bg-background/55 px-3 py-3 text-sm font-semibold text-text transition hover:border-accent/50 hover:bg-accent/10"
                  >
                    {new Date(slot.startUTC).toLocaleTimeString(t.intl, { hour: "2-digit", minute: "2-digit" })}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-accent/20 bg-accent/10 p-4">
            <span className="text-sm font-semibold text-text">
              {new Date(state.selected.startUTC).toLocaleString(t.intl, {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: "CANCEL_SELECT" })}
              className="text-xs font-semibold text-accent underline underline-offset-2"
            >
              {t.backToCalendar}
            </button>
          </div>

          <input type="text" name="_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-text">{t.nameLabel}</span>
            <input
              type="text"
              value={state.name}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
              className="w-full rounded-xl border border-border bg-background/55 px-4 py-2.5 text-sm text-text outline-none focus:border-accent/50"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-text">{t.emailLabel}</span>
            <input
              type="email"
              value={state.email}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
              className="w-full rounded-xl border border-border bg-background/55 px-4 py-2.5 text-sm text-text outline-none focus:border-accent/50"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-text">
              {t.noteLabel} <span className="text-muted">({t.noteHint})</span>
            </span>
            <textarea
              value={state.note}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "note", value: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-border bg-background/55 px-4 py-2.5 text-sm text-text outline-none focus:border-accent/50"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={confirmBooking}
              disabled={state.status === "confirming" || !state.email}
              className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft disabled:opacity-60 sm:w-auto"
            >
              {t.confirmCta}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "CANCEL_SELECT" })}
              className="w-full rounded-full border border-border px-6 py-3 text-sm font-semibold text-text transition hover:border-accent/40 sm:w-auto"
            >
              {t.back}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
