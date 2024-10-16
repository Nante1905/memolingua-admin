import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { FC, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import InputFileComponent from "../../../../shared/components/inputs/input-file/input-file.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import RichText from "../../../../shared/components/rich-text/rich-text.component";
import { API_BASE_URL } from "../../../../shared/constants/api.constant";
import { QuizQuestion } from "../../../../shared/types/QuizQuestion";
import { questionUpdateSchema } from "../../helpers/quiz.helper";
import "./question-form-update.component.scss";

interface QuestionFormUpdateProps {
  title: string;
  defaultValues: Partial<QuizQuestion>;
  loading: boolean;
  onSubmit: (data: any) => void;
}

const QuestionFormUpdate: FC<QuestionFormUpdateProps> = (props) => {
  const form = useForm<any>({
    defaultValues: { question: props.defaultValues.question },
    resolver: zodResolver(questionUpdateSchema),
  });

  const img = useMemo((): string | undefined => {
    return props.defaultValues.medias?.find((m) => m.mediaType === "IMG")
      ?.mediaPath;
  }, [props.defaultValues]);

  const vid = useMemo((): string | undefined => {
    return props.defaultValues.medias?.find((m) => m.mediaType === "VID")
      ?.mediaPath;
  }, [props.defaultValues]);

  return (
    <div className="question-form-update">
      <form
        onSubmit={form.handleSubmit((data) => {
          props.onSubmit(data);
        })}
      >
        <div className="form">
          <h1>{props?.title}</h1>
          <div className="form-input">
            <FormControl>
              <Controller
                control={form.control}
                name={`question`}
                render={({ field, fieldState, formState }) => (
                  <>
                    <RichText
                      label="Question"
                      {...field}
                      onContentChange={(content: string) =>
                        field.onChange(content)
                      }
                      className={fieldState.error ? "error" : ""}
                      defaultValue={formState.defaultValues?.[field.name]}
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
            <InputFileComponent
              form={form}
              control={form.control}
              name={"img"}
              label={"Modifier ou ajouter une image"}
            />
            {img && (
              <Link to={`${API_BASE_URL}${img as string}`} target="_blank">
                <Button>Voir l'ancienne</Button>
              </Link>
            )}
            <FormControlLabel
              {...form.register("deleteImg")}
              control={<Checkbox />}
              label="Supprimer l'image existant"
              sx={{
                fontSize: ".5rem",
              }}
              disabled={!img}
            />
          </div>
          <div className="form-input">
            <InputFileComponent
              form={form}
              control={form.control}
              name={"video"}
              label={"Modifier ou ajouter une Video"}
            />
            {vid && (
              <Link
                to={`${API_BASE_URL}${vid as string}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>Voir l'ancienne</Button>
              </Link>
            )}
            <FormControlLabel
              {...form.register("deleteVid")}
              control={<Checkbox />}
              label="Supprimer la vidéo existant"
              sx={{
                fontSize: ".5rem",
              }}
              disabled={!vid}
            />
          </div>

          <div className="form-input">
            <Button type="submit" variant="contained">
              <AppLoaderComponent color="#000" loading={props.loading}>
                Modifier
              </AppLoaderComponent>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionFormUpdate;
