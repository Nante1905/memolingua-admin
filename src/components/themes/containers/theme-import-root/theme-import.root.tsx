import { Download, Info, Save } from "@mui/icons-material";
import {
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
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
import ThemeImportComponent from "../../components/theme-import/theme-import.component";
import {
  confirmCSVImportTheme,
  downloadCSVTheme,
  importThemeCSV,
} from "../../services/theme.service";

const ThemeImportRoot = () => {
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationKey: ["import-theme"],
    mutationFn: (data: any) => importThemeCSV(data),
  });

  const handleFormSubmit = useCallback(
    (data: any) => {
      setConfirmed(false);
      importMutation.mutate(data);
    },
    [importMutation]
  );

  const downloadQuery = useQuery({
    queryKey: ["download-themes"],
    queryFn: downloadCSVTheme,
    enabled: false,
  });

  const confirmImportQuery = useQuery({
    queryKey: ["import-themes"],
    queryFn: confirmCSVImportTheme,
    enabled: false,
  });

  const onDownloadFile = useCallback(() => {
    downloadQuery.refetch().then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data?.data], { type: "text/csv" })
      );
      downloadFile(url, `theme-data-${Date.now()}.csv`);
    });
  }, [downloadQuery]);

  const onConfirmUpload = useCallback(() => {
    confirmImportQuery.refetch().then((res) => {
      setConfirmed(true);
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      enqueueSnackbar({
        message: `${res.data?.data.payload.theme} thème(s) enregistrée(s)`,
        variant: "success",
        persist: true,
        onClose: () => navigate("/themes"),
      });
      enqueueSnackbar({
        message: `${res.data?.data.payload.traduction} traduction(s) enregistrée(s)`,
        variant: "success",
        persist: true,
        onClose: () => navigate("/themes"),
      });
    });
  }, [confirmImportQuery, navigate, queryClient]);

  return (
    <div className="import-root">
      <h1>Import de données csv sur les Thèmes</h1>
      <div className="import-body">
        <IconButton onClick={() => setOpenInfo(!openInfo)}>
          <Info />
        </IconButton>
        <Collapse in={openInfo} unmountOnExit>
          <div className="info">
            <List>
              <ListItem>
                <strong>En-tête du csv</strong>:
                <List>
                  <ListItem>
                    theme{" "}
                    <em>
                      (Le nom du thème en français: <strong>obligatoire</strong>{" "}
                      )
                    </em>
                  </ListItem>
                  <ListItem>
                    langage{" "}
                    <em>
                      (Le code de la langue déjà enregistrée:{" "}
                      <strong>obligatoire si une traduction est donnée</strong>.{" "}
                      )
                    </em>
                  </ListItem>
                  <ListItem>
                    traduction{" "}
                    <em>
                      (La traduction du nom du thème dans la langue soumise:{" "}
                      <strong>obligatoire si une langue est donnée</strong>. )
                    </em>
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <strong>Séparateur:</strong> Point virgule (;)
              </ListItem>
            </List>
          </div>
        </Collapse>
      </div>
      <ThemeImportComponent submitForm={handleFormSubmit} />

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
                  <TableCell>Theme</TableCell>
                  <TableCell>Langage</TableCell>
                  <TableCell>Traduction</TableCell>
                  <TableCell>Erreur</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importMutation.data.data.payload.data.map((d) => (
                  <TableRow key={d.row} className={d.error && "error"}>
                    <TableCell align="right">{d.row}</TableCell>
                    <TableCell>{d.theme}</TableCell>
                    <TableCell>{d.langage}</TableCell>
                    <TableCell>{d.traduction}</TableCell>
                    <TableCell>{d.error ?? ""}</TableCell>
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

export default ThemeImportRoot;