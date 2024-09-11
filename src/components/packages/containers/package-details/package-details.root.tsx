import { Badge, Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import {
  ADMIN_ROLE,
  API_BASE_URL,
  ENTITY_DELETED,
} from "../../../../shared/constants/api.constant";
import { getFullName } from "../../../../shared/helpers/formatter";
import { User } from "../../../../shared/types/User";
import PackageDetails from "../../components/package-details/package-details.component";
import { getDetailsPackage } from "../../services/package.service";
import { PackageContent } from "../../types/PackageLib";
import "./package-details.root.scss";

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
          <div>
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
            <div className="infos">
              <p>
                <strong>Id:</strong> {detailsQuery.data?.data.payload.id}{" "}
                {detailsQuery.data?.data.payload.state == ENTITY_DELETED && (
                  <Chip label={`Supprimé`} color="error" />
                )}
              </p>

              <p>
                <strong>Auteur: </strong>{" "}
                {getFullName(detailsQuery.data?.data.payload.author as User)}
              </p>
            </div>
          </div>

          <div className="div-img">
            {detailsQuery.data?.data.payload.imgPath != null ? (
              <img
                src={`${API_BASE_URL}/${detailsQuery.data?.data.payload.imgPath}`}
                alt="Image"
                className="pack-img"
              />
            ) : (
              <p>Pas d'image</p>
            )}
          </div>
          {/* <div className="select"> */}
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
          {/* </div> */}
        </div>
        <PackageDetails
          pack={detailsQuery.data?.data.payload as PackageContent}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default PackageDetailsRoot;
