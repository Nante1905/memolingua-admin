import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { MultiLabelTheme } from "../../../../shared/types/Theme";
import ThemeFormComponent from "../../components/theme-form/theme-form.component";
import { themeFactory } from "../../helper/theme.helper";
import { getThemeById, updateTheme } from "../../services/theme.service";

const ThemeUpdateRoot = () => {
  const queryClient = useQueryClient();
  const idTheme = useParams().id;
  const themeQuery = useQuery({
    queryKey: ["theme", idTheme],
    queryFn: () => getThemeById(idTheme as string),
    enabled: !!idTheme,
  });

  const themeMutation = useMutation({
    mutationKey: ["create-theme"],
    mutationFn: async (data: any) => updateTheme(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      enqueueSnackbar({
        message: `Thème ${themeQuery.data?.data.payload?.label ?? ""} modifié`,
        variant: "success",
        autoHideDuration: 3000,
      });
    },
  });

  const onFormSubmit = useCallback(
    (data: any) => {
      themeMutation.mutate({ id: idTheme, form: data });
    },
    [themeMutation, idTheme]
  );

  return (
    <div id="theme-create-root">
      <h1>
        Modifier le thème{" "}
        {themeQuery.isFetching ? "..." : themeQuery.data?.data.payload.label}{" "}
      </h1>
      <AppLoaderComponent loading={themeQuery.isFetching}>
        <ThemeFormComponent
          langs={themeQuery.data?.data.payload.labels ?? []}
          theme={themeFactory(themeQuery.data?.data.payload as MultiLabelTheme)}
          onSubmit={onFormSubmit}
          isSubmitting={themeMutation.isPending}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default ThemeUpdateRoot;
