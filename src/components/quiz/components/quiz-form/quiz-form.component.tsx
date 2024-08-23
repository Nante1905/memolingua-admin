import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import RichText from "../../../../shared/components/rich-text/rich-text.component";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { Langage } from "../../../../shared/types/Langage";
import { Level } from "../../../../shared/types/Level";
import { Theme } from "../../../../shared/types/Theme";
import { quizSchema } from "../../helpers/quiz.helper";
import { createQuiz } from "../../services/quiz.service";
import "./quiz-form.component.scss";

interface QuizFormComponentProps {
  langs: Langage[];
  levels: Level[];
  themes: Theme[];
}

const QuizFormComponent: React.FC<QuizFormComponentProps> = (props) => {
  const form = useForm({
    resolver: zodResolver(quizSchema),
  });

  const quizCreateMutation = useMutation({
    mutationKey: ["quiz-create"],
    mutationFn: (data: unknown) => createQuiz(data),
    onSuccess(res: AxiosResponse<ApiResponse>) {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
    },
    onError(err: AxiosError<ApiResponse>) {
      enqueueSnackbar({ message: err.response?.data.error, variant: "error" });
    },
  });

  const selectedSource = form.watch("sourceLanguage");
  const selectedTarget = form.watch("targetLanguage");

  const onSubmit = (data: unknown) => {
    console.log(data);
    quizCreateMutation.mutate(data);
  };

  return (
    <div className="quiz-form">
      <form className="form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="form-input">
          <Controller
            control={form.control}
            name="title"
            render={({ fieldState }) => (
              <TextField
                label="Titre"
                {...form.register("title")}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div className="form-input">
          <FormControl>
            <Controller
              control={form.control}
              name={`description`}
              render={({ field, fieldState }) => (
                <>
                  <RichText
                    label="Description"
                    {...field}
                    onContentChange={(content: string) =>
                      field.onChange(content)
                    }
                    className={fieldState.error ? "error" : ""}
                  />
                  {fieldState.error && (
                    <FormHelperText sx={{ color: "red" }}>
                      {fieldState.error?.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </FormControl>
        </div>
        <div className="form-input">
          <Controller
            name="idLanguageSource"
            control={form.control}
            //   defaultValue={props.user?.gender}
            render={({ field: { onChange, value }, fieldState }) => (
              <FormControl className="form-control">
                <InputLabel>Langue source</InputLabel>
                <Select
                  label="Langue source"
                  style={{
                    width: "100%",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(event: any) => {
                    // setSourceCode(
                    //   props.langs.find((e) => e.id == event.target.value)
                    //     ?.code as string
                    // );
                    onChange(event);
                  }}
                  value={value}
                  error={!!fieldState.error}
                >
                  {props.langs
                    ?.filter((l) => l.id != selectedTarget)
                    ?.map((e, index) => (
                      <MenuItem key={`selected-source-${index}`} value={e.id}>
                        {e.label}
                      </MenuItem>
                    ))}
                </Select>
                {fieldState.error && (
                  <FormHelperText sx={{ color: "red" }}>
                    {fieldState.error?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className="form-input">
          <Controller
            name="idLanguageTarget"
            control={form.control}
            //   defaultValue={props.user?.gender}
            render={({ field: { onChange, value }, fieldState }) => (
              <FormControl className="form-control">
                <InputLabel>Langue du cours</InputLabel>
                <Select
                  label="Langue du cours"
                  style={{
                    width: "100%",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(event: any) => {
                    // setTargetCode(
                    //   props.langs.find((e) => e.id == event.target.value)
                    //     ?.code as string
                    // );
                    onChange(event);
                  }}
                  value={value}
                  error={!!fieldState.error}
                >
                  {props.langs
                    ?.filter((l) => l.id != selectedSource)
                    ?.map((e, index) => (
                      <MenuItem key={`selected-target-${index}`} value={e.id}>
                        {e.label}
                      </MenuItem>
                    ))}
                </Select>
                {fieldState.error && (
                  <FormHelperText sx={{ color: "red" }}>
                    {fieldState.error?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className="form-input">
          <Controller
            name="idLevel"
            control={form.control}
            //   defaultValue={props.user?.gender}
            render={({ field: { onChange, value }, fieldState }) => (
              <FormControl className="form-control">
                <InputLabel>Level</InputLabel>
                <Select
                  label="Level"
                  style={{
                    width: "100%",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(event: any) => {
                    // setTargetCode(
                    //   props.langs.find((e) => e.id == event.target.value)
                    //     ?.code as string
                    // );
                    onChange(event);
                  }}
                  value={value}
                  error={!!fieldState.error}
                >
                  {props.levels?.map((e, index) => (
                    <MenuItem key={`selected-target-${index}`} value={e.id}>
                      {e.label}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && (
                  <FormHelperText sx={{ color: "red" }}>
                    {fieldState.error?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className="form-input">
          <Controller
            name="idTheme"
            control={form.control}
            //   defaultValue={props.user?.gender}
            render={({ field: { onChange, value }, fieldState }) => (
              <FormControl className="form-control">
                <InputLabel>Theme</InputLabel>
                <Select
                  label="Theme"
                  style={{
                    width: "100%",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(event: any) => {
                    // setTargetCode(
                    //   props.langs.find((e) => e.id == event.target.value)
                    //     ?.code as string
                    // );
                    onChange(event);
                  }}
                  value={value}
                  error={!!fieldState.error}
                >
                  {props.themes?.map((e, index) => (
                    <MenuItem key={`selected-target-${index}`} value={e.id}>
                      {e.label}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && (
                  <FormHelperText sx={{ color: "red" }}>
                    {fieldState.error?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className="form-input">
          <Button variant="contained" type="submit">
            Creer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuizFormComponent;
