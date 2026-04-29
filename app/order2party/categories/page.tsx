import { CategoriesReviewClient } from "./review-client";

// TODO: Protect this route before sharing publicly with the client.

export default function CategoriesReviewPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <CategoriesReviewClient />
    </main>
  );
}
