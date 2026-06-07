import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/constants/categories";
import type { QuestionCategory } from "@/types/question";

export function CategoryBadge({
  category,
}: {
  category: QuestionCategory | null | undefined;
}) {
  if (!category) {
    return (
      <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        Uncategorized
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
