import { http } from "../client/httpClient";
import type {
  CreateQuestionRequest,
  QuestionCategory,
  QuestionResponse,
  SaveQuestionResponse,
  SimilarityResponse,
} from "@/types/question";

export const questionsService = {
  list: (category?: QuestionCategory) =>
    http.get<QuestionResponse[]>("/questions", {
      query: { category },
    }),

  getById: (id: number) => http.get<QuestionResponse>(`/questions/${id}`),

  create: (payload: CreateQuestionRequest) =>
    http.post<SaveQuestionResponse>("/questions", payload),

  checkSimilarity: (question: string) =>
    http.get<SimilarityResponse>("/questions/similarity", {
      query: { question },
    }),
};
