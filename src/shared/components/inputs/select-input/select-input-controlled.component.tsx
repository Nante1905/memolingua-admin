import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FC } from "react";
import AppLoaderComponent from "../../loader/app-loader.component";

interface SelectInputControlledComponentProps {
  items: any[];
  loading: boolean;
  valueGetter: (item: any) => string;
  labelGetter: (item: any) => string;
  paginated?: boolean;
  label: string;
  onLoadMore?: () => void;
  onValueChange: (value: any) => void;
  extraOptions?: React.ReactNode;
  defaultValue?: string | object;
  size?: "small" | "medium";
}

const SelectInputControlledComponent: FC<
  SelectInputControlledComponentProps
> = (props) => {
  console.log(props.items);

  return (
    <div className="form-input">
      <FormControl fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <AppLoaderComponent loading={props.loading}>
          <Select
            label={props.label}
            onChange={(e) => props.onValueChange(e.target.value)}
            onSelect={(e) => console.log(e)}
            defaultValue={props.defaultValue ?? ""}
            size={props.size ?? "medium"}
          >
            {props.items?.map((element, index) => (
              <MenuItem value={props.valueGetter(element)} key={`${index}`}>
                {props.labelGetter(element)}
              </MenuItem>
            ))}
            {props?.extraOptions}
            {props.paginated && (
              <MenuItem onClick={(e) => e.stopPropagation()}>
                <Button
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    if (props.onLoadMore) props.onLoadMore();
                  }}
                >
                  {props.loading ? <CircularProgress /> : "Voir plus"}
                </Button>
              </MenuItem>
            )}
          </Select>
        </AppLoaderComponent>
      </FormControl>
    </div>
  );
};

export default SelectInputControlledComponent;
