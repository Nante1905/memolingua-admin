import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { AppReponseError } from "../../../../shared/types/Error";
import { AppResponse } from "../../../../shared/types/Response";
import AnswerFormComponent from "../../components/answer-form/answer-form.component";
import { findAnswerById, updateAnswer } from "../../services/quiz.service";

const AnswerUpdateRoot = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const answerQuery = useQuery({
    queryKey: ["answer/id", params.id],
    queryFn: () => findAnswerById(params.id as string),
    enabled: params.id != undefined,
  });

  const answerUpdateMutation = useMutation({
    mutationKey: ["answer/update"],
    mutationFn: (data: object) => updateAnswer(params.id as string, data),
    onSuccess: (res: AppResponse<unknown>) => {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
      navigate("/answers", { replace: true });
    },
    onError: (err: AppReponseError<unknown>) => {
      enqueueSnackbar({
        message: err.response?.data.error ?? err.message,
        variant: "error",
      });
    },
  });

  const handleSubmit = (data: object) => {
    console.log(data);
    answerUpdateMutation.mutate(data);
  };

  return (
    <div className="answer-update-root">
      <AppLoaderComponent loading={answerQuery.isFetching}>
        <AnswerFormComponent
          onSubmit={handleSubmit}
          defaultValues={answerQuery.data?.data.payload}
        />
      </AppLoaderComponent>
    </div>
  );
};

export default AnswerUpdateRoot;
