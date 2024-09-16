export interface User {
  lastname: string;
  firstname: string;
  role: {
    id: string;
    label: string;
    code: string;
  };
}
