import { z } from "zod";
import { formErrors } from "../../../shared/constants/form-errors.constant";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: formErrors.fr.required,
    })
    .email(formErrors.fr.email),

  password: z.string().min(1, formErrors.fr.required),
});
