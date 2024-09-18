import { zodResolver } from "@hookform/resolvers/zod";
import { UploadFile } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  LinearProgress,
} from "@mui/material";
import React, { ChangeEvent, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { importCSVSchema } from "../../../../shared/helpers/fileupload.helper";
import { toBase64 } from "../../../../shared/services/upload/fileUpload.service";
import { HiddenInput } from "../../../../shared/styles/theme";
import { Media } from "../../../../shared/types/Media";
import "./lang-import.component.scss";

interface LangImportProps {
  submitForm: (data: any) => void;
  isSubmitting?: boolean;
}

const LangImportComponent: React.FC<LangImportProps> = (props) => {
  const form = useForm({ resolver: zodResolver(importCSVSchema) });

  useEffect(() => {
    const subscription = form.watch(() => {
      form.trigger(["file"]);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] as File;
      const blob = await toBase64(file);

      const media: Media = {
        blob,
        fileName: file.name as string,
        contentType: file.type as string,
        size: file.size as number,
      };
      console.log(media);

      form.setValue("file", media);
    },
    [form]
  );

  return (
    <div className="import-component">
      <form
        className={`form ${props.isSubmitting && "loading"}`}
        onSubmit={form.handleSubmit(props.submitForm)}
      >
        <div className="form-input">
          <FormControl>
            <Controller
              control={form.control}
              name="file"
              render={({ field, fieldState }) => (
                <div>
                  <Button
                    startIcon={<UploadFile />}
                    color="secondary"
                    component="label"
                    className="btn-upload"
                    tabIndex={-1}
                  >
                    <HiddenInput
                      type="file"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleFileUpload(event);
                      }}
                    />
                    {field.value
                      ? field.value.fileName
                      : "Importer un fichier csv"}
                  </Button>

                  {!!fieldState.error?.message && (
                    <FormHelperText error>
                      {fieldState.error?.message as string}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
          </FormControl>
        </div>
        <div className="form-input">
          <Button variant="contained" type="submit">
            Importer
          </Button>
        </div>

        {props.isSubmitting && (
          <>
            <div className="blur" />
            <LinearProgress
              style={{ width: "100%" }}
              className="linear-progress"
            />
          </>
        )}
      </form>
    </div>
  );
};

export default LangImportComponent;
