import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const findAllQuizWithNoQuestion = () => http.get("/quizs/no-question");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addQuestionToQuiz = (data: any) =>
  http.post("/admin/quizs/add-question", data);

export const createQuiz = (data: unknown) => http.post("/admin/quizs", data);
export const findAllQuizs = (
  page: number,
  pageSize: number,
  search: string = ""
) => http.get(`/admin/quizs?page=${page}&limit=${pageSize}&search=${search}`);

export const findAllLangs = () => http.get("/langs");
export const findAllThemes = () => http.get("/themes");
export const findAllLevels = () => http.get("/levels");
