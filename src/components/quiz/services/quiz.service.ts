import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const findAllQuizWithNoQuestion = () => http.get("/quizs/no-question");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addQuestionToQuiz = (data: any) =>
  http.post("/quizs/add-question", data);

export const createQuiz = (data: unknown) => http.post("/quizs", data);

export const findAllLangs = () => http.get("/langs");
export const findAllThemes = () => http.get("/themes");
export const findAllLevels = () => http.get("/levels");
