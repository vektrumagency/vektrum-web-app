"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CategoryChangeStatus,
  CategoryReviewAction,
  CategoryReviewNode,
  CategoryReviewProposal,
  LocalReviewStateV1,
  ReviewOverride,
  ReviewStatus,
  SavedDecision,
  SavedDecisionReviewStatus,
  SavedReviewOverlay
} from "./types";

const STORAGE_KEY = "ordertoparty-category-review-v1";
const REVIEW_API_PATH = "/api/order2party/categories/review";

type TabKey = "simple" | "tree" | "list" | "export";

type Selection =
  | { kind: "none" }
  | { kind: "node"; nodeId: string }
  | { kind: "action"; actionId: string };

type Counts = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  needs_changes: number;
  keep: number;
  create: number;
  rename: number;
  move: number;
  merge: number;
  split: number;
  delete_or_hide_candidate: number;
  needs_human_review: number;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

function safeJsonParse(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isReviewStatus(value: unknown): value is ReviewStatus {
  return value === "pending" || value === "approved" || value === "rejected" || value === "needs_changes";
}

function isSavedDecisionStatus(value: unknown): value is SavedDecisionReviewStatus {
  return value === "approved" || value === "rejected" || value === "needs_changes";
}

function loadLocalState(): LocalReviewStateV1 {
  const raw = safeJsonParse(typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY));
  if (!raw || !isRecord(raw)) return { overrides: {} };

  // Accept a couple of shapes to avoid breaking earlier drafts.
  const overridesCandidate =
    (isRecord(raw.overrides) && raw.overrides) ||
    (isRecord(raw.actions) && raw.actions) ||
    (isRecord(raw.state) && isRecord((raw.state as Record<string, unknown>).overrides) &&
      ((raw.state as Record<string, unknown>).overrides as Record<string, unknown>)) ||
    null;

  if (!overridesCandidate) return { overrides: {} };

  const overrides: Record<string, ReviewOverride> = {};
  for (const [actionId, overrideUnknown] of Object.entries(overridesCandidate)) {
    if (!isRecord(overrideUnknown)) continue;
    if (!isReviewStatus(overrideUnknown.review_status)) continue;

    overrides[actionId] = {
      review_status: overrideUnknown.review_status,
      review_comment: typeof overrideUnknown.review_comment === "string" ? overrideUnknown.review_comment : null,
      reviewed_by: typeof overrideUnknown.reviewed_by === "string" ? overrideUnknown.reviewed_by : null,
      reviewed_at: typeof overrideUnknown.reviewed_at === "string" ? overrideUnknown.reviewed_at : null
    };
  }

  return { overrides };
}

