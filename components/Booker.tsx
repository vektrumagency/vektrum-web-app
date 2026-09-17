"use client";

import { useEffect, useMemo, useReducer } from "react";

type Locale = "en" | "pt-PT" | "es";

const HORIZON_DAYS = 15;

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
    eyebrow: string;
    heading: string;
    subheading: string;
    confirmSubheading: string;
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
    eyebrow: "Marcar reunião",
    heading: "Marcar uma chamada",
    subheading: "Escolha um dia com disponibilidade e depois o horário.",
    confirmSubheading: "Confirme os seus dados para concluir a marcação.",
    loading: "A carregar disponibilidade...",
    empty: "Sem horários nos próximos 15 dias. Contacte-nos diretamente.",
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
    homeHref: "/en",
    eyebrow: "Book a meeting",
    heading: "Book a call",
    subheading: "Pick a day with availability, then a time.",
    confirmSubheading: "Confirm your details to finish booking.",
    loading: "Loading availability...",
    empty: "No times in the next 15 days. Please contact us directly.",
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
    homeHref: "/es",
    eyebrow: "Reservar reunión",
    heading: "Reservar una llamada",
    subheading: "Elige un día con disponibilidad y luego la hora.",
    confirmSubheading: "Confirma tus datos para completar la reserva.",
    loading: "Cargando disponibilidad...",
    empty: "No hay horarios en los próximos 15 días. Contáctanos directamente.",
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

