import { Check, Close, Download, Save } from "@mui/icons-material";
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
import { downloadFile } from "../../../../shared/helpers/download.helper";
import QuizImportFormComponent from "../../components/quiz-import-form/quiz-import-form.component";
import {
  confirmQuestionImport,
  downloadQuestionCsv,
  importQuestion,
} from "../../services/quiz.service";
import { ImportQuestion } from "../../types/ImportQuestion";
import "./question-import.root.scss";

const QuestionImportRoot = () => {
  const questionImportMutation = useMutation({
    mutationKey: ["quiz/import"],
    mutationFn: (data: object) => importQuestion(data),
  });

  const onSubmit = (data: object) => {
    questionImportMutation.mutate(data);
  };

  const confirmQuery = useQuery({
    queryKey: ["question/import/confirm"],
    queryFn: confirmQuestionImport,
    enabled: false,
    retry: false,
  });

  const downloadQuery = useQuery({
    queryKey: ["question/import/download"],
    queryFn: downloadQuestionCsv,
    enabled: false,
    retry: false,
  });

  const onDownloadFile = useCallback(() => {
    downloadQuery.refetch().then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data?.data], { type: "text/csv" })
      );
      downloadFile(url, `questions-data-${Date.now()}.csv`);
    });
  }, [downloadQuery]);

  const onConfirm = useCallback(() => {
    confirmQuery.refetch().then((res) => {
      if (res.isSuccess) {
        enqueueSnackbar({
          variant: "success",
          message: res.data?.data.message,
        });
      }
    });
  }, [confirmQuery]);

  return (
    <div className="quesiton-import-root import-root">
      <h1 style={{ textAlign: "center" }}>
        Importer en format csv les questions et réponses
      </h1>
      <div className="form-container">
        <QuizImportFormComponent
          onSubmit={onSubmit}
          loading={false}
          label="Importer le fichier csv"
        />
      </div>
      {questionImportMutation.data?.data.payload.error &&
        questionImportMutation.data?.data.payload.error > 0 && (
          <p style={{ marginLeft: "20px", color: "red" }}>
            Lignes en erreurs :{" "}
            {questionImportMutation.data?.data.payload.error}
          </p>
        )}
      <div className="import-result">
        {questionImportMutation.isSuccess && (
          <Fragment>
            <TableContainer component={Paper} className="data-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lignes</TableCell>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Est QCM</TableCell>
                    <TableCell>Réponse</TableCell>
                    <TableCell>Est correcte</TableCell>
                    <TableCell>Erreurs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questionImportMutation.data?.data.payload.data.map(
                    (e: ImportQuestion) => (
                      <TableRow
                        key={e.row}
                        className={e.errors.length > 0 ? "error" : ""}
                      >
                        <TableCell>{e.row}</TableCell>
                        <TableCell>{e.quiz}</TableCell>
                        <TableCell>{e.question}</TableCell>
                        <TableCell>
                          {e.isqcm == 1 ? (
                            <Check color="primary" />
                          ) : (
                            <Close color="error" />
                          )}
                        </TableCell>
                        <TableCell>{e.reponse}</TableCell>
                        <TableCell>
                          {e.iscorrect == 1 ? (
                            <Check color="primary" />
                          ) : (
                            <Close color="error" />
                          )}
                        </TableCell>
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
                disabled={
                  questionImportMutation.data?.data.payload.correct == 0
                }
                onClick={onConfirm}
              >
                {" "}
                <AppLoaderComponent loading={confirmQuery.isFetching}>
                  <Save /> Enregistrer les{" "}
                  {questionImportMutation.data?.data.payload?.correct} lignes
                  correctes
                </AppLoaderComponent>
              </Button>
              <Button
                color="secondary"
                className="inline-flex"
                disabled={questionImportMutation.data?.data.payload.error == 0}
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

export default QuestionImportRoot;
