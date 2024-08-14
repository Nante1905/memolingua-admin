/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  ok: boolean;
  payload: T;
  message?: string;
  error?: string | string[];
}
