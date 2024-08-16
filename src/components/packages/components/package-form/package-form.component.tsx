import { zodResolver } from "@hookform/resolvers/zod";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import React, { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiMessage } from "../../../../shared/constants/api.message";
import { toBase64 } from "../../../../shared/services/upload/fileUpload.service";
import { HiddenInput } from "../../../../shared/styles/theme";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { Langage } from "../../../../shared/types/Langage";
import { Theme } from "../../../../shared/types/Theme";
import { imgValidation, PackageSchema } from "../../helper/package-form.helper";
import { createPackage } from "../../services/package.service";
import {
  initialPackageFormState,
  PackageFormState,
} from "../../state/package-form.state";
import "./package-form.component.scss";
const formDefaultValue = {
  title: "",
  lang: "",
  theme: "",
  img: "",
};

interface PackageFormProps {
  theme: Theme[];
  langages: Langage[];
}

const PackageFormComponent: React.FC<PackageFormProps> = (props) => {
  const form = useForm({
    defaultValues: formDefaultValue,
    resolver: zodResolver(PackageSchema),
  });
  const [state, setState] = useState<PackageFormState>(initialPackageFormState);

  const handleFileUpload =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const file = event.target.files[0];
        const errorValidation = imgValidation(file);
        console.log(errorValidation);

        if (errorValidation == "") {
          const fileData = await toBase64(file);
          setState((state) => ({
            ...state,
            imgPreview: URL.createObjectURL(file),
            img: {
              ...state.img,
              fileName: file.name,
              blob: fileData,
              contentType: file.type,
            },
          }));
          form.clearErrors("img");
          return file;
        } else {
          form.setError("img", { type: "manual", message: errorValidation });
          return undefined;
        }
      }
    };

  const packageMutation = useMutation({
    mutationKey: ["createPackage"],
    mutationFn: createPackage,
    onSuccess: () => {
      form.reset(formDefaultValue, { keepDefaultValues: false });
      setState((state) => ({
        ...state,
        img: initialPackageFormState.img,
      }));
      enqueueSnackbar({
        message: apiMessage["fr"].created("Paquet"),
        variant: "success",
      });
    },
    onError(error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiError = error as AxiosError;
      ((apiError.response?.data as ApiResponse).error as string[]).map((e) => {
        enqueueSnackbar({ message: e, variant: "error" });
      });
      // console.log(((error as AxiosError).response?.data as ApiResponse<any>).);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFormSubmit = (data: any) => {
    packageMutation.mutate({
      ...data,
      img: {
        fileName: state.img.fileName,
        blob: state.img.blob,
        contentType: state.img.contentType,
      },
    });
  };

  return (
    <div className="package-form">
      <form
        className={`form ${packageMutation.isPending && "loading"}`}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <div className="form-input">
          <TextField
            label="Titre"
            {...form.register("title")}
            error={!!form.formState.errors["title"]}
            helperText={form.formState.errors["title"]?.message as string}
          />
        </div>
        <div className="form-input">
          <FormControl fullWidth error={!!form.formState.errors["lang"]}>
            <InputLabel>Langue</InputLabel>
            <Controller
              name="lang"
              control={form.control}
              render={({ field }) => (
                <Select label="Langue" {...field}>
                  {props.langages?.map((lang, index) => (
                    <MenuItem value={lang.id} key={`lang-${index}`}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {!!form.formState.errors["lang"] && (
              <FormHelperText>
                {form.formState.errors["lang"]?.message as string}
              </FormHelperText>
            )}
          </FormControl>
        </div>
        <div className="form-input">
          <FormControl fullWidth error={!!form.formState.errors["theme"]}>
            <InputLabel>Thème</InputLabel>
            <Controller
              name="theme"
              control={form.control}
              render={({ field }) => (
                <Select label="Thème" {...field}>
                  {props.theme?.map((theme, index) => (
                    <MenuItem value={theme.id} key={`theme-${index}`}>
                      {theme.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {!!form.formState.errors["theme"] && (
              <FormHelperText>
                {form.formState.errors["theme"]?.message as string}
              </FormHelperText>
            )}
          </FormControl>
        </div>
        <div className="form-input">
          <FormControl error={!!form.formState.errors["img"]}>
            <Controller
              control={form.control}
              name="img"
              render={({ field, fieldState }) => (
                <div className="inline-flex">
                  <Button
                    startIcon={<InsertPhotoIcon />}
                    variant="contained"
                    color="secondary"
                    component="label"
                    className="btn-upload"
                  >
                    <HiddenInput
                      type="file"
                      {...field}
                      onChange={async (
                        event: ChangeEvent<HTMLInputElement>
                      ) => {
                        await handleFileUpload(event);

                        field.onChange("");
                      }}
                    />
                  </Button>
                  {state.img.fileName != "" && (
                    <small>{state.img.fileName}</small>
                  )}
                  {form.formState.errors["img"]?.message}
                  {!!fieldState.error?.message && (
                    <FormHelperText>
                      {fieldState.error?.message as string}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
            {state.imgPreview != "" && (
              <div className="preview-img">
                <img src={state.imgPreview} alt={state.img.fileName} />
              </div>
            )}
          </FormControl>
        </div>
        <div className="form-submit">
          <Button color="primary" variant="contained" type="submit">
            <strong>Créer</strong>
          </Button>
        </div>
        {packageMutation.isPending && (
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

export default PackageFormComponent;
