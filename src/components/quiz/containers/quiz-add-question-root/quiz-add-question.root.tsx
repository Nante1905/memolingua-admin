/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import QuestionFormComponent from "../../components/question-form/question-form.component";
import { addQuestionSchema } from "../../helpers/quiz.helper";
import {
  addQuestionToQuiz,
  findAllQuizWithNoQuestion,
} from "../../services/quiz.service";
import "./quiz-add-question.root.scss";

const QuizAddQuestionRoot = () => {
  const form = useForm({
    resolver: zodResolver(addQuestionSchema),
  });

  const quizQuery = useQuery({
    queryKey: ["quiz"],
    queryFn: findAllQuizWithNoQuestion,
  });
  const quizMutation = useMutation({
    mutationKey: ["quiz-add-question"],
    mutationFn: (data) => addQuestionToQuiz(data),
    onSuccess: () => {
      enqueueSnackbar({ message: "Question(s) ajoutés", variant: "success" });
      form.reset();
    },
    onError: (e) => {
      enqueueSnackbar({ message: e.message, variant: "error" });
    },
  });

  const questionsFields = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = (data: any) => {
    quizMutation.mutate(data);
  };

  return (
    <div className="quiz-add-question">
      <div className="header">
        <h1>Ajouter des questions aux quizs</h1>
      </div>
      <div className="form">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="form-input">
            <AppLoaderComponent loading={quizQuery.isFetching}>
              <FormControl fullWidth error={!!form.formState.errors["idQuiz"]}>
                <InputLabel>Quiz</InputLabel>
                <Controller
                  name="idQuiz"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Quiz"
                      style={{
                        width: "100%",
                      }}
                    >
                      {quizQuery.data?.data.payload?.map(
                        (e: any, i: number) => (
                          <MenuItem
                            value={e.id}
                            key={e.id}
                            defaultChecked={i === 0}
                          >
                            {e.id} - {e.title}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
                {!!form.formState.errors["idQuiz"] && (
                  <FormHelperText>
                    {form.formState.errors["idQuiz"]?.message as string}
                  </FormHelperText>
                )}
              </FormControl>
            </AppLoaderComponent>
          </div>
          <br />
          <strong>
            <u>Questions</u>{" "}
          </strong>
          {!!form.formState.errors["questions"] && (
            <p style={{ color: "red" }}>
              {form.formState.errors["questions"]?.message as string}
            </p>
          )}
          <br />
          <br />
          <div className="questions">
            {questionsFields.fields.map((e, i) => (
              <QuestionFormComponent
                key={e.id}
                form={form}
                field={e}
                index={i.toString()}
                questionsFields={questionsFields}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              questionsFields.append({
                question: "",
                isQcm: false,
                answers: [],
              });
            }}
          >
            Ajouter question
          </Button>
          <br />
          <Button type="submit" variant="contained" className="btn-sub">
            Valider
          </Button>
        </form>
      </div>
    </div>
  );
};

export default QuizAddQuestionRoot;
