import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RichText from "../../../../shared/components/rich-text/rich-text.component";
import { Langage } from "../../../../shared/types/Langage";
import "./quiz-form.component.scss";

interface QuizFormComponentProps {
  langs: Langage[];
}

const QuizFormComponent: React.FC<QuizFormComponentProps> = (props) => {
  const form = useForm();

  const selectedSource = form.watch("sourceLanguage");
  const selectedTarget = form.watch("targetLanguage");

  const [sourceCode, setSourceCode] = useState("");
  const [targetCode, setTargetCode] = useState("");

  return (
    <div className="quiz-form">
      <form className="form">
        <div className="info">
          <div className="left">
            <div className="form-input">
              <TextField label="Titre" />
            </div>
            <div className="form-input">
              <FormControl>
                <Controller
                  control={form.control}
                  name={``}
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
          </div>
          <div className="right">
            <div className="form-input">
              <Controller
                name="sourceLanguage"
                control={form.control}
                //   defaultValue={props.user?.gender}
                render={({ field: { onChange, value } }) => (
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
                    >
                      {props.langs
                        ?.filter((l) => l.id != selectedTarget)
                        ?.map((e, index) => (
                          <MenuItem
                            key={`selected-source-${index}`}
                            value={e.id}
                          >
                            {e.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
            <div className="form-input">
              <Controller
                name="targetLanguage"
                control={form.control}
                //   defaultValue={props.user?.gender}
                render={({ field: { onChange, value } }) => (
                  <FormControl className="form-control">
                    <InputLabel>Langue du cours</InputLabel>
                    <Select
                      label="Langue du cours"
                      style={{
                        width: "100%",
                      }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(event: any) => {
                        setTargetCode(
                          props.langs.find((e) => e.id == event.target.value)
                            ?.code as string
                        );
                        onChange(event);
                      }}
                      value={value}
                    >
                      {props.langs
                        ?.filter((l) => l.id != selectedSource)
                        ?.map((e, index) => (
                          <MenuItem
                            key={`selected-target-${index}`}
                            value={e.id}
                          >
                            {e.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuizFormComponent;
