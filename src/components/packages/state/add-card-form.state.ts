export interface AddCardError {
  numero: number;
  errors: string[];
}

export interface AddCardFormState {
  error?: AddCardError[];
}

export const initialAddCardFormState: AddCardFormState = {
  error: undefined,
};
