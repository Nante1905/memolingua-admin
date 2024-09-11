import { Badge } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { ADMIN_ROLE } from "../../../../shared/constants/api.constant";
import PackageDetails from "../../components/package-details/package-details.component";
import { getDetailsPackage } from "../../services/package.service";
import { PackageContent } from "../../types/PackageLib";

const PackageDetailsRoot: React.FC = () => {
  const idPackage = useParams().id;
  const detailsQuery = useQuery({
    queryKey: ["package", idPackage],
    queryFn: () => getDetailsPackage(idPackage as string),
    enabled: idPackage != undefined,
  });

  return (
    <div id="package-details-root">
      <AppLoaderComponent loading={detailsQuery.isFetching}>
        <div className="header">
          <div className="title">
            <Badge
              badgeContent={detailsQuery.data?.data.payload.author.role.code}
              color={
                detailsQuery.data?.data.payload.author.role.code == ADMIN_ROLE
                  ? "secondary"
                  : "accent"
              }
            >
              <h1>Contenu "{detailsQuery.data?.data.payload.title}" </h1>
            </Badge>
          </div>
          <div className="select">
            {/* <SelectInputControlledComponent
              items={[]}
              loading={false}
              valueGetter={function (item: any): string {
                throw new Error("Function not implemented.");
              }}
              labelGetter={function (item: any): string {
                throw new Error("Function not implemented.");
              }}
              label={""}
              onValueChange={function (value: any): void {
                throw new Error("Function not implemented.");
              }}
            /> */}
          </div>
        </div>
        <PackageDetails
          pack={detailsQuery.data?.data.payload as PackageContent}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default PackageDetailsRoot;
