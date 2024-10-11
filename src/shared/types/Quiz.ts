import { QuizQuestion } from "./QuizQuestion";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  state: number;
  creationDate: Date;
  idLevel: string;
  idTheme: string;
  imgPath: string;
  questions: QuizQuestion[];
  theme: string;
  level: string;
  nbQuestion: number;
  finished: boolean;
  idLanguageSource: string;
  idLanguageTarget: string;
}
