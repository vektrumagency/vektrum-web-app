"use client";

import { useEffect, useReducer } from "react";

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
      return { ...state, status: "taken", slots: action.slots, selected: null };
    case "CONFIRM_ERROR":
      return { ...state, status: "error" };
    default:
      return state;
  }
}

const COPY: Record<
  Locale,
  {
    heading: string;
    subheading: string;
    loading: string;
    empty: string;
    error: string;
    retry: string;
    nameLabel: string;
    emailLabel: string;
    noteLabel: string;
    noteHint: string;
    confirmCta: string;
    back: string;
    successTitle: string;
    successBody: string;
    meetCta: string;
    takenTitle: string;
    takenBody: string;
    footer: string;
    weekLabel: (offset: number) => string;
  }
> = {
  "pt-PT": {
    heading: "Marcar uma chamada",
    subheading: "Escolha um horário disponível na nossa agenda.",
    loading: "A carregar horários disponíveis...",
    empty: "Sem horários disponíveis de momento. Contacte-nos diretamente.",
    error: "Não foi possível carregar os horários. Tente novamente.",
    retry: "Tentar novamente",
    nameLabel: "Nome",
    emailLabel: "Email",
    noteLabel: "Nota",
    noteHint: "opcional",
    confirmCta: "Confirmar marcação",
    back: "Escolher outro horário",
    successTitle: "Marcação confirmada",
    successBody: "Enviámos um convite para o seu email.",
    meetCta: "Abrir Google Meet",
    takenTitle: "Esse horário já foi reservado",
    takenBody: "Escolha outro horário disponível abaixo.",
    footer: "(Hora de Lisboa)",
    weekLabel: (offset) => (offset === 0 ? "Esta semana" : offset === 1 ? "Próxima semana" : `Daqui a ${offset} semanas`)
  },
  en: {
    heading: "Book a call",
    subheading: "Pick an available time on our calendar.",
    loading: "Loading available times...",
    empty: "No available times right now. Please contact us directly.",
    error: "Could not load available times. Please try again.",
    retry: "Retry",
    nameLabel: "Name",
    emailLabel: "Email",
    noteLabel: "Note",
    noteHint: "optional",
    confirmCta: "Confirm booking",
    back: "Choose another time",
    successTitle: "Booking confirmed",
    successBody: "We sent an invite to your email.",
    meetCta: "Open Google Meet",
    takenTitle: "That time was just taken",
    takenBody: "Please choose another available time below.",
    footer: "(Lisbon time)",
    weekLabel: (offset) => (offset === 0 ? "This week" : offset === 1 ? "Next week" : `In ${offset} weeks`)
  },
  es: {
    heading: "Reservar una llamada",
    subheading: "Elige un horario disponible en nuestra agenda.",
    loading: "Cargando horarios disponibles...",
    empty: "No hay horarios disponibles ahora mismo. Contáctanos directamente.",
    error: "No se pudieron cargar los horarios. Inténtalo de nuevo.",
    retry: "Reintentar",
    nameLabel: "Nombre",
    emailLabel: "Email",
    noteLabel: "Nota",
    noteHint: "opcional",
    confirmCta: "Confirmar reserva",
    back: "Elegir otro horario",
    successTitle: "Reserva confirmada",
    successBody: "Te hemos enviado una invitación por email.",
    meetCta: "Abrir Google Meet",
    takenTitle: "Ese horario acaba de ser reservado",
    takenBody: "Elige otro horario disponible a continuación.",
    footer: "(Hora de Lisboa)",
    weekLabel: (offset) => (offset === 0 ? "Esta semana" : offset === 1 ? "Próxima semana" : `Dentro de ${offset} semanas`)
  }
};

function groupByWeek(slots: Slot[]): Map<number, Slot[]> {
  const map = new Map<number, Slot[]>();
  for (const slot of slots) {
    const bucket = map.get(slot.weekOffset) ?? [];
    bucket.push(slot);
    map.set(slot.weekOffset, bucket);
  }
  return map;
}

export function Booker({ name = "", email = "", locale = "pt-PT" }: BookerProps) {
  const t = COPY[locale];
  const [state, dispatch] = useReducer(reducer, {
    status: "loading",
    slots: [],
    selected: null,
    name,
    email,
    note: "",
    meetLink: null
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });
    fetch("/api/booking/availability")
      .then((res) => res.json())
      .then((data: { slots?: Slot[] }) => {
        if (cancelled) return;
        dispatch({ type: "FETCH_SUCCESS", slots: data.slots ?? [] });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "FETCH_ERROR" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
    return <p className="text-sm text-muted">{t.loading}</p>;
  }

  if (state.status === "error") {
    return (
      <div className="rounded-2xl border border-border bg-surface/85 p-6">
        <p className="text-sm text-muted">{t.error}</p>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "FETCH_START" });
            fetch("/api/booking/availability")
              .then((res) => res.json())
              .then((data: { slots?: Slot[] }) => dispatch({ type: "FETCH_SUCCESS", slots: data.slots ?? [] }))
              .catch(() => dispatch({ type: "FETCH_ERROR" }));
          }}
          className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:w-auto"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  if (state.status === "empty") {
    return (
      <div className="rounded-2xl border border-border bg-surface/85 p-6">
        <p className="text-sm text-muted">{t.empty}</p>
      </div>
    );
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent/10 p-6">
        <p className="text-base font-semibold text-text">{t.successTitle}</p>
        <p className="mt-2 text-sm text-muted">{t.successBody}</p>
        {state.meetLink ? (
          <a
            href={state.meetLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:w-auto"
          >
            {t.meetCta}
          </a>
        ) : null}
      </div>
    );
  }

  const grouped = groupByWeek(state.slots);
  const weekOffsets = Array.from(grouped.keys()).sort((a, b) => a - b);

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
        <div className="mt-6 space-y-6">
          {weekOffsets.map((offset) => (
            <div key={offset}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{t.weekLabel(offset)}</p>
              <div className="grid gap-2">
                {(grouped.get(offset) ?? []).map((slot) => (
                  <button
                    key={slot.startUTC}
                    type="button"
                    onClick={() => dispatch({ type: "SELECT_SLOT", slot })}
                    className="w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-left text-sm font-medium text-text transition hover:border-accent/40 hover:bg-accent/10"
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm font-semibold text-text">
            {state.selected.label}
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

      <p className="mt-6 text-xs text-muted">{t.footer}</p>
    </div>
  );
}
