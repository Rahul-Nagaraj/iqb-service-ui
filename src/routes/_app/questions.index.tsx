import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CATEGORY_LABELS } from "@/constants/categories";
import { QUESTION_CATEGORIES } from "@/types/question";
import { useQuestionsList } from "@/features/questions/hooks/useQuestions";
import type { QuestionCategory } from "@/types/question";

const searchSchema = z.object({
  category: z.enum(QUESTION_CATEGORIES).optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/_app/questions/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Questions — IQB Console" },
      { name: "description", content: "Browse, filter, and search all interview questions." },
    ],
  }),
  component: QuestionsListPage,
});

function QuestionsListPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [searchInput, setSearchInput] = useState(search.q ?? "");

  const { data, isLoading, isError, error } = useQuestionsList(search.category);
  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = (search.q ?? "").toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q),
    );
  }, [data, search.q]);

  const onCategoryChange = (value: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: value === "ALL" ? undefined : (value as QuestionCategory),
      }),
    });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev) => ({ ...prev, q: searchInput.trim() || undefined }),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Questions"
        description="All questions ingested by the backend service."
        actions={
          <Button asChild>
            <Link to="/questions/new">
              <PlusCircle className="mr-2 h-4 w-4" /> New question
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <form onSubmit={submitSearch} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search question or answer…"
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>
          <Select
            value={search.category ?? "ALL"}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {QUESTION_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4"><TableSkeleton rows={8} /></div>
          ) : isError ? (
            <div className="p-6 text-sm text-destructive">
              {error instanceof Error ? error.message : "Failed to load questions"}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={BookOpen}
                title="No questions found"
                description="Try clearing your filters or add a new question to get started."
                action={
                  <Button asChild>
                    <Link to="/questions/new">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add question
                    </Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-40">Category</TableHead>
                  <TableHead className="w-24 text-right">Asked</TableHead>
                  <TableHead className="w-24 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{q.id}
                    </TableCell>
                    <TableCell className="max-w-xl">
                      <Link
                        to="/questions/$id"
                        params={{ id: String(q.id) }}
                        className="line-clamp-2 font-medium hover:text-primary"
                      >
                        {q.question}
                      </Link>
                    </TableCell>
                    <TableCell><CategoryBadge category={q.category} /></TableCell>
                    <TableCell className="text-right tabular-nums">
                      {q.frequencyCount ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/questions/$id" params={{ id: String(q.id) }}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