function saveLocalState(state: LocalReviewStateV1) {
  const payload: LocalReviewStateV1 = {
    overrides: state.overrides
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function saveDecisionToLocalCache(decision: SavedDecision) {
  const local = loadLocalState();
  local.overrides[decision.action_id] = {
    review_status: decision.review_status,
    review_comment: decision.review_comment ?? null,
    reviewed_by: decision.reviewed_by ?? null,
    reviewed_at: decision.reviewed_at
  };
  saveLocalState(local);
}

function removeDecisionFromLocalCache(actionId: string) {
  const local = loadLocalState();
  delete local.overrides[actionId];
  saveLocalState(local);
}

function parseSavedOverlay(value: unknown): SavedReviewOverlay {
  const empty: SavedReviewOverlay = {
    review_id: "order2party-category-review-v1",
    project: "Order2Party",
    proposal_version: "v1",
    updated_at: null,
    decisions: {}
  };

  if (!isRecord(value) || !isRecord(value.decisions)) return empty;

  const decisions: Record<string, SavedDecision> = {};
  for (const [actionId, decisionUnknown] of Object.entries(value.decisions)) {
    if (!isRecord(decisionUnknown)) continue;
    if (typeof decisionUnknown.action_id !== "string" || !decisionUnknown.action_id.trim()) continue;
    if (typeof decisionUnknown.node_id !== "string" || !decisionUnknown.node_id.trim()) continue;
    if (!isSavedDecisionStatus(decisionUnknown.review_status)) continue;
    if (typeof decisionUnknown.reviewed_at !== "string" || !decisionUnknown.reviewed_at.trim()) continue;

    decisions[actionId] = {
      action_id: decisionUnknown.action_id,
      node_id: decisionUnknown.node_id,
      review_status: decisionUnknown.review_status,
      review_comment: typeof decisionUnknown.review_comment === "string" ? decisionUnknown.review_comment : null,
      reviewed_by: typeof decisionUnknown.reviewed_by === "string" ? decisionUnknown.reviewed_by : null,
      reviewed_at: decisionUnknown.reviewed_at
    };
  }

  return {
    review_id: "order2party-category-review-v1",
    project: "Order2Party",
    proposal_version: "v1",
    updated_at: typeof value.updated_at === "string" ? value.updated_at : null,
    decisions
  };
}

function applySavedOverlay(
  actions: CategoryReviewAction[],
  overlay: SavedReviewOverlay
): CategoryReviewAction[] {
  return actions.map((action) => {
    if (!isReviewableAction(action)) return action;
    const decision = overlay.decisions[action.action_id];
    if (!decision) return action;

    return {
      ...action,
      review_status: decision.review_status,
      review_comment: decision.review_comment ?? null,
      reviewed_by: decision.reviewed_by ?? null,
      reviewed_at: decision.reviewed_at
    };
  });
}

async function fetchSavedOverlay(): Promise<SavedReviewOverlay> {
  const response = await fetch(REVIEW_API_PATH, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load saved overlay.");
  return parseSavedOverlay(await response.json());
}

async function postSavedDecision(input: {
  action_id: string;
  node_id: string;
  review_status: SavedDecisionReviewStatus;
  review_comment?: string | null;
  reviewed_by?: string | null;
}): Promise<SavedDecision> {
  const response = await fetch(REVIEW_API_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) throw new Error("Could not save decision.");
  const payload = await response.json();
  if (!isRecord(payload) || !isRecord(payload.decision)) throw new Error("Invalid save response.");
  const decision = parseSavedOverlay({
    decisions: {
      [input.action_id]: payload.decision
    }
  }).decisions[input.action_id];
  if (!decision) throw new Error("Invalid saved decision.");
  return decision;
}

async function deleteSavedDecision(actionId: string) {
  const response = await fetch(`${REVIEW_API_PATH}?action_id=${encodeURIComponent(actionId)}`, {
    method: "DELETE"
  });

  if (!response.ok) throw new Error("Could not delete decision.");
}

function formatGeneratedAt(value: string | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  try {
    return new Intl.DateTimeFormat("pt-PT", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

function normalizeTreeForHumanReview(node: CategoryReviewNode): CategoryReviewNode {
  return {
    ...node,
    source_review_status: node.review_status,
    children: Array.isArray(node.children) ? node.children.map(normalizeTreeForHumanReview) : undefined
  };
}

function normalizeActionForHumanReview(action: CategoryReviewAction): CategoryReviewAction {
  const reviewable = isReviewableAction(action);

  return {
    ...action,
    source_review_status: action.review_status,
    review_status: reviewable ? "pending" : action.review_status,
    review_comment: reviewable ? null : action.review_comment ?? null,
    reviewed_by: reviewable ? null : action.reviewed_by ?? null,
    reviewed_at: reviewable ? null : action.reviewed_at ?? null
  };
}

function isReviewableAction(action: CategoryReviewAction) {
  return action.action !== "keep" || action.needs_human_review === true;
}

function isInformationalKeepAction(action: CategoryReviewAction) {
  return action.action === "keep" && action.needs_human_review !== true;
}

function actionPriorityForQueue(action: CategoryReviewAction) {
  // Lower number = earlier in queue.
  if (action.review_status !== "pending") return 100;
  if (action.needs_human_review === true) return 0;
  if (action.action !== "keep") return 1;
  return 2;
}

function getPathList(item: {
  current_path?: string | null;
  current_paths?: string[] | null;
  proposed_path?: string | null;
  proposed_paths?: string[] | null;
}) {
  const current = Array.isArray(item.current_paths)
    ? item.current_paths
    : typeof item.current_path === "string" && item.current_path
      ? [item.current_path]
      : [];

  const proposed = Array.isArray(item.proposed_paths)
    ? item.proposed_paths
    : typeof item.proposed_path === "string" && item.proposed_path
      ? [item.proposed_path]
      : [];

  return { current, proposed };
}

function flattenTree(root: CategoryReviewNode) {
  const byId = new Map<string, CategoryReviewNode>();
  const ordered: CategoryReviewNode[] = [];

  const stack: CategoryReviewNode[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    byId.set(node.node_id, node);
    ordered.push(node);
    const children = Array.isArray(node.children) ? node.children : [];
    for (let index = children.length - 1; index >= 0; index -= 1) {
      stack.push(children[index]);
    }
  }

  return { byId, ordered };
}

function classNames(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

function changeTypeLabel(status: CategoryChangeStatus) {
  switch (status) {
    case "keep":
      return "Manter categoria";
    case "create":
      return "Nova categoria";
    case "rename":
      return "Renomear categoria";
    case "move":
      return "Mover categoria";
    case "merge":
      return "Fundir categorias";
    case "split":
      return "Dividir categoria";
    case "delete_or_hide_candidate":
      return "Candidata a esconder/remover";
    case "needs_human_review":
      return "Precisa de revisão";
    case "root":
      return "Raiz";
    default:
      return status;
  }
}

function isEditableTarget(target: EventTarget | null) {
  if (!target) return false;
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  return target.isContentEditable;
}

function reviewStatusLabel(status: ReviewStatus) {
  switch (status) {
    case "pending":
      return "Pendente";
    case "approved":
      return "Aprovado";
    case "rejected":
      return "Rejeitado";
    case "needs_changes":
      return "Precisa de alterações";
    default:
      return status;
  }
}

function decisionScopeLabel(action: CategoryReviewAction) {
  return isReviewableAction(action) ? "Para decisão" : "Mantida na proposta";
}

function decisionScopeTone(action: CategoryReviewAction) {
  return isReviewableAction(action)
    ? "border-blue-200 bg-blue-50 text-blue-900"
    : "border-border bg-slate-50 text-muted";
}

function badgeToneForChange(status: CategoryChangeStatus) {
  switch (status) {
    case "create":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "rename":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "move":
      return "border-sky-200 bg-sky-50 text-sky-900";
    case "merge":
      return "border-purple-200 bg-purple-50 text-purple-900";
    case "split":
      return "border-indigo-200 bg-indigo-50 text-indigo-900";
    case "delete_or_hide_candidate":
      return "border-rose-200 bg-rose-50 text-rose-800";
    case "needs_human_review":
      return "border-yellow-200 bg-yellow-50 text-yellow-900";
    case "keep":
    case "root":
    default:
      return "border-border bg-background/60 text-muted";
  }
}

function badgeToneForReview(status: ReviewStatus) {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-800";
    case "needs_changes":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "pending":
    default:
      return "border-border bg-background/60 text-muted";
  }
}

function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        tone
      )}
    >
      {label}
    </span>
  );
}

function SectionCard({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-text">{title}</h2>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ToggleButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "rounded-full px-3 py-1.5 text-xs transition",
        active ? "bg-text text-white" : "border border-border bg-white text-muted hover:text-text"
      )}
    >
      {children}
    </button>
  );
}

function TreeNodeRow({
  node,
  level,
  expanded,
  onToggle,
  onSelect,
  selected,
  effectiveReviewStatus,
  linkedAction
}: {
  node: CategoryReviewNode;
  level: number;
  expanded: boolean;
  onToggle: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
  selected: boolean;
  effectiveReviewStatus: ReviewStatus;
  linkedAction?: CategoryReviewAction | null;
}) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const informationalKeep = linkedAction ? isInformationalKeepAction(linkedAction) : false;

  return (
    <div
      className={classNames(
        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
        selected ? "border-accent/50 bg-accent/5" : informationalKeep ? "border-border bg-slate-50/70" : "border-border bg-white",
        !informationalKeep && effectiveReviewStatus === "approved" ? "ring-1 ring-emerald-200/60" : "",
        !informationalKeep && effectiveReviewStatus === "rejected" ? "ring-1 ring-rose-200/60" : "",
        !informationalKeep && effectiveReviewStatus === "needs_changes" ? "ring-1 ring-amber-200/60" : ""
      )}
      style={{ paddingLeft: 12 + level * 14 }}
    >
      <button
        type="button"
        onClick={() => (hasChildren ? onToggle(node.node_id) : onSelect(node.node_id))}
        className={classNames(
          "flex items-center gap-2 text-left",
          hasChildren ? "" : "cursor-pointer"
        )}
        aria-label={hasChildren ? (expanded ? "Colapsar" : "Expandir") : "Selecionar"}
      >
        {hasChildren ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-background/60 text-xs text-muted">
            {expanded ? "−" : "+"}
          </span>
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-background/30 text-xs text-muted">
            •
          </span>
        )}
        <span className="font-medium text-text">{node.name}</span>
      </button>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Badge label={changeTypeLabel(node.status)} tone={badgeToneForChange(node.status)} />
        {linkedAction ? <Badge label={decisionScopeLabel(linkedAction)} tone={decisionScopeTone(linkedAction)} /> : null}
        {informationalKeep ? (
          <Badge label="Sem decisão necessária" tone="border-border bg-white text-muted" />
        ) : (
          <Badge label={reviewStatusLabel(effectiveReviewStatus)} tone={badgeToneForReview(effectiveReviewStatus)} />
        )}
      </div>
    </div>
  );
}

