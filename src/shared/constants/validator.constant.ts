import { z } from "zod";
import { formErrors } from "./form-errors.constant";

export const strRequired = z
  .string({ required_error: formErrors["fr"].required })
  .min(1, formErrors["fr"].required);

export const richTextRequired = strRequired.refine(
  (value) => !emptyRichTextRegex.test(value),
  {
    message: formErrors["fr"].required,
  }
);

export const numberRequired = (min: number, max: number) =>
  z.coerce
    .number({
      required_error: formErrors["fr"].required,
      invalid_type_error: formErrors["fr"].typeError("nombre"),
    })
    .gte(min, formErrors["fr"].greaterOrEqualThan(min))
    .lte(max, formErrors["fr"].lessOrEqualThan(min));

export const emptyRichTextRegex =
  /^\s*(<p>\s*<\/p>|<h[1-6]>\s*<\/h[1-6]>|<ul>\s*(<li>\s*<\/li>\s*)*<\/ul>|<ul>\s*(<li>\s*(<p>\s*<\/p>)\s*<\/li>\s*)*<\/ul>|\s*)*$/;

export const codeLangageRegex = /^[a-zA-Z]{2}-[a-zA-Z]{2}$/;
