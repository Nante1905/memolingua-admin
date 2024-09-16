import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, FormHelperText } from "@mui/material";
import { ChangeEvent, FC, useCallback } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormInputProps } from "../../../types/FormInputProps";

import { toBase64 } from "../../../services/upload/fileUpload.service";
import { Media } from "../../../types/Media";
import { VisuallyHiddenInput } from "../../visual-hidden-input/visual-hidden-input.component";
import "./input-file.component.scss";

interface InputFileComponentProps extends FormInputProps {
  form: UseFormReturn;
}

const InputFileComponent: FC<InputFileComponentProps> = (props) => {
  const handleChangeUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, name: string) => {
      const file = event.target.files?.[0] as File;
      const blob = await toBase64(file);

      const media: Media = {
        blob,
        fileName: file.name as string,
        contentType: file.type as string,
        size: file.size as number,
      };

      props.form.setValue(name, media);
    },
    [props.form]
  );

  return (
    <div>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => (
          <div className="media-input">
            <div className="media-input_actions">
              <Button
                component="label"
                color="secondary"
                variant="outlined"
                tabIndex={-1}
                sx={{ overflow: "hidden" }}
                startIcon={<CloudUploadIcon sx={{ padding: "0 5px" }} />}
              >
                {field.value ? field.value?.fileName : ` ${props.label}`}
                <VisuallyHiddenInput
                  onChange={(e: any) => handleChangeUpload(e, field.name)}
                  type="file"
                />
              </Button>
              <Button
                color="error"
                onClick={() => {
                  props.form.resetField(field.name);
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
            {!!fieldState.error && (
              <FormHelperText sx={{ color: "red" }}>
                {fieldState.error.message}
              </FormHelperText>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default InputFileComponent;
