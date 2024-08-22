import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const findAllQuizWithNoQuestion = () => http.get("/quizs/no-question");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addQuestionToQuiz = (data: any) =>
  http.post("/quizs/add-question", data);
