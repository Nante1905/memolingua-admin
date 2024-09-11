/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { formErrors } from "../../../shared/constants/form-errors.constant";
import {
  ALLOWED_IMG_EXT,
  MAX_IMG_SIZE,
} from "../../../shared/constants/media.constant";
import { mediaValidationSchema } from "../../../shared/helpers/fileupload.helper";

const cardSchema = z.object({
  recto: z.string().min(1, formErrors.fr.required),
  verso: z.string().min(1, formErrors.fr.required),
});

export const AddCardSchema = z.object({
  cards: z.array(cardSchema),
});

export const cardMediaValidator = z.object({
  preview: z.string().optional(),
  media: mediaValidationSchema,
});

export const PackageSchema = z.object({
  title: z.string().min(1, formErrors.fr.required),
  course: z
    .string({ required_error: formErrors.fr.required })
    .min(1, formErrors.fr.required),
  theme: z
    .string({ required_error: formErrors.fr.required })
    .min(1, formErrors.fr.required),
  img: cardMediaValidator
    .required({ media: true })
    .refine(
      (img) => {
        if (img?.media) {
          return img.media?.size < MAX_IMG_SIZE;
        }
        return true;
      },
      {
        message: formErrors["fr"].maxSize(MAX_IMG_SIZE / 1000000, "Mo"),
      }
    )
    .refine(
      (img) => {
        if (img?.media) {
          return ALLOWED_IMG_EXT.includes(
            img.media?.fileName.split(".").pop() as string
          );
        }
        return true;
      },
      { message: formErrors["fr"].unallowedType }
    ),
});

export const imgValidation = (file: File) => {
  console.log(file, file.size > MAX_IMG_SIZE);
  if (!file) {
    return formErrors.fr.required;
  }
  if (file.size == 0) {
    return formErrors.fr.required;
  }
  if (file.size > MAX_IMG_SIZE) {
    return formErrors.fr.maxSize(MAX_IMG_SIZE / 1000000, "Mo");
  }
  if (
    ALLOWED_IMG_EXT.includes(file?.name?.split(".").pop() as string) == false
  ) {
    return formErrors.fr.enum(ALLOWED_IMG_EXT.join(" ou "));
  }
  return "";
};
