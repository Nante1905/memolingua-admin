import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import QuizFormComponent from "../../components/quiz-form/quiz-form.component";
import {
  findAllLangs,
  findAllLevels,
  findAllThemes,
  findQuizById,
  updateQuiz,
} from "../../services/quiz.service";

const QuizUpdateRoot = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const quizByIdQuery = useQuery({
    queryKey: ["query/id"],
    queryFn: () => findQuizById(params.id as string),
    enabled: params.id != undefined,
  });

  const quizUpdateMutation = useMutation({
    mutationKey: ["quiz-create"],
    mutationFn: (data: unknown) => updateQuiz(params.id as string, data),
    onSuccess(res: AxiosResponse<ApiResponse>) {
      enqueueSnackbar({
        message: res.data.message,
        variant: "success",
        onClose: () => navigate("/quizs"),
      });
    },
    onError(err: AxiosError<ApiResponse>) {
      enqueueSnackbar({ message: err.response?.data.error, variant: "error" });
    },
  });

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

  return (
    <div className="quiz-update-root">
      <section className="quiz-update-root_main">
        <AppLoaderComponent
          loading={
            langsQuery.isFetching ||
            levelsQuery.isFetching ||
            themesQuery.isFetching ||
            quizByIdQuery.isFetching
          }
        >
          <QuizFormComponent
            langs={langsQuery.data?.data.payload}
            levels={levelsQuery.data?.data.payload}
            themes={themesQuery.data?.data.payload}
            onSubmit={(data: object): void => {
              quizUpdateMutation.mutate(data);
            }}
            defaultValues={quizByIdQuery.data?.data.payload}
            title="Mise à jour Quiz"
            action="Mettre à jour"
            update
          />
        </AppLoaderComponent>
      </section>
    </div>
  );
};

export default QuizUpdateRoot;
