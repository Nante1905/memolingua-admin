import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { AppReponseError } from "../../../../shared/types/Error";
import { AppResponse } from "../../../../shared/types/Response";
import QuestionFormUpdate from "../../components/question-form-update/question-form-update.component";
import { findQuestionById, updateQuestion } from "../../services/quiz.service";

const QuestionUpdateRoot = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const questionQuery = useQuery({
    queryKey: ["question/id", params.id],
    queryFn: () => findQuestionById(params.id as string),
  });

  const questionUpdateMutation = useMutation({
    mutationKey: ["question/update"],
    mutationFn: (data: any) => updateQuestion(params.id as string, data),
    onSuccess: (res: AppResponse<unknown>) => {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
      navigate("/questions", { replace: true });
    },
    onError: (err: AppReponseError<unknown>) => {
      enqueueSnackbar({ message: err.response?.data.error, variant: "error" });
    },
  });

  const handleSubmit = (data: any) => {
    console.log(data);
    questionUpdateMutation.mutate(data);
  };

  return (
    <div className="question-update-root">
      <section className="question-update-root_main">
        <AppLoaderComponent loading={questionQuery.isFetching}>
          <QuestionFormUpdate
            title="Mise à jour question"
            defaultValues={questionQuery.data?.data.payload}
            onSubmit={(data) => handleSubmit(data)}
            loading={questionUpdateMutation.isPending}
          />
        </AppLoaderComponent>
      </section>
    </div>
  );
};

export default QuestionUpdateRoot;
