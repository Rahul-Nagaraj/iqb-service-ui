import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Layers, PlusCircle, Sparkles, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { CardsSkeleton, TableSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { useQuestionsList } from "@/features/questions/hooks/useQuestions";
import { CATEGORY_LABELS, QUESTION_CATEGORIES } from "@/constants/categories";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — IQB Console" },
      { name: "description", content: "Interview question bank analytics dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isLoading, isError, error } = useQuestionsList();
  const questions = data ?? [];

  const totalAnswers = questions.filter((q) => q.answer?.trim().length > 0).length;
  const totalFrequency = questions.reduce((s, q) => s + (q.frequencyCount ?? 0), 0);
  const topAsked = [...questions]
    .sort((a, b) => (b.frequencyCount ?? 0) - (a.frequencyCount ?? 0))
    .slice(0, 5);

  const chartData = QUESTION_CATEGORIES.map((c) => ({
    name: CATEGORY_LABELS[c],
    value: questions.filter((q) => q.category === c).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live metrics from the Interview Question Bank service."
        actions={
          <Button asChild>
            <Link to="/questions/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add question
            </Link>
          </Button>
        }
      />

      {isError && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive">
            Failed to load metrics: {error instanceof Error ? error.message : "Unknown error"}
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <CardsSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Questions" value={questions.length} icon={BookOpen} accent="chart-1" />
          <StatCard label="With Answers" value={totalAnswers} icon={Sparkles} accent="chart-2" />
          <StatCard label="Total Frequency" value={totalFrequency} icon={TrendingUp} accent="chart-3" />
          <StatCard
            label="Categories Used"
            value={chartData.filter((c) => c.value > 0).length}
            icon={Layers}
            accent="chart-4"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Questions by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Asked</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : topAsked.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No data yet"
                description="Add your first question to see analytics."
              />
            ) : (
              <ul className="space-y-3">
                {topAsked.map((q) => (
                  <li
                    key={q.id}
                    className="flex items-start justify-between gap-3 rounded-md border border-border bg-card p-3"
                  >
                    <Link
                      to="/questions/$id"
                      params={{ id: String(q.id) }}
                      className="line-clamp-2 flex-1 text-sm font-medium hover:text-primary"
                    >
                      {q.question}
                    </Link>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <CategoryBadge category={q.category} />
                      <span className="text-xs text-muted-foreground">
                        × {q.frequencyCount ?? 0}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
