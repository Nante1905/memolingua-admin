import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { Theme } from "../../../../shared/types/Theme";
import PackageFormComponent from "../../components/package-form/package-form.component";
import { getPackageById, updatePackage } from "../../services/package.service";

const UpdatePackageRoot = () => {
  const idPackage = useParams().id;
  const packQuery = useQuery({
    queryKey: ["package-id", idPackage],
    queryFn: () => getPackageById(idPackage as string),
    enabled: !!idPackage,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateMutation = useMutation({
    mutationKey: ["updatePackage"],
    mutationFn: updatePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });

      enqueueSnackbar({
        message: `Paquet ${packQuery.data?.data.payload.title} modifié`,
        variant: "success",
      });
      navigate("/packages");
    },
    onError(error) {
      const apiError = error as AxiosError;
      ((apiError.response?.data as ApiResponse).error as string[]).map((e) => {
        enqueueSnackbar({ message: e, variant: "error" });
      });
    },
  });

  const onFormSubmit = (data: any) => {
    updateMutation.mutate({ id: idPackage, ...data });
  };

  return (
    <div id="create-package-root">
      <AppLoaderComponent loading={packQuery.isFetching}>
        <h1 className="text-center">
          Modifier {packQuery.data?.data.payload.title}
        </h1>
        <PackageFormComponent
          theme={[packQuery.data?.data.payload.theme as Theme]}
          courses={[]}
          formSubmitting={updateMutation.isPending}
          onFormSubmit={onFormSubmit}
          pack={packQuery.data?.data.payload}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default UpdatePackageRoot;
