import { QuizQuestion } from "./QuizQuestion";

export interface QuizAnswer {
  id: string;
  answer: string;
  isCorrect: boolean;
  state: number;
  idQuestion: string;
  question: QuizQuestion;
}
