import { FormControl, TextField } from "@mui/material";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../../../types/FormInputProps";

interface InputComponentProps extends FormInputProps {
  type: "text" | "number";
}

const InputComponent: FC<InputComponentProps> = (props) => {
  return (
    <div className={`form-input ${props.className ?? ""}`}>
      <FormControl fullWidth>
        <Controller
          control={props?.control}
          name={props.name}
          render={({ field, fieldState, formState }) => (
            <TextField
              onChange={(e) =>
                field.onChange(
                  props.type === "number"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              defaultValue={formState.defaultValues?.[props.name]}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              type={props.type}
              label={props.label}
            />
          )}
        />
      </FormControl>
    </div>
  );
};

export default InputComponent;
