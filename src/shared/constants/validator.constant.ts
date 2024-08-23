import { z } from "zod";
import { formErrors } from "./form-errors.constant";

export const strRequired = z.string().min(1, formErrors["fr"].required);
