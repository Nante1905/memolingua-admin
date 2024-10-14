import { z } from "zod";
import { formErrors } from "../constants/form-errors.constant";
import { toBase64 } from "../services/upload/fileUpload.service";

export const mediaValidationSchema = z.object(
  {
    blob: z.string().min(1, formErrors.fr.required),
    fileName: z.string().min(1, formErrors.fr.required),
    size: z.number().min(1, formErrors.fr.required),
    contentType: z.string().min(1, formErrors.fr.required),
  },
  { required_error: "Fichier obligatoire" }
);

export const uploadFile = async (file: File) => {
  const fileData = await toBase64(file);
  return {
    preview: URL.createObjectURL(file),
    file: {
      fileName: file.name,
      blob: fileData,
      contentType: file.type,
      size: file.size,
    },
  };
};

export const importCSVSchema = z.object({
  file: mediaValidationSchema.required().refine(
    (data) => {
      console.log(data);

      return (
        data.contentType == "text/csv" ||
        data.contentType == "application/vnd.ms-excel"
      );
    },
    {
      message: "Type de fichier invalide",
    }
  ),
});
