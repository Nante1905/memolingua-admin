/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormControl, FormHelperText, RadioGroup } from "@mui/material";
import React from "react";
import {
  Controller,
  FieldValues,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import RichText from "../../../../shared/components/rich-text/rich-text.component";
import AnswerComponent from "../qcm-answer-form/answer-form.component";
import RadioComponent from "../radio-text/radio.component";
import "./question-form.component.scss";

interface QuestionFormComponentProps {
  field: Record<"id", string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<FieldValues, any, undefined>;
  questionsFields: any;
  index: string;
}

const QuestionFormComponent: React.FC<QuestionFormComponentProps> = (props) => {
  const isQcm = props.form.watch(`questions.${props.index}.isQcm`);
  const answersFields = useFieldArray({
    name: `questions.${props.index}.answers`,
    control: props.form.control,
  });

  return (
    <div className="question-form">
      <div className="left">
        <div className="form-input">
          <FormControl>
            <Controller
              control={props.form.control}
              name={`questions.${props.index}.question`}
              render={({ field, fieldState }) => (
                <>
                  <RichText
                    label="Question"
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
            {/* {!!props.form.formState.errors[
              `questions.${props.index}.question`
            ] && (
              <FormHelperText>
                {
                  props.form.formState.errors[
                    `questions.${props.index}.question`
                  ]?.message as string
                }
              </FormHelperText>
            )} */}
          </FormControl>
        </div>
        <div className="form-input">
          <div className="answers">
            <Controller
              control={props.form.control}
              name={`questions.${props.index}.isQcm`}
              render={({ field, fieldState }) => (
                <RadioGroup
                  {...field}
                  onChange={(_e, v) => {
                    field.onChange(v);
                    if (answersFields.fields.length == 0) {
                      answersFields.append({
                        answer: "",
                      });
                    }
                  }}
                  aria-labelledby="demo-error-radios"
                >
                  <RadioComponent value="1" text="QCM" />
                  <RadioComponent value="0" text="Réponse exact" />
                  {!!fieldState.error && (
                    <FormHelperText sx={{ color: "red" }}>
                      {fieldState.error?.message as string}
                    </FormHelperText>
                  )}
                </RadioGroup>
              )}
            ></Controller>
          </div>
        </div>
      </div>
      <div className="right">
        <Controller
          control={props.form.control}
          name={`questions.${props.index}.correctAns`}
          render={({ field }) => (
            <RadioGroup
              onChange={(_, value) => {
                field.onChange(value);
              }}
            >
              {answersFields.fields.map((e, i) => (
                <AnswerComponent
                  answersFields={answersFields}
                  key={e.id}
                  field={e}
                  questionIndex={props.index}
                  index={i.toString()}
                  form={props.form}
                />
              ))}
            </RadioGroup>
          )}
        />
        {!!(props.form.formState.errors["questions"] as any)?.[props.index]
          ?.root && (
          <FormHelperText sx={{ color: "red" }}>
            {
              (props.form.formState.errors["questions"] as any)?.[props.index]
                ?.root?.message as string
            }
          </FormHelperText>
        )}
        {!!(props.form.formState.errors["questions"] as any)?.[props.index]
          ?.correctAns && (
          <FormHelperText sx={{ color: "red" }}>
            {
              (props.form.formState.errors["questions"] as any)?.[props.index]
                ?.correctAns?.message as string
            }
          </FormHelperText>
        )}
        {!!(props.form.formState.errors["questions"] as any)?.[props.index]
          ?.answers?.root && (
          <FormHelperText sx={{ color: "red" }}>
            {
              (props.form.formState.errors["questions"] as any)?.[props.index]
                ?.answers?.root?.message as string
            }
          </FormHelperText>
        )}
        {Boolean(Number(isQcm)) == true && (
          <Button
            onClick={() => {
              answersFields.append({
                answer: "",
                isCorrect: false,
              });
            }}
          >
            Ajouter reponse
          </Button>
        )}
        <Button
          color="error"
          onClick={() => props.questionsFields.remove(Number(props.index))}
        >
          Supprimer la question
        </Button>
      </div>
    </div>
  );
};

export default QuestionFormComponent;
