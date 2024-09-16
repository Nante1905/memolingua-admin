import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Paginated } from "../../../shared/types/Paginated";

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
export const findAllQuizsSelect = ({ pageParam = 1 }) =>
  http.get<ApiResponse<Paginated<any>>>(`/admin/quizs?page=${pageParam}`);

export const findAllQuestionsSelect = ({ pageParam = 1 }) =>
  http.get<ApiResponse<Paginated<any>>>(
    `/admin/quizs/questions?page=${pageParam}&limit=2`
  );

export const findAllQuestions = (page: number, idQuiz?: string) =>
  http.get(`/admin/quizs/questions?page=${page}&idQuiz=${idQuiz ?? ""}`);
export const findAllAnswers = (page: number, idQuestion?: string) =>
  http.get(`/admin/quizs/answers?page=${page}&id=${idQuestion ?? ""}`);
export const findAllLangs = () => http.get("/langs");
export const findPaginatedLangs = (page: number, limit: number) =>
  http.get(`/langs?page=${page}&limit=${limit}`);
export const findAllThemes = () => http.get("/themes");
export const findAllLevels = () => http.get("/levels");
