import { z } from "zod";
import { formErrors } from "../../../shared/constants/form-errors.constant";

export const answerSchema = z.object({
  answer: z.string().min(1),
  // isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    question: z.string().min(1, formErrors["fr"].required),
    isQcm: z.any(),
    correctAns: z.string({
      message: "Please provide at leat 1 correct answers",
    }),
    answers: z
      .array(answerSchema)
      .nonempty({ message: "Provide at least 1 element" }),
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
