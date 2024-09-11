import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteForever } from "@mui/icons-material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { ChangeEvent, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import SelectInputComponent from "../../../../shared/components/inputs/select-input/select-input.component";
import { toBase64 } from "../../../../shared/services/upload/fileUpload.service";
import { HiddenInput } from "../../../../shared/styles/theme";
import { Course } from "../../../../shared/types/Course";
import { Media } from "../../../../shared/types/Media";
import { Theme } from "../../../../shared/types/Theme";
import { PackageSchema } from "../../helper/package-form.helper";
import "./package-form.component.scss";

interface PackageFormProps {
  theme: Theme[];
  courses: Course[];
  formSubmitting: boolean;
  onFormSubmit: (data: any) => void;
  reset?: [boolean, () => void];
}

const PackageFormComponent: React.FC<PackageFormProps> = (props) => {
  const form = useForm({
    resolver: zodResolver(PackageSchema),
  });
  const img = form.watch("img");
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = form.watch(() => {
      form.trigger(["img"]);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (props.reset && props.reset[0]) {
      form.reset({}, { keepDefaultValues: false });
      props.reset[1]();
    }
  }, [props.reset, form]);

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

      form.setValue("img", { preview: URL.createObjectURL(file), media });
    },
    [form]
  );

  const onSubmit = useCallback(
    (data: any) => {
      const { img, ...pack } = data;
      props.onFormSubmit({ ...pack, img: img?.media });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    [props, queryClient]
  );

  return (
    <div className="package-form">
      <form
        className={`form ${props.formSubmitting && "loading"}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="form-input">
          <TextField
            label="Titre"
            {...form.register("title")}
            defaultValue={""}
            error={!!form.formState.errors["title"]}
            helperText={form.formState.errors["title"]?.message as string}
          />
        </div>

        <div className="form-input">
          <SelectInputComponent
            control={form.control}
            items={props.courses}
            loading={false}
            valueGetter={(item: Course) => item.id}
            labelGetter={(item: Course) =>
              `${item.sourceLabel} -> ${item.targetLabel}`
            }
            name={"course"}
            label={"Cours"}
            defaultValue={""}
          />
        </div>
        <div className="form-input">
          <SelectInputComponent
            control={form.control}
            items={props.theme}
            loading={false}
            valueGetter={(item: Theme) => item.id}
            labelGetter={(item: Theme) => item.label}
            name={"theme"}
            label={"Thème"}
            defaultValue={""}
          />
        </div>
        <div className="form-input">
          <FormControl error={!!form.formState.errors["img"]}>
            <Controller
              control={form.control}
              name="img"
              render={({ fieldState }) => (
                <div className="inline-flex">
                  <Button
                    startIcon={<InsertPhotoIcon />}
                    variant="contained"
                    color="secondary"
                    component="label"
                    className="btn-upload"
                    tabIndex={-1}
                  >
                    <HiddenInput
                      type="file"
                      onChange={async (
                        event: ChangeEvent<HTMLInputElement>
                      ) => {
                        await handleFileUpload(event);
                      }}
                    />
                  </Button>

                  {img && <small>{img.media.fileName}</small>}
                  {!!fieldState.error?.message && (
                    <FormHelperText error>
                      {fieldState.error?.message as string}
                    </FormHelperText>
                  )}
                </div>
              )}
            />
            {img && (
              <div className="preview-img">
                <img src={img.preview} alt={img.media.fileName} />
                <IconButton
                  color="error"
                  onClick={() => form.resetField("img")}
                >
                  <DeleteForever />
                </IconButton>
              </div>
            )}
          </FormControl>
        </div>
        <div className="form-submit">
          <Button color="primary" variant="contained" type="submit">
            <strong>Créer</strong>
          </Button>
          <Button
            onClick={() => form.reset(undefined, { keepDefaultValues: false })}
          >
            Reset
          </Button>
          <Button onClick={() => console.log(form.getValues())}>Valeur</Button>
        </div>
        {props.formSubmitting && (
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
