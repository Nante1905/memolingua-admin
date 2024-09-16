import { z } from "zod";
import { formErrors } from "../../../shared/constants/form-errors.constant";
import {
  ALLOWED_IMG_EXT,
  ALLOWED_VID_EXT,
} from "../../../shared/constants/media.constant";
import {
  richTextRequired,
  strRequired,
} from "../../../shared/constants/validator.constant";

export const answerSchema = z.object({
  answer: strRequired,
  isCorrect: z.coerce.boolean(),
});

const mediaValidationSchema = z
  .object({
    blob: z.string().optional(),
    fileName: z.string().optional(),
    size: z.number().optional(),
    contentType: z.string().optional(),
  })
  .optional();

export const questionSchema = z
  .object({
    question: richTextRequired,
    isQcm: z.any(),
    correctAns: z.string({
      message: "Please provide at leat 1 correct answers",
    }),
    answers: z
      .array(answerSchema)
      .nonempty({ message: "Provide at least 1 element" }),
    img: mediaValidationSchema
      .refine(
        (img) => {
          if (img?.size && img?.size > 3500000) return false;
          else return true;
        },
        { message: formErrors["fr"].maxSize(3, "Mo") }
      )
      .refine(
        (img) => {
          if (
            img &&
            !ALLOWED_IMG_EXT.includes(img?.fileName?.split(".").pop() as string)
          )
            return false;
          else return true;
        },
        { message: formErrors["fr"].unallowedType }
      ),
    video: mediaValidationSchema
      .refine(
        (vid) => {
          if (vid?.size && vid?.size > 6000000) return false;
          else return true;
        },
        { message: formErrors["fr"].maxSize(6, "Mo") }
      )
      .refine(
        (vid) => {
          if (
            vid &&
            !ALLOWED_VID_EXT.includes(vid?.fileName?.split(".").pop() as string)
          )
            return false;
          else return true;
        },
        { message: formErrors["fr"].unallowedType }
      ),
  })
  .refine((arg) => {
    if (arg.isQcm == "1" && arg.answers.length <= 1) return false;
    else return true;
  }, "QCM must have at least 2 answers")
  .refine((arg) => {
    if (arg.isQcm == "0" && arg.answers.length > 1) return false;
    else return true;
  }, "No QCM question must have only one answer");

export const addQuestionSchema = z.object({
  idQuiz: z.string(),
  questions: z
    .array(questionSchema)
    .nonempty({ message: "Ajoutez des questions" }),
});

export const quizSchema = z.object({
  title: strRequired,
  description: strRequired,
  idLanguageSource: strRequired,
  idLanguageTarget: strRequired,
  idLevel: strRequired,
  idTheme: strRequired,
});

export const questionUpdateSchema = z.object({
  question: richTextRequired,
  deleteImg: z.coerce.boolean().optional(),
  deleteVid: z.coerce.boolean().optional(),
  img: mediaValidationSchema
    .refine(
      (img) => {
        if (img?.size && img?.size > 3500000) return false;
        else return true;
      },
      { message: formErrors["fr"].maxSize(3, "Mo") }
    )
    .refine(
      (img) => {
        if (
          img &&
          !ALLOWED_IMG_EXT.includes(img?.fileName?.split(".").pop() as string)
        )
          return false;
        else return true;
      },
      { message: formErrors["fr"].unallowedType }
    ),
  video: mediaValidationSchema
    .refine(
      (vid) => {
        if (vid?.size && vid?.size > 6000000) return false;
        else return true;
      },
      { message: formErrors["fr"].maxSize(6, "Mo") }
    )
    .refine(
      (vid) => {
        if (
          vid &&
          !ALLOWED_VID_EXT.includes(vid?.fileName?.split(".").pop() as string)
        )
          return false;
        else return true;
      },
      { message: formErrors["fr"].unallowedType }
    ),
});
