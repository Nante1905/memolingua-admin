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
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { Fragment, useCallback, useState } from "react";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import ScrollToBtn from "../../../../shared/components/scroll-to-btn/scroll-to-btn.component";
import { downloadFile } from "../../../../shared/helpers/download.helper";
import "../../../../shared/styles/import-data.scss";
import LangImportComponent from "../../components/lang-import/lang-import.component";
import {
  confirmCSVImportLang,
  downloadCSVLang,
  importLangCSV,
} from "../../services/lang.service";

const LangImportRoot = () => {
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const importMutation = useMutation({
    mutationKey: ["import-lang"],
    mutationFn: (data: any) => importLangCSV(data),
  });

  const handleFormSubmit = useCallback(
    (data: any) => {
      setConfirmed(false);
      importMutation.mutate(data);
    },
    [importMutation]
  );

  const downloadQuery = useQuery({
    queryKey: ["download-langs"],
    queryFn: downloadCSVLang,
    enabled: false,
  });

  const confirmImportQuery = useQuery({
    queryKey: ["confirm-import-langs"],
    queryFn: confirmCSVImportLang,
    enabled: false,
    retry: false,
  });

  const onDownloadFile = useCallback(() => {
    downloadQuery.refetch().then((res) => {
      if (res.isSuccess) {
        const url = window.URL.createObjectURL(
          new Blob([res.data?.data], { type: "text/csv" })
        );
        downloadFile(url, `langue-data-${Date.now()}.csv`);
      }
    });
  }, [downloadQuery]);

  const onConfirmUpload = useCallback(() => {
    confirmImportQuery.refetch().then((res) => {
      if (res.isSuccess) {
        setConfirmed(true);
        enqueueSnackbar({
          message: `${res.data?.data.payload} Langue(s) enregistrée(s)`,
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    });
  }, [confirmImportQuery]);

  return (
    <div className="import-root">
      <h1>Import de données csv sur les Langues</h1>
      <div className="import-body">
        <IconButton onClick={() => setOpenInfo(!openInfo)}>
          <Info />
        </IconButton>
        <Collapse in={openInfo} unmountOnExit>
          <div className="info">
            <strong>En-tête du csv</strong>
            <ul>
              <li>
                label (Le nom de la langue: <strong>obligatoire</strong> )
              </li>
              <li>
                code{" "}
                <em>
                  (Le code du pays: <strong>obligatoire</strong>.{" "}
                  <a href="https://flagsapi.com/#countries" target="_blank">
                    Codes valides
                  </a>
                  )
                </em>
              </li>
            </ul>
            <strong>Séparateur:</strong> Point virgule (;)
          </div>
        </Collapse>
      </div>
      <LangImportComponent
        submitForm={handleFormSubmit}
        isSubmitting={importMutation.isPending}
      />

      {!confirmed && importMutation.isSuccess && importMutation.data?.data && (
        <Fragment>
          <ScrollToBtn direction="top" />
          <ScrollToBtn direction="bottom" />
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
                  <TableCell>Label</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Erreur</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importMutation.data.data.payload.data.map((d) => (
                  <TableRow key={d.row} className={d.error && "error"}>
                    <TableCell align="right">{d.row}</TableCell>
                    <TableCell>{d.label}</TableCell>
                    <TableCell>{d.code}</TableCell>
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
              <AppLoaderComponent loading={confirmImportQuery.isFetching}>
                <Save /> Enregistrer les{" "}
                {importMutation.data.data.payload?.correct} ligne(s) correcte(s)
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
                loading={downloadQuery.isFetching}
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

export default LangImportRoot;
