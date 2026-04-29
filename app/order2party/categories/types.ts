export type CategoryChangeStatus =
  | "root"
  | "keep"
  | "create"
  | "rename"
  | "move"
  | "merge"
  | "split"
  | "delete_or_hide_candidate"
  | "needs_human_review";

export type ReviewStatus = "pending" | "approved" | "rejected" | "needs_changes";
export type SavedDecisionReviewStatus = Exclude<ReviewStatus, "pending">;

export type CategoryReviewNode = {
  node_id: string;
  name: string;
  status: CategoryChangeStatus;
  review_status: ReviewStatus;
  source_review_status?: ReviewStatus;
  current_path?: string | null;
  current_paths?: string[] | null;
  proposed_path?: string | null;
  proposed_paths?: string[] | null;
  reason?: string | null;
  needs_human_review?: boolean;
  children?: CategoryReviewNode[];
};

export type CategoryReviewAction = {
  action_id: string;
  node_id: string;
  action: Exclude<CategoryChangeStatus, "root">;
  review_status: ReviewStatus;
  source_review_status?: ReviewStatus;
  reason?: string | null;
  review_comment?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  needs_human_review?: boolean;
  current_path?: string | null;
  current_paths?: string[] | null;
  proposed_path?: string | null;
  proposed_paths?: string[] | null;
};

export type CategoryReviewProposal = {
  project: string;
  proposal_version: string;
  language: string;
  generated_at?: string;
  source_files?: string[];
  review_status?: string;
  legend?: {
    status?: Record<string, string>;
    review_status?: Record<string, string>;
  };
  tree: CategoryReviewNode;
  actions: CategoryReviewAction[];
};

export type ReviewOverride = {
  review_status: ReviewStatus;
  review_comment?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
};

export type LocalReviewStateV1 = {
  overrides: Record<string, ReviewOverride>;
};

export type SavedDecision = {
  action_id: string;
  node_id: string;
  review_status: SavedDecisionReviewStatus;
  review_comment?: string | null;
  reviewed_by?: string | null;
  reviewed_at: string;
};

export type SavedReviewOverlay = {
  review_id: "order2party-category-review-v1";
  project: "Order2Party";
  proposal_version: "v1";
  updated_at: string | null;
  decisions: Record<string, SavedDecision>;
};
