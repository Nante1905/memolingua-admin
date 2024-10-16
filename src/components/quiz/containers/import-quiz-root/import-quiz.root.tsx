import { Download, Save } from "@mui/icons-material";
import {
  Button,
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
import { useCallback } from "react";
import { Fragment } from "react/jsx-runtime";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import ScrollToBtn from "../../../../shared/components/scroll-to-btn/scroll-to-btn.component";
import { downloadFile } from "../../../../shared/helpers/download.helper";
import "../../../../shared/styles/import-data.scss";
import QuizImportFormComponent from "../../components/quiz-import-form/quiz-import-form.component";
import {
  confirmQuizImport,
  downloadQuizCsv,
  importQuiz,
} from "../../services/quiz.service";
import { ImportQuiz } from "../../types/ImportQuiz";
import "./import-quiz.root.scss";

const ImportQuizRoot = () => {
  const quizImportMutation = useMutation({
    mutationKey: ["quiz/import"],
    mutationFn: (data: object) => importQuiz(data),
  });

  const onSubmit = (data: object) => {
    quizImportMutation.mutate(data);
  };

  const downloadQuery = useQuery({
    queryKey: ["quiz/import/download"],
    queryFn: downloadQuizCsv,
    enabled: false,
  });

  const confirmQuery = useQuery({
    queryKey: ["quiz/import/confirm"],
    queryFn: confirmQuizImport,
    enabled: false,
    retry: false,
  });

  const onDownloadFile = useCallback(() => {
    downloadQuery.refetch().then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data?.data], { type: "text/csv" })
      );
      downloadFile(url, `quiz-data-${Date.now()}.csv`);
    });
  }, [downloadQuery]);

  const onConfirmUpload = useCallback(() => {
    confirmQuery.refetch().then((res) => {
      if (!res.error)
        enqueueSnackbar({
          message: `${res.data?.data.message}`,
          variant: "success",
        });
    });
  }, [confirmQuery]);

  return (
    <div className="import-quiz-root import-root">
      <h1 style={{ textAlign: "center" }}>Importer en format csv les quiz</h1>
      <div className="form-container">
        <QuizImportFormComponent
          label="Importer le fichier csv"
          onSubmit={onSubmit}
          loading={quizImportMutation.isPending}
        />
      </div>
      {quizImportMutation.data?.data.payload.error &&
        quizImportMutation.data?.data.payload.error > 0 && (
          <p style={{ marginLeft: "20px", color: "red" }}>
            Lignes en erreurs : {quizImportMutation.data?.data.payload.error}
          </p>
        )}
      <div className="import-result">
        {quizImportMutation.isSuccess && (
          <Fragment>
            <ScrollToBtn direction="top" />
            <ScrollToBtn direction="bottom" />
            <TableContainer component={Paper} className="data-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lignes</TableCell>
                    <TableCell>Titre</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Niveau</TableCell>
                    <TableCell>Thème</TableCell>
                    <TableCell>Langue source</TableCell>
                    <TableCell>Langue cible</TableCell>
                    <TableCell>Erreurs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizImportMutation.data?.data.payload.data.map(
                    (e: ImportQuiz) => (
                      <TableRow
                        key={e.row}
                        className={e.errors.length > 0 ? "error" : ""}
                      >
                        <TableCell>{e.row}</TableCell>
                        <TableCell>{e.title}</TableCell>
                        <TableCell>{e.description}</TableCell>
                        <TableCell>{e.level}</TableCell>
                        <TableCell>{e.theme}</TableCell>
                        <TableCell>{e.languageSource}</TableCell>
                        <TableCell>{e.languageTarget}</TableCell>
                        <TableCell>
                          {e.errors.map((e, i) => (
                            <p key={i}>{e}</p>
                          ))}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="actions">
              <Button
                className="inline-flex"
                disabled={quizImportMutation.data?.data.payload.correct == 0}
                onClick={onConfirmUpload}
              >
                {" "}
                <AppLoaderComponent loading={confirmQuery.isFetching}>
                  <Save /> Enregistrer les{" "}
                  {quizImportMutation.data?.data.payload?.correct} lignes
                  correctes
                </AppLoaderComponent>
              </Button>
              <Button
                color="secondary"
                className="inline-flex"
                disabled={quizImportMutation.data?.data.payload.error == 0}
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
    </div>
  );
};

export default ImportQuizRoot;