function buildCounts(actions: CategoryReviewAction[]): Counts {
  const initial: Counts = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    needs_changes: 0,
    keep: 0,
    create: 0,
    rename: 0,
    move: 0,
    merge: 0,
    split: 0,
    delete_or_hide_candidate: 0,
    needs_human_review: 0
  };

  for (const action of actions) {
    initial.total += 1;
    initial[action.review_status] += 1;

    if (action.action in initial) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (initial as any)[action.action] += 1;
    }

    if (action.needs_human_review) {
      initial.needs_human_review += 1;
    }
  }

  return initial;
}

function isReviewedStatus(status: ReviewStatus) {
  return status === "approved" || status === "rejected" || status === "needs_changes";
}

function exportPayload(proposal: CategoryReviewProposal, actions: CategoryReviewAction[]) {
  function withoutSourceFields(action: CategoryReviewAction): CategoryReviewAction {
    // Keep export strictly focused on human-review state; avoid leaking proposal defaults.
    // (We keep the same structural shape, but omit source_review_status.)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { source_review_status, ...rest } = action;
    return rest;
  }

  const reviewableActions = actions.filter(isReviewableAction);
  const informationalKeepActions = actions.filter(isInformationalKeepAction);

  const approved_actions: CategoryReviewAction[] = [];
  const rejected_actions: CategoryReviewAction[] = [];
  const needs_changes_actions: CategoryReviewAction[] = [];
  const pending_actions: CategoryReviewAction[] = [];

  for (const action of reviewableActions) {
    const exportable = withoutSourceFields(action);
    if (action.review_status === "approved") approved_actions.push(exportable);
    else if (action.review_status === "rejected") rejected_actions.push(exportable);
    else if (action.review_status === "needs_changes") needs_changes_actions.push(exportable);
    else pending_actions.push(exportable);
  }

  const informational_keep_actions = informationalKeepActions.map(withoutSourceFields);

  const summary = {
    total_actions: actions.length,
    reviewable_actions: reviewableActions.length,
    informational_keep_actions: informationalKeepActions.length,
    approved: approved_actions.length,
    rejected: rejected_actions.length,
    needs_changes: needs_changes_actions.length,
    pending: pending_actions.length
  };

  return {
    project: proposal.project,
    proposal_version: proposal.proposal_version,
    language: proposal.language,
    exported_at: new Date().toISOString(),
    summary,
    approved_actions,
    rejected_actions,
    needs_changes_actions,
    pending_actions,
    informational_keep_actions
  };
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function CategoriesReviewClient() {
  const [tab, setTab] = useState<TabKey>("simple");
  const [proposal, setProposal] = useState<CategoryReviewProposal | null>(null);
  const [actions, setActions] = useState<CategoryReviewAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [selection, setSelection] = useState<Selection>({ kind: "none" });
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() => new Set<string>(["cat-root"]));

  const [search, setSearch] = useState("");
  const [filterReviewStatus, setFilterReviewStatus] = useState<"all" | ReviewStatus>("all");
  const [filterActionType, setFilterActionType] = useState<"all" | Exclude<CategoryChangeStatus, "root">>("all");
  const [filterNeedsHuman, setFilterNeedsHuman] = useState(false);

  const [simpleActionId, setSimpleActionId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [commentTargetActionId, setCommentTargetActionId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch("/order2party-categories-review-ui.json", {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("failed");
        }

        const data = (await response.json()) as CategoryReviewProposal;
        if (cancelled) return;

        const normalizedProposal: CategoryReviewProposal = {
          ...data,
          tree: normalizeTreeForHumanReview(data.tree),
          actions: data.actions.map(normalizeActionForHumanReview)
        };

        setProposal(normalizedProposal);

        let hydrated = normalizedProposal.actions;

        try {
          const overlay = await fetchSavedOverlay();
          hydrated = applySavedOverlay(normalizedProposal.actions, overlay);
          setSaveStatus("saved");
        } catch {
          const local = loadLocalState();
          hydrated = normalizedProposal.actions.map((action) => {
            if (!isReviewableAction(action)) return action;
            const override = local.overrides[action.action_id];
            if (!override || override.review_status === "pending") return action;
            return {
              ...action,
              review_status: override.review_status,
              review_comment: override.review_comment ?? null,
              reviewed_by: override.reviewed_by ?? null,
              reviewed_at: override.reviewed_at ?? null
            };
          });
          setSaveStatus("error");
        }

        setActions(hydrated);
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const treeIndex = useMemo(() => {
    if (!proposal) return null;
    return flattenTree(proposal.tree);
  }, [proposal]);

  const actionById = useMemo(() => {
    const map = new Map<string, CategoryReviewAction>();
    for (const action of actions) {
      map.set(action.action_id, action);
    }
    return map;
  }, [actions]);

  const actionByNodeId = useMemo(() => {
    const map = new Map<string, CategoryReviewAction>();
    for (const action of actions) {
      map.set(action.node_id, action);
    }
    return map;
  }, [actions]);

  const effectiveReviewStatusByNodeId = useMemo(() => {
    const map = new Map<string, ReviewStatus>();
    for (const action of actions) {
      map.set(action.node_id, action.review_status);
    }
    if (proposal) {
      // Root node fallback
      map.set(proposal.tree.node_id, proposal.tree.review_status);
    }
    return map;
  }, [actions, proposal]);

  const reviewableActions = useMemo(() => actions.filter(isReviewableAction), [actions]);

  const informationalKeepActions = useMemo(() => actions.filter(isInformationalKeepAction), [actions]);

  const counts = useMemo(() => buildCounts(reviewableActions), [reviewableActions]);

  const keptInProposalCount = informationalKeepActions.length;

  const decidedCount = useMemo(
    () => reviewableActions.filter((action) => isReviewedStatus(action.review_status)).length,
    [reviewableActions]
  );
  const totalReviewable = reviewableActions.length;
  const progress = totalReviewable === 0 ? 0 : decidedCount / totalReviewable;
  const decidedPct = Math.round(progress * 100);

  const filteredActions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return actions.filter((action) => {
      if (filterReviewStatus !== "all" && action.review_status !== filterReviewStatus) return false;
      if (filterActionType !== "all" && action.action !== filterActionType) return false;
      if (filterNeedsHuman && !action.needs_human_review) return false;

      if (!query) return true;

      const nodeName = treeIndex?.byId.get(action.node_id)?.name ?? "";
      const { current, proposed } = getPathList(action);

      const haystack = [
        action.action_id,
        action.node_id,
        action.action,
        nodeName,
        action.reason ?? "",
        ...current,
        ...proposed
      ]
        .join(" \n")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [actions, filterActionType, filterNeedsHuman, filterReviewStatus, search, treeIndex]);

  const selectedAction = useMemo(() => {
    if (selection.kind === "action") return actionById.get(selection.actionId) ?? null;
    if (selection.kind === "node") return actionByNodeId.get(selection.nodeId) ?? null;
    return null;
  }, [actionById, actionByNodeId, selection]);

  const selectedNode = useMemo(() => {
    if (!treeIndex) return null;
    if (selection.kind === "node") return treeIndex.byId.get(selection.nodeId) ?? null;
    if (selection.kind === "action") {
      const action = actionById.get(selection.actionId);
      if (!action) return null;
      return treeIndex.byId.get(action.node_id) ?? null;
    }
    return null;
  }, [actionById, selection, treeIndex]);

  const selectedEffectiveReviewStatus: ReviewStatus | null = useMemo(() => {
    if (!selectedNode) return null;
    return effectiveReviewStatusByNodeId.get(selectedNode.node_id) ?? selectedNode.review_status;
  }, [effectiveReviewStatusByNodeId, selectedNode]);

  const simpleQueue = useMemo(() => {
    const filtered = actions.filter((action) => isReviewableAction(action) && action.review_status === "pending");

    const orderIndex = new Map<string, number>();
    for (let index = 0; index < actions.length; index += 1) {
      const action = actions[index];
      if (!action) continue;
      orderIndex.set(action.action_id, index);
    }

    return filtered
      .slice()
      .sort((left, right) => {
        const a = actionPriorityForQueue(left);
        const b = actionPriorityForQueue(right);
        if (a !== b) return a - b;
        return (orderIndex.get(left.action_id) ?? 0) - (orderIndex.get(right.action_id) ?? 0);
      })
      .map((action) => action.action_id);
  }, [actions]);

  const simpleIndex = useMemo(() => {
    if (!simpleActionId) return -1;
    return simpleQueue.indexOf(simpleActionId);
  }, [simpleActionId, simpleQueue]);

  const simpleAction = useMemo(() => {
    if (!simpleActionId) return null;
    return actionById.get(simpleActionId) ?? null;
  }, [actionById, simpleActionId]);

  const simpleNodeName = useMemo(() => {
    if (!simpleAction) return "";
    return treeIndex?.byId.get(simpleAction.node_id)?.name ?? "";
  }, [simpleAction, treeIndex]);

  const simplePaths = useMemo(() => {
    if (!simpleAction) return { current: [], proposed: [] };
    return getPathList(simpleAction);
  }, [simpleAction]);

  const commentTargetAction = useMemo(() => {
    if (!commentTargetActionId) return null;
    return actionById.get(commentTargetActionId) ?? null;
  }, [actionById, commentTargetActionId]);

  useEffect(() => {
    // Initialize cursor for simple mode.
    if (simpleActionId) return;
    setSimpleActionId(simpleQueue[0] ?? null);
  }, [simpleActionId, simpleQueue]);

  useEffect(() => {
    // Keep cursor valid when filter changes or decisions update.
    if (simpleQueue.length === 0) {
      setSimpleActionId(null);
      return;
    }

    if (simpleActionId && simpleQueue.includes(simpleActionId)) return;
    setSimpleActionId(simpleQueue[0] ?? null);
  }, [simpleActionId, simpleQueue]);

  const updateAction = useCallback(
    (actionId: string, updater: (current: CategoryReviewAction) => CategoryReviewAction) => {
    setActions((prev) => {
      const next = prev.map((action) => {
        if (action.action_id !== actionId) return action;
        return updater(action);
      });
      return next;
    });
    },
    []
  );

  function onSelectAction(actionId: string) {
    setSelection({ kind: "action", actionId });
  }

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 1600);
  }, []);

  const saveDecisionToBlob = useCallback(
    async (input: {
      action_id: string;
      node_id: string;
      review_status: SavedDecisionReviewStatus;
      review_comment?: string | null;
      reviewed_by?: string | null;
    }) => {
      setSaveStatus("saving");

      try {
        const saved = await postSavedDecision(input);
        saveDecisionToLocalCache(saved);
        updateAction(saved.action_id, (current) => ({
          ...current,
          review_status: saved.review_status,
          review_comment: saved.review_comment ?? null,
          reviewed_by: saved.reviewed_by ?? null,
          reviewed_at: saved.reviewed_at
        }));
        setSaveStatus("saved");
        showToast("Guardado.");
      } catch {
        setSaveStatus("error");
        showToast("Erro ao guardar. A decisão não ficou sincronizada entre dispositivos.");
      }
    },
    [showToast, updateAction]
  );

  const resetActionToProposalState = useCallback(
    (actionId: string) => {
      const proposalAction = proposal?.actions.find((action) => action.action_id === actionId);
      if (!proposalAction) return;

      updateAction(actionId, () => proposalAction);
    },
    [proposal, updateAction]
  );

  const reverseDecision = useCallback(
    async (actionId: string) => {
      const action = actionById.get(actionId);
      if (!action || !isReviewableAction(action)) return;

      resetActionToProposalState(actionId);
      removeDecisionFromLocalCache(actionId);
      setCommentTargetActionId((current) => (current === actionId ? null : current));
      setCommentDraft("");
      setSaveStatus("saving");

      try {
        await deleteSavedDecision(actionId);
        setSaveStatus("saved");
        showToast("Decisão revertida.");
      } catch {
        setSaveStatus("error");
        showToast("Erro ao reverter decisão guardada.");
      }
    },
    [actionById, resetActionToProposalState, showToast]
  );

  const goSimplePrev = useCallback(() => {
    if (simpleQueue.length === 0) return;
    if (!simpleActionId) return;
    const index = simpleQueue.indexOf(simpleActionId);
    if (index <= 0) {
      setSimpleActionId(simpleQueue[simpleQueue.length - 1] ?? null);
    } else {
      setSimpleActionId(simpleQueue[index - 1] ?? null);
    }
  }, [simpleActionId, simpleQueue]);

  const goSimpleNext = useCallback(() => {
    if (simpleQueue.length === 0) return;
    if (!simpleActionId) return;
    const index = simpleQueue.indexOf(simpleActionId);
    if (index === -1 || index >= simpleQueue.length - 1) {
      setSimpleActionId(simpleQueue[0] ?? null);
    } else {
      setSimpleActionId(simpleQueue[index + 1] ?? null);
    }
  }, [simpleActionId, simpleQueue]);

  const goToNextPending = useCallback(
    (fromActionId: string) => {
      const orderIndex = new Map<string, number>();
      for (let index = 0; index < actions.length; index += 1) {
        const action = actions[index];
        if (!action) continue;
        orderIndex.set(action.action_id, index);
      }

      const pendingOrdered = actions
        .filter((action) => isReviewableAction(action) && action.review_status === "pending")
        .slice()
        .sort((left, right) => {
          const a = actionPriorityForQueue(left);
          const b = actionPriorityForQueue(right);
          if (a !== b) return a - b;
          return (orderIndex.get(left.action_id) ?? 0) - (orderIndex.get(right.action_id) ?? 0);
        });

      if (pendingOrdered.length === 0) {
        setSimpleActionId(fromActionId);
        showToast("Sem ações pendentes para rever.");
        return;
      }

      const currentIndex = pendingOrdered.findIndex((a) => a.action_id === fromActionId);
      const next = pendingOrdered[(currentIndex + 1) % pendingOrdered.length] ?? pendingOrdered[0];
      setSimpleActionId(next?.action_id ?? pendingOrdered[0]!.action_id);
    },
    [actions, showToast]
  );

  const applySimpleDecision = useCallback(
    (status: SavedDecisionReviewStatus) => {
      if (!simpleAction) return;
      if (!isReviewableAction(simpleAction)) {
        showToast("Esta ação está apenas mantida na proposta e não precisa de decisão.");
        return;
      }
      const currentActionId = simpleAction.action_id;
      const optimisticReviewedAt = new Date().toISOString();

      updateAction(currentActionId, (current) => ({
        ...current,
        review_status: status,
        reviewed_at: optimisticReviewedAt,
        reviewed_by: current.reviewed_by ?? null
      }));

      if (status === "rejected" || status === "needs_changes") {
        setCommentTargetActionId(currentActionId);
        setCommentDraft(simpleAction.review_comment ?? "");
      } else {
        setCommentTargetActionId(null);
        setCommentDraft("");
      }

      showToast("Decisão registada. A avançar para a próxima proposta.");
      goToNextPending(currentActionId);
      void saveDecisionToBlob({
        action_id: simpleAction.action_id,
        node_id: simpleAction.node_id,
        review_status: status,
        review_comment: status === "approved" ? null : simpleAction.review_comment ?? null,
        reviewed_by: simpleAction.reviewed_by ?? "client"
      });
    },
    [goToNextPending, saveDecisionToBlob, showToast, simpleAction, updateAction]
  );

  useEffect(() => {
    if (tab !== "simple") return;

    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;
      if (!simpleAction) return;

      const key = event.key.toLowerCase();

      if (key === "a") {
        event.preventDefault();
        applySimpleDecision("approved");
      } else if (key === "r") {
        event.preventDefault();
        applySimpleDecision("rejected");
      } else if (key === "n") {
        event.preventDefault();
        applySimpleDecision("needs_changes");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goSimpleNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goSimplePrev();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applySimpleDecision, goSimpleNext, goSimplePrev, simpleAction, tab]);

  function saveCommentForActionId(actionId: string, comment: string) {
    const targetAction = actionById.get(actionId);
    if (!targetAction || !isSavedDecisionStatus(targetAction.review_status)) return;
    const nextComment = comment.trim() ? comment : null;

    updateAction(actionId, (current) => ({
      ...current,
      review_comment: nextComment,
      reviewed_at: new Date().toISOString(),
      reviewed_by: current.reviewed_by ?? null
    }));
    void saveDecisionToBlob({
      action_id: targetAction.action_id,
      node_id: targetAction.node_id,
      review_status: targetAction.review_status,
      review_comment: nextComment,
      reviewed_by: targetAction.reviewed_by ?? "client"
    });
  }

  function onSelectNode(nodeId: string) {
    setSelection({ kind: "node", nodeId });
  }

  function toggleExpanded(nodeId: string) {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }

  async function clearSavedDecisions() {
    if (!window.confirm("Tens a certeza que queres limpar as decisões guardadas?")) return;
    setSaveStatus("saving");

    try {
      const response = await fetch(REVIEW_API_PATH, { method: "DELETE" });
      if (!response.ok) throw new Error("failed");
      window.localStorage.removeItem(STORAGE_KEY);

      if (!proposal) return;
      setActions(proposal.actions);
      setSelection({ kind: "none" });
      setCommentTargetActionId(null);
      setCommentDraft("");
      setSimpleActionId(null);
      setSaveStatus("saved");
      showToast("Decisões guardadas limpas.");
    } catch {
      setSaveStatus("error");
      showToast("Erro ao limpar decisões guardadas.");
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">A carregar proposta de categorias...</p>;
  }

  if (error || !proposal) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h1 className="font-heading text-2xl font-semibold text-text">Order2Party — Revisão de Categorias</h1>
        <p className="mt-2 text-sm text-muted">Não foi possível carregar o ficheiro de proposta de categorias.</p>
        <p className="mt-4 text-xs text-muted">Verifica se `public/order2party-categories-review-ui.json` existe e está acessível.</p>
      </div>
    );
  }

  const exportData = exportPayload(proposal, actions);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text">Order2Party — Revisão de Categorias</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">Aprova, rejeita ou pede alterações às categorias propostas.</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="text-sm font-semibold">Modo de revisão: nenhuma alteração é aplicada automaticamente ao WooCommerce.</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
          <span className="font-medium text-text">Autosave Vercel Blob:</span>{" "}
          {saveStatus === "saving" ? "A guardar..." : saveStatus === "saved" ? "Guardado" : saveStatus === "error" ? "Erro ao guardar" : "Pronto"}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-glow">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Progresso</p>
              <p className="mt-1 font-heading text-lg font-semibold text-text">
                {decidedCount} de {totalReviewable} decisões revistas
              </p>
              <p className="mt-1 text-xs text-muted">{decidedPct}% concluído</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge label={`Pendentes: ${counts.pending}`} tone="border-border bg-white text-muted" />
              <Badge label={`Aprovadas: ${counts.approved}`} tone={badgeToneForReview("approved")} />
              <Badge label={`Rejeitadas: ${counts.rejected}`} tone={badgeToneForReview("rejected")} />
              <Badge label={`Precisa de alterações: ${counts.needs_changes}`} tone={badgeToneForReview("needs_changes")} />
              <Badge label={`Mantidas na proposta: ${keptInProposalCount}`} tone="border-border bg-white text-muted" />
            </div>
          </div>

          <p className="mt-2 text-xs text-muted">
            Nota: “Aprovadas / Rejeitadas / Precisa de alterações” refletem decisões humanas guardadas na overlay persistente.
            “Mantidas na proposta” são categorias keep informativas e não contam como aprovações humanas.
          </p>

          <div className="mt-4">
            <div className="h-2 w-full rounded-full border border-border bg-white">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min(100, Math.max(0, decidedPct))}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <ToggleButton active={tab === "simple"} onClick={() => setTab("simple")}>
            Modo simples
          </ToggleButton>
          <ToggleButton active={tab === "tree"} onClick={() => setTab("tree")}>
            Ver árvore
          </ToggleButton>
          <ToggleButton active={tab === "list"} onClick={() => setTab("list")}>
            Ver lista completa
          </ToggleButton>
          <ToggleButton active={tab === "export"} onClick={() => setTab("export")}>
            Exportar
          </ToggleButton>
        </div>

        <p className="text-xs text-muted">Atalhos: A aprova · R rejeita · N pede alterações</p>
      </div>

      {tab === "simple" ? (
        <div className="space-y-4">
          <SectionCard
            title="Fila de revisão"
            right={<Badge label={`Pendentes: ${counts.pending}`} tone="border-border bg-white text-muted" />}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted">
                {simpleQueue.length === 0 ? (
                  <span>Sem ações pendentes para rever.</span>
                ) : (
                  <span>
                    Ação {Math.max(1, simpleIndex + 1)} de {simpleQueue.length}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goSimplePrev}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={goSimpleNext}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
                >
                  Seguinte
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!simpleAction) return;
                    goToNextPending(simpleAction.action_id);
                  }}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Ir para próxima pendente
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="mx-auto max-w-2xl">
                {simpleAction ? (
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-glow">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge label={changeTypeLabel(simpleAction.action)} tone={badgeToneForChange(simpleAction.action)} />
                      <Badge
                        label={reviewStatusLabel(simpleAction.review_status)}
                        tone={badgeToneForReview(simpleAction.review_status)}
                      />
                      <Badge label={decisionScopeLabel(simpleAction)} tone={decisionScopeTone(simpleAction)} />
                      {simpleAction.needs_human_review ? (
                        <Badge label="Precisa de validação humana" tone={badgeToneForChange("needs_human_review")} />
                      ) : null}
                    </div>

                    <div className="mt-5 space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Categoria proposta</p>
                        <p className="mt-2 break-words font-heading text-2xl font-semibold text-text">
                          {simplePaths.proposed[0] ?? simpleNodeName ?? "—"}
                        </p>
                      </div>

                      {simplePaths.current[0] ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Categoria atual</p>
                          <p className="mt-2 break-words text-sm text-text">{simplePaths.current[0]}</p>
                        </div>
                      ) : null}

                      {simpleAction.reason ? (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Motivo da proposta</p>
                          <p className="mt-2 text-sm text-text">{simpleAction.reason}</p>
                        </div>
                      ) : null}

                      <details className="rounded-2xl border border-border bg-background/60 p-4">
                        <summary className="cursor-pointer text-sm font-medium text-text">Ver detalhes técnicos</summary>
                        <div className="mt-3 grid gap-2 text-xs text-muted">
                          <p>
                            <span className="font-medium text-text">action_id:</span> {simpleAction.action_id}
                          </p>
                          <p>
                            <span className="font-medium text-text">node_id:</span> {simpleAction.node_id}
                          </p>
                          <p>
                            <span className="font-medium text-text">raw action:</span> {simpleAction.action}
                          </p>
                          <p>
                            <span className="font-medium text-text">raw review_status:</span> {simpleAction.review_status}
                          </p>
                          <p>
                            <span className="font-medium text-text">current_paths:</span> {JSON.stringify(simplePaths.current)}
                          </p>
                          <p>
                            <span className="font-medium text-text">proposed_paths:</span> {JSON.stringify(simplePaths.proposed)}
                          </p>
                        </div>
                      </details>
                    </div>

                    {isReviewableAction(simpleAction) ? (
                      <div className="mt-6 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <button
                            type="button"
                            onClick={() => void applySimpleDecision("rejected")}
                            className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-base font-semibold text-rose-800 hover:bg-rose-100"
                          >
                            Rejeitar
                          </button>
                          <button
                            type="button"
                            onClick={() => void applySimpleDecision("needs_changes")}
                            className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-base font-semibold text-amber-900 hover:bg-amber-100"
                          >
                            Precisa de alterações
                          </button>
                          <button
                            type="button"
                            onClick={() => void applySimpleDecision("approved")}
                            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-base font-semibold text-emerald-800 hover:bg-emerald-100"
                          >
                            Aprovar
                          </button>
                        </div>
                        {isReviewedStatus(simpleAction.review_status) ? (
                          <button
                            type="button"
                            onClick={() => void reverseDecision(simpleAction.action_id)}
                            className="w-full rounded-2xl border border-border bg-white px-5 py-3 text-sm font-medium text-text hover:bg-slate-50"
                          >
                            Reverter decisão
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-border bg-slate-50 p-4 text-sm text-muted">
                        Esta categoria está apenas mantida na proposta. Não precisa de aprovação, rejeição ou pedido de alterações.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-white p-6 text-sm text-muted">
                    Não há nenhuma ação disponível neste filtro.
                  </div>
                )}

                {commentTargetAction && (commentTargetAction.review_status === "rejected" || commentTargetAction.review_status === "needs_changes") ? (
                  <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
                    <p className="text-sm font-medium text-text">
                      {commentTargetAction.review_status === "needs_changes" ? "Comentário (recomendado)" : "Comentário opcional"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Para a decisão em: {getPathList(commentTargetAction).proposed[0] ?? treeIndex?.byId.get(commentTargetAction.node_id)?.name ?? "—"}
                    </p>

                    <textarea
                      rows={3}
                      value={commentDraft}
                      onChange={(e) => setCommentDraft(e.target.value)}
                      className="mt-3 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-accent"
                      placeholder="Escreve aqui o que precisa de ser alterado (ou porquê foi rejeitado)..."
                    />

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => saveCommentForActionId(commentTargetAction.action_id, commentDraft)}
                        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                      >
                        Guardar comentário
                      </button>
                      <p className="text-xs text-muted">
                        {commentTargetAction.reviewed_at ? `Última atualização: ${formatGeneratedAt(commentTargetAction.reviewed_at)}` : ""}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </SectionCard>

          <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
            Esta página não altera a loja WooCommerce. Apenas regista decisões de revisão para implementação posterior.
          </div>
        </div>
      ) : null}

      {tab === "tree" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Árvore">
            <div className="max-h-[620px] space-y-2 overflow-auto pr-1">
              <TreeView
                root={proposal.tree}
                expandedNodeIds={expandedNodeIds}
                toggleExpanded={toggleExpanded}
                onSelectNode={(nodeId) => {
                  onSelectNode(nodeId);
                  const linked = actionByNodeId.get(nodeId);
                  if (linked) {
                    setSelection({ kind: "action", actionId: linked.action_id });
                  }
                }}
                selectedNodeId={selectedNode?.node_id ?? null}
                effectiveReviewStatusByNodeId={effectiveReviewStatusByNodeId}
                actionByNodeId={actionByNodeId}
              />
            </div>
          </SectionCard>

          <SectionCard title="Detalhes">
            {selection.kind === "none" ? (
              <p className="text-sm text-muted">Seleciona uma categoria para veres detalhes.</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Categoria</p>
                  <p className="font-heading text-2xl font-semibold text-text">{selectedNode?.name ?? "—"}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode ? <Badge label={changeTypeLabel(selectedNode.status)} tone={badgeToneForChange(selectedNode.status)} /> : null}
                    {selectedAction ? <Badge label={decisionScopeLabel(selectedAction)} tone={decisionScopeTone(selectedAction)} /> : null}
                    {selectedAction && isInformationalKeepAction(selectedAction) ? (
                      <Badge label="Sem decisão necessária" tone="border-border bg-white text-muted" />
                    ) : selectedEffectiveReviewStatus ? (
                      <Badge label={reviewStatusLabel(selectedEffectiveReviewStatus)} tone={badgeToneForReview(selectedEffectiveReviewStatus)} />
                    ) : null}
                  </div>
                </div>

                {selectedAction ? (
                  <div className="space-y-3">
                    {isReviewableAction(selectedAction) && isReviewedStatus(selectedAction.review_status) ? (
                      <button
                        type="button"
                        onClick={() => void reverseDecision(selectedAction.action_id)}
                        className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
                      >
                        Reverter decisão
                      </button>
                    ) : null}

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Atual</p>
                        <PathsBlock item={selectedAction} kind="current" />
                      </div>
                      <div className="rounded-2xl border border-border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Proposto</p>
                        <PathsBlock item={selectedAction} kind="proposed" />
                      </div>
                    </div>

                    {selectedAction.reason ? (
                      <div className="rounded-2xl border border-border bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Motivo</p>
                        <p className="mt-2 text-sm text-text">{selectedAction.reason}</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Este nó não tem uma ação associada.</p>
                )}
              </div>
            )}
          </SectionCard>
        </div>
      ) : null}

      {tab === "list" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard
            title="Lista completa"
            right={<p className="text-xs text-muted">{filteredActions.length} resultados</p>}
          >
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted">Pesquisa</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar por nome, paths, motivo..."
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-accent"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted">Validação humana</span>
                  <button
                    type="button"
                    onClick={() => setFilterNeedsHuman((v) => !v)}
                    className={classNames(
                      "w-full rounded-xl border px-3 py-2 text-sm",
                      filterNeedsHuman ? "border-yellow-300 bg-yellow-50 text-yellow-900" : "border-border bg-white text-text"
                    )}
                  >
                    {filterNeedsHuman ? "Só com validação" : "Todas"}
                  </button>
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted">Estado</span>
                  <select
                    value={filterReviewStatus}
                    onChange={(e) => setFilterReviewStatus(e.target.value as "all" | ReviewStatus)}
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-accent"
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovado</option>
                    <option value="rejected">Rejeitado</option>
                    <option value="needs_changes">Precisa de alterações</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted">Tipo de ação</span>
                  <select
                    value={filterActionType}
                    onChange={(e) => setFilterActionType(e.target.value as "all" | Exclude<CategoryChangeStatus, "root">)}
                    className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-accent"
                  >
                    <option value="all">Todos</option>
                    <option value="create">Nova categoria</option>
                    <option value="rename">Renomear</option>
                    <option value="move">Mover</option>
                    <option value="merge">Fundir</option>
                    <option value="split">Dividir</option>
                    <option value="delete_or_hide_candidate">Esconder/remover</option>
                    <option value="keep">Manter</option>
                  </select>
                </label>
              </div>

              <div className="max-h-[620px] overflow-auto rounded-2xl border border-border bg-white">
                <ul className="divide-y divide-border">
                  {filteredActions.map((action) => {
                    const nodeName = treeIndex?.byId.get(action.node_id)?.name ?? "";
                    const { current, proposed } = getPathList(action);
                    const proposedLabel = proposed[0] ?? nodeName ?? "—";
                    const currentLabel = current[0] ?? "";
                    const rowSelected = selection.kind === "action" && selection.actionId === action.action_id;
                    const informationalKeep = isInformationalKeepAction(action);

                    return (
                      <li
                        key={action.action_id}
                        className={classNames(
                          "px-4 py-3",
                          rowSelected ? "bg-accent/5" : informationalKeep ? "bg-slate-50/70" : "bg-white"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAction(action.action_id);
                            setSimpleActionId(action.action_id);
                          }}
                          className="w-full text-left"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text">{proposedLabel}</p>
                              {currentLabel ? (
                                <p className="mt-1 text-xs text-muted">
                                  <span className="font-medium text-text">Atual:</span> {currentLabel}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                              <Badge label={changeTypeLabel(action.action)} tone={badgeToneForChange(action.action)} />
                              <Badge label={decisionScopeLabel(action)} tone={decisionScopeTone(action)} />
                              {informationalKeep ? (
                                <Badge label="Sem decisão necessária" tone="border-border bg-white text-muted" />
                              ) : (
                                <Badge label={reviewStatusLabel(action.review_status)} tone={badgeToneForReview(action.review_status)} />
                              )}
                              {action.needs_human_review ? (
                                <Badge label="Validação humana" tone={badgeToneForChange("needs_human_review")} />
                              ) : null}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Detalhes">
            {selection.kind === "none" ? (
              <p className="text-sm text-muted">Seleciona uma ação para veres detalhes.</p>
            ) : selectedAction ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Categoria</p>
                  <p className="font-heading text-2xl font-semibold text-text">{selectedNode?.name ?? "—"}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge label={changeTypeLabel(selectedAction.action)} tone={badgeToneForChange(selectedAction.action)} />
                    <Badge label={decisionScopeLabel(selectedAction)} tone={decisionScopeTone(selectedAction)} />
                    {isInformationalKeepAction(selectedAction) ? (
                      <Badge label="Sem decisão necessária" tone="border-border bg-white text-muted" />
                    ) : (
                      <Badge label={reviewStatusLabel(selectedAction.review_status)} tone={badgeToneForReview(selectedAction.review_status)} />
                    )}
                    {selectedAction.needs_human_review ? (
                      <Badge label="Precisa de validação humana" tone={badgeToneForChange("needs_human_review")} />
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Atual</p>
                    <PathsBlock item={selectedAction} kind="current" />
                  </div>
                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Proposto</p>
                    <PathsBlock item={selectedAction} kind="proposed" />
                  </div>
                </div>

                {selectedAction.reason ? (
                  <div className="rounded-2xl border border-border bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Motivo</p>
                    <p className="mt-2 text-sm text-text">{selectedAction.reason}</p>
                  </div>
                ) : null}

                {isReviewableAction(selectedAction) && isReviewedStatus(selectedAction.review_status) ? (
                  <button
                    type="button"
                    onClick={() => void reverseDecision(selectedAction.action_id)}
                    className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
                  >
                    Reverter decisão
                  </button>
                ) : null}

                <details className="rounded-2xl border border-border bg-background/60 p-4">
                  <summary className="cursor-pointer text-sm font-medium text-text">Ver detalhes técnicos</summary>
                  <div className="mt-3 grid gap-2 text-xs text-muted">
                    <p>
                      <span className="font-medium text-text">action_id:</span> {selectedAction.action_id}
                    </p>
                    <p>
                      <span className="font-medium text-text">node_id:</span> {selectedAction.node_id}
                    </p>
                    <p>
                      <span className="font-medium text-text">raw action:</span> {selectedAction.action}
                    </p>
                    <p>
                      <span className="font-medium text-text">raw review_status:</span> {selectedAction.review_status}
                    </p>
                  </div>
                </details>
              </div>
            ) : (
              <p className="text-sm text-muted">Seleciona uma ação para veres detalhes.</p>
            )}
          </SectionCard>
        </div>
      ) : null}

      {tab === "export" ? (
        <div className="space-y-4">
          <SectionCard
            title="Exportar decisões"
            right={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadJson("order2party-categories-approved-actions.json", exportData)}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Exportar JSON
                </button>
              </div>
            }
          >
            <div className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted">
              <p className="font-medium text-text">O export separa ações por estado:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><span className="font-medium text-text">approved_actions</span> — ações para decisão aprovadas, elegíveis para implementação WooCommerce mais tarde</li>
                <li><span className="font-medium text-text">rejected_actions</span> — ações para decisão rejeitadas</li>
                <li><span className="font-medium text-text">needs_changes_actions</span> — ações para decisão que precisam de alterações</li>
                <li><span className="font-medium text-text">pending_actions</span> — ações para decisão ainda pendentes</li>
                <li><span className="font-medium text-text">informational_keep_actions</span> — categorias mantidas na proposta, sem aprovação humana</li>
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Metadados</p>
              <div className="mt-2 grid gap-1 text-sm text-text">
                <p><span className="font-medium">Versão:</span> {proposal.proposal_version}</p>
                <p><span className="font-medium">Gerado:</span> {formatGeneratedAt(proposal.generated_at)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-white p-4">
              <p className="text-sm font-medium text-text">Preview do export</p>
              <pre className="mt-3 max-h-[520px] overflow-auto rounded-xl border border-border bg-slate-50 p-3 text-xs text-slate-900">
                {JSON.stringify(exportData, null, 2)}
              </pre>
            </div>
          </SectionCard>
        </div>
      ) : null}

      <footer className="border-t border-border pt-4 text-right">
        <button
          type="button"
          onClick={() => void clearSavedDecisions()}
          className="text-xs font-medium text-muted underline-offset-4 hover:text-text hover:underline"
        >
          Limpar decisões guardadas
        </button>
      </footer>

      {toastMessage ? (
        <div className="fixed bottom-5 left-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text shadow-glow">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}

function TreeView({
  root,
  expandedNodeIds,
  toggleExpanded,
  onSelectNode,
  selectedNodeId,
  effectiveReviewStatusByNodeId,
  actionByNodeId
}: {
  root: CategoryReviewNode;
  expandedNodeIds: Set<string>;
  toggleExpanded: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
  selectedNodeId: string | null;
  effectiveReviewStatusByNodeId: Map<string, ReviewStatus>;
  actionByNodeId: Map<string, CategoryReviewAction>;
}) {
  function renderNode(node: CategoryReviewNode, level: number): React.ReactNode {
    const expanded = expandedNodeIds.has(node.node_id);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const effectiveReviewStatus = effectiveReviewStatusByNodeId.get(node.node_id) ?? node.review_status;
    const linkedAction = actionByNodeId.get(node.node_id) ?? null;

    return (
      <div key={node.node_id} className="space-y-2">
        <div
          onClick={() => onSelectNode(node.node_id)}
          className="cursor-pointer"
        >
          <TreeNodeRow
            node={node}
            level={level}
            expanded={expanded}
            onToggle={toggleExpanded}
            onSelect={onSelectNode}
            selected={selectedNodeId === node.node_id}
            effectiveReviewStatus={effectiveReviewStatus}
            linkedAction={linkedAction}
          />
        </div>
        {hasChildren && expanded ? (
          <div className="space-y-2">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        ) : null}
      </div>
    );
  }

  return <div className="space-y-2">{renderNode(root, 0)}</div>;
}

function PathsBlock({
  item,
  kind
}: {
  item: {
    current_path?: string | null;
    current_paths?: string[] | null;
    proposed_path?: string | null;
    proposed_paths?: string[] | null;
  };
  kind: "current" | "proposed";
}) {
  const { current, proposed } = getPathList(item);
  const list = kind === "current" ? current : proposed;

  if (list.length === 0) {
    return <p className="mt-2 text-sm text-muted">—</p>;
  }

  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text">
      {list.map((value) => (
        <li key={value} className="break-words">
          {value}
        </li>
      ))}
    </ul>
  );
}
