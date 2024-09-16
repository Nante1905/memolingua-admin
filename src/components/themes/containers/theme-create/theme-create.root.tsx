import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import ThemeFormComponent from "../../components/theme-form/theme-form.component";
import { createTheme, getLangsForTheme } from "../../services/theme.service";

const ThemeCreateRoot = () => {
  const [resetForm, setResetForm] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const langQuery = useQuery({
    queryKey: ["langs-exist"],
    queryFn: () => getLangsForTheme(),
  });

  const themeMutation = useMutation({
    mutationKey: ["create-theme"],
    mutationFn: async (data: any) => createTheme(data),
    onSuccess: () => {
      setResetForm(true);
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      enqueueSnackbar({
        message: "Thème créé",
        variant: "success",
        autoHideDuration: 3000,
      });
    },
  });

  const onFormSubmit = useCallback(
    (data: any) => {
      themeMutation.mutate(data);
    },
    [themeMutation]
  );

  return (
    <div id="theme-create-root">
      <h1>Nouveau thème</h1>
      <AppLoaderComponent loading={langQuery.isFetching}>
        <ThemeFormComponent
          langs={langQuery.data?.data.payload ?? []}
          onSubmit={onFormSubmit}
          isSubmitting={themeMutation.isPending}
          reset={[resetForm, () => setResetForm(false)]}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default ThemeCreateRoot;
