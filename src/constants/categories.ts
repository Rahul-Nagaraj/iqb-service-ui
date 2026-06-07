import type { QuestionCategory } from "@/types/question";

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  JAVA: "Java",
  SPRING: "Spring",
  DSA: "DSA",
  DATABASE: "Database",
  SYSTEM_DESIGN: "System Design",
};

export const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  JAVA: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  SPRING: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  DSA: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  DATABASE: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  SYSTEM_DESIGN: "bg-chart-5/15 text-chart-5 border-chart-5/30",
};
