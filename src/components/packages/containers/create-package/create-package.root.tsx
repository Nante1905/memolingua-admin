import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { apiMessage } from "../../../../shared/constants/api.message";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { Course } from "../../../../shared/types/Course";
import { Theme } from "../../../../shared/types/Theme";
import PackageFormComponent from "../../components/package-form/package-form.component";
import {
  createPackage,
  getPackageDependances,
} from "../../services/package.service";

const CreatePackageRoot = () => {
  const [resetForm, setResetForm] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const dependancesQuery = useQuery({
    queryKey: ["packagesDep"],
    queryFn: getPackageDependances,
  });

  useEffect(() => {
    if (dependancesQuery.isError) {
      enqueueSnackbar({
        message: dependancesQuery.error.message,
        variant: "error",
      });
    }
  }, [dependancesQuery]);

  const packageMutation = useMutation({
    mutationKey: ["createPackage"],
    mutationFn: createPackage,
    onSuccess: () => {
      setResetForm(true);
      queryClient.invalidateQueries({ queryKey: ["packages"] });

      enqueueSnackbar({
        message: apiMessage["fr"].created("Paquet"),
        variant: "success",
      });
    },
    onError(error) {
      const apiError = error as AxiosError;
      ((apiError.response?.data as ApiResponse).error as string[]).map((e) => {
        enqueueSnackbar({ message: e, variant: "error" });
      });
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFormSubmit = (data: any) => {
    packageMutation.mutate(data);
  };

  const afterFormReset = () => {
    setResetForm(false);
  };

  return (
    <div id="create-package-root">
      <h1 className="text-center">Créer un paquet</h1>
      <AppLoaderComponent loading={dependancesQuery.isLoading}>
        <PackageFormComponent
          theme={dependancesQuery.data?.data.payload.themes as Theme[]}
          courses={dependancesQuery.data?.data.payload.courses as Course[]}
          onFormSubmit={onFormSubmit}
          reset={[resetForm, afterFormReset]}
          formSubmitting={packageMutation.isPending}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default CreatePackageRoot;
