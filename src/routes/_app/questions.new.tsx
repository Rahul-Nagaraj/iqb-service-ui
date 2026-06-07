import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateQuestion } from "@/features/questions/hooks/useQuestions";
import { Link } from "@tanstack/react-router";

const schema = z.object({
  question: z
    .string()
    .trim()
    .min(8, "Question must be at least 8 characters")
    .max(500, "Question must be under 500 characters"),
  answer: z
    .string()
    .trim()
    .min(5, "Answer must be at least 5 characters")
    .max(5000, "Answer must be under 5000 characters"),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/_app/questions/new")({
  head: () => ({
    meta: [
      { title: "Add Question — IQB Console" },
      { name: "description", content: "Add a new interview question and answer." },
    ],
  }),
  component: NewQuestionPage,
});

function NewQuestionPage() {
  const navigate = useNavigate();
  const create = useCreateQuestion();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: "", answer: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await create.mutateAsync(values);
      if (result.duplicate) {
        toast.warning("Possible duplicate detected", {
          description: `Similarity score: ${(result.similarityScore * 100).toFixed(1)}%`,
        });
      } else {
        toast.success("Question created", {
          description: `Saved as #${result.question.id}`,
        });
      }
      reset();
      navigate({
        to: "/questions/$id",
        params: { id: String(result.question.id) },
      });
    } catch (err) {
      toast.error("Failed to create question", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Question"
        description="Submit a question and answer to the bank. Duplicate detection runs server-side."
        actions={
          <Button variant="outline" asChild>
            <Link to="/questions"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
        }
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Question details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input id="question" placeholder="e.g. Explain Java memory model" {...register("question")} />
              {errors.question && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" /> {errors.question.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                rows={10}
                placeholder="Write a clear, complete answer…"
                {...register("answer")}
              />
              {errors.answer && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" /> {errors.answer.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  <><CheckCircle2 className="mr-2 h-4 w-4" /> Save question</>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={() => reset()}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
