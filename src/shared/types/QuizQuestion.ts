import { Quiz } from "./Quiz";
import { QuizAnswer } from "./QuizAnswer";

export interface QuizQuestion {
  id: string;
  question: string;
  state: number;
  idQuiz: string;
  isQcm: boolean;
  quiz: Quiz;
  answers: QuizAnswer[];
}
