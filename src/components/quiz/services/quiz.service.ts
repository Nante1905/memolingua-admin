import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Paginated } from "../../../shared/types/Paginated";

export const findAllQuizWithNoQuestion = () => http.get("/quizs/no-question");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addQuestionToQuiz = (data: any) =>
  http.post("/admin/quizs/add-question", data);

export const createQuiz = (data: unknown) => http.post("/admin/quizs", data);
export const updateQuiz = (id: string, data: unknown) =>
  http.put(`/admin/quizs/${id}`, data);
export const findAllQuizs = (
  page: number,
  pageSize: number,
  search: string = "",
  sortField: string = "",
  sortMode: string = ""
) =>
  http.get(
    `/admin/quizs?page=${page}&limit=${pageSize}&search=${search}&sortField=${sortField}&sortMode=${sortMode}`
  );

export const findQuizById = (id: string) => http.get(`/admin/quizs/${id}`);

export const findAllQuizsSelect = ({ pageParam = 1 }) =>
  http.get<ApiResponse<Paginated<any>>>(`/admin/quizs?page=${pageParam}`);

export const findAllQuestionsSelect = ({ pageParam = 1 }) =>
  http.get<ApiResponse<Paginated<any>>>(
    `/admin/questions?page=${pageParam}&limit=8`
  );

export const findAllQuestions = (
  page: number,
  pageSize: number,
  idQuiz?: string
) =>
  http.get(
    `/admin/questions?page=${page}&idQuiz=${idQuiz ?? ""}&limit=${pageSize}`
  );

export const findAllAnswers = (page: number, idQuestion?: string) =>
  http.get(`/admin/quizs/answers?page=${page}&id=${idQuestion ?? ""}`);

export const findAllLangs = () => http.get("/langs");
export const findPaginatedLangs = (page: number, limit: number) =>
  http.get(`/langs?page=${page}&limit=${limit}`);
export const findAllThemes = () => http.get("/themes");

export const findAllLevels = () => http.get("/levels");

export const deleteQuiz = (id: string) => http.delete(`/admin/quizs/${id}`);

export const findQuestionById = (id: string) =>
  http.get(`/admin/questions/${id}`);

export const updateQuestion = (id: string, data: object) =>
  http.put(`/admin/questions/${id}`, data);

export const findAnswerById = (id: string) => http.get(`/admin/answers/${id}`);
export const updateAnswer = (id: string, answer: object) =>
  http.put(`/admin/answers/${id}`, answer);

export const deleteQuestion = (id: string) =>
  http.delete(`/admin/questions/${id}`);