async function fetchAvailability(): Promise<Slot[]> {
  const res = await fetch("/api/booking/availability");
  if (!res.ok) throw new Error(`availability ${res.status}`);
  const data: { slots?: Slot[] } = await res.json();
  return data.slots ?? [];
}

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
    fetchAvailability()
      .then((slots) => dispatch({ type: "FETCH_SUCCESS", slots }))
      .catch(() => dispatch({ type: "FETCH_ERROR" }));
  }

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });
    fetchAvailability()
      .then((slots) => {
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", slots });
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

  // Grid spanning only the current week through the week that contains
  // today + HORIZON_DAYS. Nothing beyond the 15-day horizon is rendered.
  const { grid, horizonKey, monthLabel } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const horizon = new Date(today);
    horizon.setDate(today.getDate() + HORIZON_DAYS);

    const start = new Date(today);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // back to Monday

    const end = new Date(horizon);
    end.setDate(end.getDate() + (6 - ((end.getDay() + 6) % 7))); // forward to Sunday

    const days: Date[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }

    // Month names are lowercase in pt-PT prose, but this is a UI label, so
    // capitalize both sides — "Setembro de 2026 – outubro de 2026" reads
    // lopsided. Within one year the year is stated once, at the end.
    const monthOnly = new Intl.DateTimeFormat(t.intl, { month: "long" });
    const monthYear = new Intl.DateTimeFormat(t.intl, { month: "long", year: "numeric" });
    const cap = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

    const lastLabel = cap(monthYear.format(horizon));
    const label =
      monthYear.format(today) === monthYear.format(horizon)
        ? lastLabel
        : today.getFullYear() === horizon.getFullYear()
          ? `${cap(monthOnly.format(today))} – ${lastLabel}`
          : `${cap(monthYear.format(today))} – ${lastLabel}`;

    return { grid: days, horizonKey: dayKey(horizon), monthLabel: label };
  }, [t.intl]);

  const weekdayHeaders = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(t.intl, { weekday: "short" });
    // Monday-first week
    const base = new Date(2026, 5, 1); // 2026-06-01 is a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return fmt.format(d).replace(/\.$/, "").slice(0, 3);
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
      <BookerShell eyebrow={t.eyebrow} title={t.heading} body={t.subheading}>
        <div className="mt-8 rounded-3xl border border-border bg-surface/85 p-6 shadow-glow md:p-8">
          <div className="mx-auto h-5 w-40 animate-pulse rounded bg-border/60" />
          <div className="mt-6 grid grid-cols-7 gap-1">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-border/40" />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-muted" aria-live="polite">
            {t.loading}
          </p>
        </div>
      </BookerShell>
    );
  }

  if (state.status === "error") {
    return (
      <BookerShell eyebrow={t.eyebrow} title={t.heading}>
        <div className="mt-8 rounded-3xl border border-border bg-surface/85 p-6 text-center shadow-glow md:p-8">
          <p className="text-base leading-relaxed text-muted">{t.error}</p>
          <button type="button" onClick={loadAvailability} className="diagnosis-primary mt-6">
            {t.retry}
          </button>
        </div>
      </BookerShell>
    );
  }

  if (state.status === "empty") {
    return (
      <BookerShell eyebrow={t.eyebrow} title={t.heading}>
        <div className="mt-8 rounded-3xl border border-border bg-surface/85 p-6 text-center shadow-glow md:p-8">
          <p className="text-base leading-relaxed text-muted">{t.empty}</p>
          <a href={t.homeHref} className="diagnosis-secondary mt-6">
            {t.backToSite}
          </a>
        </div>
      </BookerShell>
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

    return (
      <section className="diagnosis-enter flex w-full flex-col items-center text-center">
        <div className="diagnosis-success-mark mb-8" aria-hidden="true">
          <span>✓</span>
        </div>
        <h1 className="max-w-2xl text-balance text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-text">
          {t.successTitle}
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{t.successBody}</p>

        <dl className="mt-6 w-full rounded-2xl border border-accent/20 bg-accent/[0.06] px-5 py-4 text-sm">
          <dt className="text-xs font-bold uppercase tracking-[0.14em] text-accent">{t.detailsWith}</dt>
          <dd className="mt-1 font-semibold first-letter:uppercase text-text">{when}</dd>
          <dd className="text-muted">{t.duration}</dd>
        </dl>

        <p className="mt-8 text-sm font-semibold text-text">{t.addToCalendar}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <a href={googleUrl} target="_blank" rel="noreferrer" className="diagnosis-secondary">
            {t.google}
          </a>
          <a href={outlookUrl} target="_blank" rel="noreferrer" className="diagnosis-secondary">
            {t.outlook}
          </a>
          <a href={icsHref} download="vektrum.ics" className="diagnosis-secondary">
            {t.apple}
          </a>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          {meet ? (
            <a href={meet} target="_blank" rel="noreferrer" className="diagnosis-primary">
              {t.meetCta}
            </a>
          ) : null}
          <a href={t.homeHref} className={meet ? "text-sm font-semibold text-muted underline underline-offset-4 hover:text-text" : "diagnosis-primary"}>
            {t.backToSite}
          </a>
        </div>
      </section>
    );
  }

  const daySlots = state.selectedDay ? byDay.get(state.selectedDay) ?? [] : [];

  return (
    <BookerShell eyebrow={t.eyebrow} title={t.heading} body={state.selected ? t.confirmSubheading : t.subheading}>
      {state.status === "taken" ? (
        <div role="alert" className="diagnosis-insight mt-6">
          <span aria-hidden="true">!</span>
          <span>
            <strong className="font-bold">{t.takenTitle}.</strong> {t.takenBody}
          </span>
        </div>
      ) : null}

      <div className="mt-8 rounded-3xl border border-border bg-surface/85 p-6 shadow-glow md:p-8">
        {!state.selected ? (
          <div>
            <p className="mb-4 text-center text-sm font-semibold text-text">{monthLabel}</p>

            <div className="grid grid-cols-7 gap-1 text-center">
              {weekdayHeaders.map((w, i) => (
                <div key={i} className="pb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
                  {w}
                </div>
              ))}
              {grid.map((d) => {
                const k = dayKey(d);
                const isBeyond = k > horizonKey;
                const has = byDay.has(k) && !isBeyond;
                const isPast = k < todayKey;
                const isSelected = k === state.selectedDay;
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={!has}
                    aria-pressed={isSelected}
                    className={[
                      "relative flex aspect-square items-center justify-center rounded-xl text-sm transition duration-200",
                      has
                        ? "cursor-pointer border border-border bg-background/55 font-semibold text-text hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        : "cursor-default text-muted/40",
                      isSelected ? "border-accent bg-accent/[0.14] font-bold text-accent-soft ring-2 ring-accent/25" : "",
                      (isPast || isBeyond) && !has ? "opacity-40" : ""
                    ].join(" ")}
                    onClick={() => dispatch({ type: "SELECT_DAY", day: k })}
                  >
                    {d.getDate()}
                    {has ? (
                      <span
                        className={["absolute bottom-1 h-1.5 w-1.5 rounded-full", isSelected ? "bg-accent" : "bg-emerald-500"].join(" ")}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              {t.tzPrefix} {timeZone}
            </p>

            {state.selectedDay ? (
              <div className="mt-6 border-t border-border/70 pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.pickTime}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.startUTC}
                      type="button"
                      onClick={() => dispatch({ type: "SELECT_SLOT", slot })}
                      className="group diagnosis-choice diagnosis-choice-compact justify-center"
                    >
                      {new Date(slot.startUTC).toLocaleTimeString(t.intl, { hour: "2-digit", minute: "2-digit" })}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/20 bg-accent/[0.06] px-4 py-3">
              <span className="text-sm font-semibold first-letter:uppercase text-accent-soft">
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
                className="text-xs font-semibold text-accent underline underline-offset-2 hover:text-accent-soft"
              >
                {t.backToCalendar}
              </button>
            </div>

            <input type="text" name="_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-text">{t.nameLabel}</span>
              <input
                type="text"
                value={state.name}
                autoComplete="name"
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })}
                className="diagnosis-input"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-text">{t.emailLabel}</span>
              <input
                type="email"
                value={state.email}
                autoComplete="email"
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
                className="diagnosis-input"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-text">
                {t.noteLabel} <span className="font-normal text-muted">({t.noteHint})</span>
              </span>
              <textarea
                value={state.note}
                rows={3}
                onChange={(e) => dispatch({ type: "SET_FIELD", field: "note", value: e.target.value })}
                className="diagnosis-input"
              />
            </label>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row-reverse sm:justify-start">
              <button
                type="button"
                onClick={confirmBooking}
                disabled={state.status === "confirming" || !state.email}
                className="diagnosis-primary w-full sm:w-auto"
              >
                {t.confirmCta}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "CANCEL_SELECT" })}
                className="diagnosis-secondary w-full justify-center sm:w-auto"
              >
                {t.back}
              </button>
            </div>
          </div>
        )}
      </div>
    </BookerShell>
  );
}

function BookerShell({
  eyebrow,
  title,
  body,
  children
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="diagnosis-enter w-full">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-5 text-balance text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-text">
          {title}
        </h1>
        {body ? (
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{body}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
