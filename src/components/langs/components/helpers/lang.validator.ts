import { z } from "zod";
import { strRequired } from "../../../../shared/constants/validator.constant";

export const langSchema = z.object({
  label: strRequired,
  code: strRequired,
});
