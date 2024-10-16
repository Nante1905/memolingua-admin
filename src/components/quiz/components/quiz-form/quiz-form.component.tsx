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
import React from "react";
import { Controller, useForm } from "react-hook-form";
import RichText from "../../../../shared/components/rich-text/rich-text.component";
import { Langage } from "../../../../shared/types/Langage";
import { Level } from "../../../../shared/types/Level";
import { Quiz } from "../../../../shared/types/Quiz";
import { Theme } from "../../../../shared/types/Theme";
import { quizSchema } from "../../helpers/quiz.helper";
import "./quiz-form.component.scss";

interface QuizFormComponentProps {
  langs: Langage[];
  levels: Level[];
  themes: Theme[];
  defaultValues?: Partial<Quiz>;
  title?: string;
  action?: string;
  onSubmit: (data: object) => void;
  update?: boolean;
}

const QuizFormComponent: React.FC<QuizFormComponentProps> = (props) => {
  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: { ...props.defaultValues },
  });

  const selectedSource = form.watch("idLanguageSource");
  const selectedTarget = form.watch("idLanguageTarget");

  return (
    <div className="quiz-form">
      <form className="form" onSubmit={form.handleSubmit(props.onSubmit)}>
        <h1>{props.title}</h1>
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
                // defaultValue={props.defaultValues?.title}
              />
            )}
          />
        </div>
        <div className="form-input">
          <FormControl>
            <Controller
              control={form.control}
              name={`description`}
              render={({ field, fieldState, formState }) => (
                <>
                  <RichText
                    label="Description"
                    {...field}
                    defaultValue={formState.defaultValues?.description}
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
                  // defaultValue={props.defaultValues?.idLanguageSource}
                  error={!!fieldState.error}
                  disabled={props.update ?? false}
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
                  // defaultValue={props.defaultValues?.idLanguageTarget}
                  value={value}
                  error={!!fieldState.error}
                  disabled={props.update ?? false}
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
            render={({ field: { onChange, value }, fieldState }) => (
              <FormControl className="form-control">
                <InputLabel>Niveau</InputLabel>
                <Select
                  label="Niveau"
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
                  // defaultValue={props.defaultValues?.idLevel}
                  value={value}
                  error={!!fieldState.error}
                  disabled={props.update ?? false}
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
                  disabled={props.update ?? false}

                  // defaultValue={props.defaultValues?.idTheme}
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
            {props.action}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuizFormComponent;
