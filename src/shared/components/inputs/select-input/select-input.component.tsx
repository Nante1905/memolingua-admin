import {
  Button,
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
  paginated?: boolean;
  onLoadMore?: () => void;
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
                {props.items?.flat()?.map((element, index) => (
                  <MenuItem value={props.valueGetter(element)} key={`${index}`}>
                    {props.labelGetter(element)}
                  </MenuItem>
                ))}
                {props.paginated && (
                  <Button
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      if (props.onLoadMore) props.onLoadMore();
                    }}
                  >
                    Load more
                  </Button>
                )}
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
