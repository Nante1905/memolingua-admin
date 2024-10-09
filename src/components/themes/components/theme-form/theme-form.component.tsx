import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteForever } from "@mui/icons-material";
import { Button, IconButton, LinearProgress, TextField } from "@mui/material";
import React, { lazy, Suspense, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
// import FaIconPicker from "../../../../shared/components/icon-picker/components/FaIconPicker";
import { useFontAwesomePack } from "../../../../shared/components/icon-picker/hooks/useFontAwesomePack";
import { getFlagLinkFromCompleteCode } from "../../../../shared/services/api/flags/flag-api.service";
import { Theme, ThemeLabel } from "../../../../shared/types/Theme";
import { ThemeSchema } from "../../helper/theme.helper";
import "./theme-form.component.scss";
const FaIconPicker = lazy(
  () =>
    import("../../../../shared/components/icon-picker/components/FaIconPicker")
);
interface ThemeFormProps {
  langs: ThemeLabel[];
  theme?: Theme;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  reset?: [boolean, () => void];
}

const ThemeFormComponent: React.FC<ThemeFormProps> = (props) => {
  const form = useForm({
    resolver: zodResolver(ThemeSchema),
    defaultValues: {
      label: props.theme?.label ?? "",
      icon: props.theme?.icon,
      langs: props.langs.map((l) => ({
        id: l.id,
        label: l.themeLabel ?? "",
      })),
    },
  });
  const iconPack = useFontAwesomePack();

  useEffect(() => {
    if (props.reset && props.reset[0]) {
      form.reset({}, { keepDefaultValues: false });
      form.setValue("icon", "");
      props.reset[1]();
    }
  }, [props.reset, form]);

  return (
    <div className="theme-form">
      <form
        className={`form ${props.isSubmitting && "loading"}`}
        onSubmit={form.handleSubmit(props.onSubmit)}
      >
        <div className="form-input">
          <Controller
            control={form.control}
            name="label"
            render={({ fieldState, field }) => (
              <TextField
                label="Label"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div className="form-input">
          <div className="input-flex">
            <Suspense fallback={<>Loading</>}>
              <FaIconPicker
                onChange={(value: string) => form.setValue("icon", value)}
                icons={iconPack ?? []}
                className="icon-input"
                control={form.control}
                name="icon"
                label="Icône"
                defaultValue={props.theme?.icon}
              />
            </Suspense>
            <IconButton
              color="error"
              onClick={() => {
                form.setValue("icon", "");
              }}
            >
              <DeleteForever />
            </IconButton>
          </div>
        </div>
        <div className="form-input">
          <h2>Internationalisation</h2>
          <div className="langs">
            {props.langs.map((l, i) => (
              <div className="inline-flex lang-label" key={l.id}>
                <div className="inline-flex">
                  <img
                    src={getFlagLinkFromCompleteCode(l.code, 24)}
                    alt={l.code}
                  />
                  <span>({l.code})</span>
                </div>
                <div className="lang-input">
                  <Controller
                    control={form.control}
                    name={`langs.${i}.label`}
                    render={({ fieldState, field }) => (
                      <TextField
                        label="Label"
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-input">
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              console.log(form.formState.errors);
              console.log(form.getValues());
            }}
          >
            {props.theme ? "Modifier" : "Créer"}
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

export default ThemeFormComponent;
