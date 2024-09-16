import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../../../../shared/components/inputs/text-input/text-input.component";
import { QuizAnswer } from "../../../../shared/types/QuizAnswer";
import { answerSchema } from "../../helpers/quiz.helper";
import "./answer-form.component.scss";

interface AnswerFormComponentProps {
  defaultValues: Partial<QuizAnswer>;

  onSubmit: (data: object) => void;
}

const AnswerFormComponent: FC<AnswerFormComponentProps> = (props) => {
  const form = useForm<any>({
    defaultValues: {
      answer: props.defaultValues?.answer,
      isCorrect: props.defaultValues?.isCorrect,
    },
    resolver: zodResolver(answerSchema),
  });

  return (
    <div className="answer-form">
      <form onSubmit={form.handleSubmit((data) => props.onSubmit(data))}>
        <div className="form">
          <h1>Modifier une Réponse</h1>
          <div className="form-input">
            <InputComponent
              control={form.control}
              name="answer"
              type="text"
              label="Réponse"
            />
          </div>
          <div className="form-input">
            <Button variant="contained" type="submit">
              Valider
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnswerFormComponent;
