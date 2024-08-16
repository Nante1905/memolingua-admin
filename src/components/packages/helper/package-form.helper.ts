/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { formErrors } from "../../../shared/constants/form-errors.constant";
import {
  ALLOWED_IMG_EXT,
  MAX_IMG_SIZE,
} from "../../../shared/constants/media.constant";

const cardSchema = z.object({
  recto: z.string().min(1, formErrors.fr.required),
  verso: z.string().min(1, formErrors.fr.required),
});

export const AddCardSchema = z.object({
  cards: z.array(cardSchema),
});

export const PackageSchema = z.object({
  title: z.string().min(1, formErrors.fr.required),
  lang: z.string().min(1, formErrors.fr.required),
  theme: z.string().min(1, formErrors.fr.required),
  // img: z.any().refine((file: string) => file != undefined && file != "", {
  //   message: formErrors.fr.required,
  // }),
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
