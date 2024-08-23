import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import AddCardForm from "../../components/add-card-form/add-card-form.component";
import { getPackageById } from "../../services/package.service";

const AddCardRoot = () => {
  const idPackage = useParams().id;

  const packageQuery = useQuery({
    queryKey: ["packageById", idPackage],
    queryFn: () => getPackageById(idPackage as string),
    enabled: idPackage != undefined,
  });

  return (
    <div id="add-cart-root">
      <AppLoaderComponent loading={packageQuery.isLoading}>
        <Fragment>
          {packageQuery.isSuccess && (
            <>
              <h1 className="text-center text-success">
                Ajout de carte(s) à{" "}
                <u>{packageQuery.data?.data?.payload?.title}</u>
              </h1>
              <AddCardForm
                idPackage={packageQuery.data?.data?.payload?.id as string}
              />
            </>
          )}
          {packageQuery.isError && (
            <p className="text-danger text-center">
              {packageQuery.error.message}
            </p>
          )}
        </Fragment>
      </AppLoaderComponent>
    </div>
  );
};

export default AddCardRoot;