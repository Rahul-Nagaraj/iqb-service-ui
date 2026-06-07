import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompare, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useSimilarityCheck } from "@/features/questions/hooks/useQuestions";

export const Route = createFileRoute("/_app/similarity")({
  head: () => ({
    meta: [
      { title: "Similarity Check — IQB Console" },
      { name: "description", content: "Check semantic similarity against the question bank." },
    ],
  }),
  component: SimilarityPage,
});

function SimilarityPage() {
  const [query, setQuery] = useState("");
  const check = useSimilarityCheck();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 5) {
      toast.error("Enter at least 5 characters");
      return;
    }
    try {
      await check.mutateAsync(q);
    } catch (err) {
      toast.error("Similarity check failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const result = check.data;
  const score = result?.bestMatch?.similarityScore ?? 0;
  const scorePct = Math.round(score * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Similarity Check"
        description="Find the closest matching question using vector embeddings."
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Query</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="q">Question to compare</Label>
              <div className="flex gap-2">
                <Input
                  id="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. How does Spring dependency injection work?"
                />
                <Button type="submit" disabled={check.isPending}>
                  {check.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking</>
                  ) : (
                    <><Search className="mr-2 h-4 w-4" /> Check</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitCompare className="h-4 w-4" /> Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Input
              </p>
              <p className="mt-1 text-sm">{result.inputQuestion}</p>
            </div>

            {result.bestMatch ? (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Best match
                  </p>
                  <Link
                    to="/questions/$id"
                    params={{ id: String(result.bestMatch.id) }}
                    className="mt-1 block text-sm font-medium hover:text-primary"
                  >
                    {result.bestMatch.question}
                  </Link>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">Similarity score</span>
                    <span className="font-mono tabular-nums">{scorePct}%</span>
                  </div>
                  <Progress value={scorePct} />
                </div>

                {result.embedding && (
                  <p className="text-xs text-muted-foreground">
                    Embedding: {result.embedding.length}-dimensional vector.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No similar question found in the bank yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
