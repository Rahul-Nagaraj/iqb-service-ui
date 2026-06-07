import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Hash, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuestion } from "@/features/questions/hooks/useQuestions";

export const Route = createFileRoute("/_app/questions/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Question #${params.id} — IQB Console` }],
  }),
  component: QuestionDetailPage,
});

function QuestionDetailPage() {
  const { id } = Route.useParams();
  const numericId = Number(id);
  const { data, isLoading, isError, error } = useQuestion(numericId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Question #${id}`}
        description="Detailed view including answer, category and analytics."
        actions={
          <Button variant="outline" asChild>
            <Link to="/questions"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
        }
      />

      {isLoading && (
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load question"}
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-3 text-base">
                <span className="leading-relaxed">{data.question}</span>
                <CategoryBadge category={data.category} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Answer
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                {data.answer || (
                  <span className="text-muted-foreground italic">No answer recorded.</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetaRow icon={Hash} label="ID" value={`#${data.id}`} />
              <MetaRow icon={BookOpen} label="Category" value={data.category ?? "—"} />
              <MetaRow icon={TrendingUp} label="Frequency" value={String(data.frequencyCount ?? 0)} />
              <MetaRow icon={Calendar} label="Created" value={formatDate(data.createdAt)} />
              <MetaRow icon={Calendar} label="Updated" value={formatDate(data.updatedAt)} />
              {data.embedding && data.embedding.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Embedding
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {data.embedding.length}-dim vector
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function formatDate(s?: string) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}
