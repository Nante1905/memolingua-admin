import { z } from "zod";
import { strRequired } from "../../../shared/constants/validator.constant";
import { mediaValidationSchema } from "../../../shared/helpers/fileupload.helper";

export const langSchema = z.object({
  label: strRequired,
  code: strRequired,
});

export const langImportSchema = z.object({
  file: mediaValidationSchema
    .required()
    .refine((data) => data.contentType == "text/csv", {
      message: "Type de fichier invalide",
    }),
});
