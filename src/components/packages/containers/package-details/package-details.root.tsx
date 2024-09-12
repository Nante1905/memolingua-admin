import { Edit } from "@mui/icons-material";
import { Badge, Button, Chip, IconButton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import {
  ADMIN_ROLE,
  API_BASE_URL,
  ENTITY_DELETED,
} from "../../../../shared/constants/api.constant";
import { getFullName } from "../../../../shared/helpers/formatter";
import { User } from "../../../../shared/types/User";
import PackageDetails from "../../components/package-details/package-details.component";
import {
  deletePackage,
  getDetailsPackage,
} from "../../services/package.service";
import { PackageContent } from "../../types/PackageLib";
import "./package-details.root.scss";

const PackageDetailsRoot: React.FC = () => {
  const idPackage = useParams().id;
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const detailsQuery = useQuery({
    queryKey: ["package", idPackage],
    queryFn: () => getDetailsPackage(idPackage as string),
    enabled: idPackage != undefined,
  });

  const deletePackageMutation = useMutation({
    mutationKey: ["delete-package"],
    mutationFn: (id: string) => deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", idPackage] });

      enqueueSnackbar({
        message: `Paquet ${
          detailsQuery.data?.data.payload?.title ?? ""
        } supprimé`,
        variant: "success",
        autoHideDuration: 3000,
      });
      setOpenConfirmation(false);
    },
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
                <h1>
                  Contenu "{detailsQuery.data?.data.payload.title}"{" "}
                  {detailsQuery.data?.data.payload.author.role.code ==
                    ADMIN_ROLE &&
                    detailsQuery.data?.data.payload.state != ENTITY_DELETED && (
                      <Link to={`/packages/${idPackage}/update`}>
                        <IconButton color="primary">
                          <Edit />
                        </IconButton>
                      </Link>
                    )}
                </h1>
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
        </div>
        <PackageDetails
          pack={detailsQuery.data?.data.payload as PackageContent}
        />
        {detailsQuery.data?.data.payload.state != ENTITY_DELETED && (
          <div style={{ display: "flex", margin: "1rem 0" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenConfirmation(true)}
            >
              Supprimer le paquet
            </Button>
          </div>
        )}
        {openConfirmation && (
          <ConfirmationDialogComponent
            title={`Supprimer le paquet ${detailsQuery.data?.data.payload.title}`}
            onConfirm={() => deletePackageMutation.mutate(idPackage as string)}
            onClose={() => setOpenConfirmation(false)}
          >
            Voulez-vous vraiment supprimer le paquet{" "}
            <strong>{detailsQuery.data?.data.payload.title} ?</strong>
          </ConfirmationDialogComponent>
        )}
      </AppLoaderComponent>
    </div>
  );
};

export default PackageDetailsRoot;
