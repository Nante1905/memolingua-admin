import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import QuizFormComponent from "../../components/quiz-form/quiz-form.component";
import {
  createQuiz,
  findAllLangs,
  findAllLevels,
  findAllThemes,
} from "../../services/quiz.service";
import "./quiz-creation.root.scss";

const QuizCreationRoot = () => {
  const langsQuery = useQuery({
    queryKey: ["langs"],
    queryFn: findAllLangs,
  });
  const themesQuery = useQuery({
    queryKey: ["themes"],
    queryFn: findAllThemes,
  });
  const levelsQuery = useQuery({
    queryKey: ["levels"],
    queryFn: findAllLevels,
  });

  const quizCreateMutation = useMutation({
    mutationKey: ["quiz-create"],
    mutationFn: (data: unknown) => createQuiz(data),
    onSuccess(res: AxiosResponse<ApiResponse>) {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
    },
    onError(err: AxiosError<ApiResponse>) {
      enqueueSnackbar({ message: err.response?.data.error, variant: "error" });
    },
  });

  return (
    <div className="quiz-creation-root">
      <header>
        <h1>Création quiz</h1>
      </header>
      <div className="quiz-creation-content">
        <AppLoaderComponent
          loading={
            langsQuery.isFetching ||
            themesQuery.isFetching ||
            levelsQuery.isFetching
          }
        >
          <QuizFormComponent
            langs={langsQuery.data?.data.payload}
            levels={levelsQuery.data?.data.payload}
            themes={themesQuery.data?.data.payload}
            loading={quizCreateMutation.isPending}
            onSubmit={(data) => {
              quizCreateMutation.mutate(data);
            }}
            action="Créer"
          />
        </AppLoaderComponent>
      </div>
    </div>
  );
};

export default QuizCreationRoot;
