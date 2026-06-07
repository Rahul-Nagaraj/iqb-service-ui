export const QUESTION_CATEGORIES = [
  "JAVA",
  "SPRING",
  "DSA",
  "DATABASE",
  "SYSTEM_DESIGN",
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export interface QuestionResponse {
  id: number;
  question: string;
  answer: string;
  category: QuestionCategory | null;
  frequencyCount: number;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionRequest {
  question: string;
  answer: string;
}

export interface SaveQuestionResponse {
  duplicate: boolean;
  similarityScore: number;
  question: QuestionResponse;
}

export interface MatchResponse {
  id: number;
  question: string;
  similarityScore: number;
}

export interface SimilarityResponse {
  inputQuestion: string;
  embedding: number[];
  bestMatch: MatchResponse | null;
}
