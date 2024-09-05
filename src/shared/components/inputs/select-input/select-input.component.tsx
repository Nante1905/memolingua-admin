import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../../../types/FormInputProps";
import AppLoaderComponent from "../../loader/app-loader.component";

interface SelectInputComponentProps extends FormInputProps {
  items: any[];
  loading: boolean;
  valueGetter: (item: any) => string;
  labelGetter: (item: any) => string;
}

const SelectInputComponent: FC<SelectInputComponentProps> = (props) => {
  return (
    <div className="form-input">
      <AppLoaderComponent loading={props.loading}>
        <Controller
          name={props.name}
          control={props.control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel>{props.label}</InputLabel>
              <Select
                label={props.label}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {props.items?.map((element, index) => (
                  <MenuItem value={props.valueGetter(element)} key={`${index}`}>
                    {props.labelGetter(element)}
                  </MenuItem>
                ))}
              </Select>
              {!!fieldState.error && (
                <FormHelperText>
                  {fieldState.error?.message as string}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default SelectInputComponent;
