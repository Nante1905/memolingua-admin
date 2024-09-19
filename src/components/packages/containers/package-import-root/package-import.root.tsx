import { Download, Info, Save } from "@mui/icons-material";
import {
  Button,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { Fragment, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { downloadFile } from "../../../../shared/helpers/download.helper";
import PackageImportComponent from "../../components/package-import/package-import.component";
import {
  confirmCSVImportPackage,
  downloadCSVPackage,
  importPackageCSV,
} from "../../services/package.service";

const PackageImportRoot = () => {
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationKey: ["import-package"],
    mutationFn: (data: any) => importPackageCSV(data),
  });

  const handleFormSubmit = useCallback(
    (data: any) => {
      setConfirmed(false);
      importMutation.mutate(data);
    },
    [importMutation]
  );

  const downloadQuery = useQuery({
    queryKey: ["download-packages"],
    queryFn: downloadCSVPackage,
    enabled: false,
  });

  const confirmImportQuery = useQuery({
    queryKey: ["confirm-import-packages"],
    queryFn: confirmCSVImportPackage,
    enabled: false,
    retry: false,
  });

  const onDownloadFile = useCallback(() => {
    downloadQuery.refetch().then((res) => {
      if (res.isSuccess) {
        const url = window.URL.createObjectURL(
          new Blob([res.data?.data], { type: "text/csv" })
        );
        downloadFile(url, `paquet-data-${Date.now()}.csv`);
      }
    });
  }, [downloadQuery]);

  const onConfirmUpload = useCallback(() => {
    confirmImportQuery.refetch().then((res) => {
      if (res.isSuccess) {
        setConfirmed(true);
        queryClient.invalidateQueries({ queryKey: ["packages"] });
        enqueueSnackbar({
          message: `${res.data?.data.payload} paquet(s) enregistré(s)`,
          variant: "success",
          persist: true,
          onClose: () => navigate("/packages"),
        });
      }
    });
  }, [confirmImportQuery, navigate, queryClient]);

  return (
    <div className="import-root">
      <h1>Import de données csv des Paquets</h1>
      <div className="import-body">
        <IconButton onClick={() => setOpenInfo(!openInfo)}>
          <Info />
        </IconButton>
        <Collapse in={openInfo} unmountOnExit>
          <div className="info">
            <strong>En-tête du csv</strong>:
            <ul>
              <li>
                title{" "}
                <em>
                  (Le titre du paquet dans la langue source:{" "}
                  <strong>obligatoire</strong> )
                </em>
              </li>
              <li>
                theme{" "}
                <em>
                  (Le nom du thème en français: <strong>obligatoire</strong> )
                </em>
              </li>
              <li>
                source{" "}
                <em>
                  (Le code de la langue source déjà enregistrée:{" "}
                  <strong>obligatoire</strong>. )
                </em>
              </li>
              <li>
                target{" "}
                <em>
                  (Le code de la langue ciblée déjà enregistrée:{" "}
                  <strong>obligatoire</strong>. )
                </em>
              </li>
            </ul>
            <strong>NB:</strong> Le cours langue source {`->`} langue cible doit
            être préalablement créé.
            <br />
            <strong>Séparateur:</strong> Point virgule (;)
          </div>
        </Collapse>
      </div>
      <PackageImportComponent submitForm={handleFormSubmit} />

      {!confirmed && importMutation.isSuccess && importMutation.data?.data && (
        <Fragment>
          {importMutation.data.data.payload.error > 0 && (
            <p className="text-danger">
              Erreur sur{" "}
              <strong>
                {" "}
                {importMutation.data.data.payload.error} ligne(s).
              </strong>
            </p>
          )}
          <TableContainer component={Paper} className="data-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ligne</TableCell>
                  <TableCell>Titre</TableCell>
                  <TableCell>Thème</TableCell>
                  <TableCell>Langue source</TableCell>
                  <TableCell>Langue cible</TableCell>
                  <TableCell>Erreur</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importMutation.data.data.payload.data.map((d) => (
                  <TableRow key={d.row} className={d.error && "error"}>
                    <TableCell align="right">{d.row}</TableCell>
                    <TableCell>{d.title}</TableCell>
                    <TableCell>{d.theme}</TableCell>
                    <TableCell>{d.source}</TableCell>
                    <TableCell>{d.target}</TableCell>
                    <TableCell>
                      <ul>
                        {d.error?.map((e, i) => (
                          <li key={`${d.row}_${i}`}>{e}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="actions">
            <Button
              className="inline-flex"
              disabled={importMutation.data.data.payload.correct == 0}
              onClick={onConfirmUpload}
            >
              {" "}
              <AppLoaderComponent loading={confirmImportQuery.isRefetching}>
                <Save /> Enregistrer les{" "}
                {importMutation.data.data.payload?.correct} lignes correctes
              </AppLoaderComponent>
            </Button>
            <Button
              color="secondary"
              className="inline-flex"
              disabled={importMutation.data.data.payload.error == 0}
              onClick={onDownloadFile}
            >
              {" "}
              <AppLoaderComponent
                loading={downloadQuery.isRefetching}
                width="25px"
                heigth="25px"
              >
                <Download /> Télécharger et modifier
              </AppLoaderComponent>
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default PackageImportRoot;
