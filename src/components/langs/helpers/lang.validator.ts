import { z } from "zod";
import {
  codeLangageRegex,
  strRequired,
} from "../../../shared/constants/validator.constant";

export const langSchema = z.object({
  label: strRequired,
  code: strRequired.refine((d) => codeLangageRegex.test(d), {
    message: "Format invalide",
  }),
});
