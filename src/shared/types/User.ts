import { Role } from "./Role";

export interface User {
  id: string;
  lastname: string;
  firstname: string;
  gender: number;
  birthday: Date;
  email: string;
  role: Role;
}
