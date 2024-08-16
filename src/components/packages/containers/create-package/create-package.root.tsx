import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { Langage } from "../../../../shared/types/Langage";
import { Theme } from "../../../../shared/types/Theme";
import PackageFormComponent from "../../components/package-form/package-form.component";
import { getPackageDependances } from "../../services/package.service";

const CreatePackageRoot = () => {
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

  return (
    <div id="create-package-root">
      <h1 className="text-center">Créer un paquet</h1>
      <AppLoaderComponent loading={dependancesQuery.isLoading}>
        <PackageFormComponent
          theme={dependancesQuery.data?.data.payload.themes as Theme[]}
          langages={dependancesQuery.data?.data.payload.langages as Langage[]}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default CreatePackageRoot;
