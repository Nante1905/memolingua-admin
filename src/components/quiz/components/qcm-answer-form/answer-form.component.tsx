/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Radio, TextField } from "@mui/material";
import React, { useMemo } from "react";
import {
  Controller,
  FieldValues,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import "./answer-form.component.scss";

interface AnswerComponentProps {
  field: Record<"id", string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<FieldValues, any, undefined>;
  answersFields: UseFieldArrayReturn<
    FieldValues,
    `questions.${string}.answers`,
    "id"
  >;
  index: string;
  questionIndex: string;
}

const AnswerComponent: React.FC<AnswerComponentProps> = (props) => {
  const radioValue = useMemo(() => props.index, [props.index]);

  return (
    <div className="qcm-answer">
      <div className="qcm-answer-form-input">
        <Radio value={radioValue} />
        <div className="answer-input">
          <Controller
            control={props.form.control}
            name={`questions.${props.questionIndex}.answers.${props.index}.answer`}
            render={({ field, fieldState }) => (
              <TextField
                label="Réponse"
                {...field}
                className="answer-input"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {props.index != "0" && (
            <Button
              onClick={() => props.answersFields.remove(Number(props.index))}
              color="error"
            >
              Suppr
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerComponent;
