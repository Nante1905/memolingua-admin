import { Quiz } from "./Quiz";
import { QuizAnswer } from "./QuizAnswer";
import { QuizQuestionMedia } from "./QuizQuestionMedia";

export interface QuizQuestion {
  id: string;
  question: string;
  state: number;
  idQuiz: string;
  isQcm: boolean;
  quiz: Quiz;
  medias: QuizQuestionMedia[];
  answers: QuizAnswer[];
}
