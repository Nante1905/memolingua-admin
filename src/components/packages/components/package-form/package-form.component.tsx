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
import React, { ChangeEvent, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import SelectInputComponent from "../../../../shared/components/inputs/select-input/select-input.component";
import { API_BASE_URL } from "../../../../shared/constants/api.constant";
import { toBase64 } from "../../../../shared/services/upload/fileUpload.service";
import { HiddenInput } from "../../../../shared/styles/theme";
import { Course } from "../../../../shared/types/Course";
import { Media } from "../../../../shared/types/Media";
import { Package } from "../../../../shared/types/Package";
import { Theme } from "../../../../shared/types/Theme";
import {
  PackageSchema,
  updatePackageSchema,
} from "../../helper/package-form.helper";
import "./package-form.component.scss";

interface PackageFormProps {
  theme: Theme[];
  courses: Course[];
  formSubmitting: boolean;
  onFormSubmit: (data: any) => void;
  reset?: [boolean, () => void];
  pack?: Package;
  className?: string;
}

const PackageFormComponent: React.FC<PackageFormProps> = (props) => {
  console.log(props.formSubmitting);

  const form = useForm({
    resolver: zodResolver(props.pack ? updatePackageSchema : PackageSchema),
  });
  const img = form.watch("img");

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
    },
    [props]
  );

  return (
    <div className={`package-form ${props.className ?? ""}`}>
      <form
        className={`form ${props.formSubmitting && "loading"}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="form-input">
          <TextField
            label="Titre"
            {...form.register("title")}
            defaultValue={props.pack?.title ?? ""}
            error={!!form.formState.errors["title"]}
            helperText={form.formState.errors["title"]?.message as string}
          />
        </div>
        <div className="form-input">
          {props.pack ? (
            <div className="langs inline-flex">
              <p>Langues:</p>
              <p>
                {props.pack.languageSource?.label} {"->"}{" "}
                {props.pack.languageTarget?.label}{" "}
              </p>
            </div>
          ) : (
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
          )}
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
            defaultValue={props.pack?.theme.id ?? ""}
            readonly={!!props.pack}
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
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleFileUpload(event);
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
            <div className="previews">
              {props.pack?.imgPath && (
                <div className="now-img">
                  <p>Ancien: </p>
                  <img
                    src={`${API_BASE_URL}/${props.pack.imgPath}`}
                    alt={"Image"}
                    style={{ opacity: img ? 0.25 : 1 }}
                  />
                </div>
              )}
              {img && (
                <div className="preview-img">
                  <p>Nouvelle image</p>
                  <img src={img.preview} alt={img.media.fileName} />
                  <IconButton
                    color="error"
                    onClick={() => form.resetField("img")}
                  >
                    <DeleteForever />
                  </IconButton>
                </div>
              )}
            </div>
          </FormControl>
        </div>
        <div className="form-submit">
          <Button color="primary" variant="contained" type="submit">
            {props.pack ? "Modifier" : "Créer"}
          </Button>
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
