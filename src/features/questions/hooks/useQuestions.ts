import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionsService } from "@/api/services/questions.service";
import type {
  CreateQuestionRequest,
  QuestionCategory,
} from "@/types/question";

export const questionKeys = {
  all: ["questions"] as const,
  list: (category?: QuestionCategory) =>
    [...questionKeys.all, "list", category ?? "all"] as const,
  detail: (id: number) => [...questionKeys.all, "detail", id] as const,
  similarity: (q: string) => [...questionKeys.all, "similarity", q] as const,
};

export function useQuestionsList(category?: QuestionCategory) {
  return useQuery({
    queryKey: questionKeys.list(category),
    queryFn: () => questionsService.list(category),
  });
}

export function useQuestion(id: number) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionsService.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionRequest) =>
      questionsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}

export function useSimilarityCheck() {
  return useMutation({
    mutationFn: (question: string) => questionsService.checkSimilarity(question),
  });
}
