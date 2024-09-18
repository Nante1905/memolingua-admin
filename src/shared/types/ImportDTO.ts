export interface ImportDTO {
  row: number;
  error?: string[];
}

export interface ImportValidationResult<T extends ImportDTO> {
  data: T[];
  error: number;
  correct: number;
}
