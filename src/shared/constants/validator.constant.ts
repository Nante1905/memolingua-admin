import { z } from "zod";
import { formErrors } from "./form-errors.constant";

export const strRequired = z
  .string({ required_error: formErrors["fr"].required })
  .min(1, formErrors["fr"].required);
export const numberRequired = (min: number, max: number) =>
  z.coerce
    .number({
      required_error: formErrors["fr"].required,
      invalid_type_error: formErrors["fr"].typeError("nombre"),
    })
    .gte(min, formErrors["fr"].greaterOrEqualThan(min))
    .lte(max, formErrors["fr"].lessOrEqualThan(min));
