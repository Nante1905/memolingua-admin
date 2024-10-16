import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FC } from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../../../../shared/components/inputs/text-input/text-input.component";
import { AppReponseError } from "../../../../shared/types/Error";
import { Level } from "../../../../shared/types/Level";
import { AppResponse } from "../../../../shared/types/Response";
import { levelSchema } from "../../helpers/validator";
import { createLevel, updateLevel } from "../../services/level.service";
import "./level-form.component.scss";

interface LevelFormComponentProps {
  update?: Level;
}

const LevelFormComponent: FC<LevelFormComponentProps> = (props) => {
  const form = useForm({
    defaultValues: { ...props.update },
    resolver: zodResolver(levelSchema),
  });

  const createLevelMutation = useMutation({
    mutationKey: ["level/create"],
    mutationFn: (data: object) => createLevel(data),
    onSuccess: (res: AppResponse<unknown>) => {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
    },
    onError: (err: AppReponseError<unknown>) => {
      enqueueSnackbar({ message: err.response?.data.error, variant: "error" });
    },
  });
  const updateLevelMutation = useMutation({
    mutationKey: ["level/update"],
    mutationFn: (data: object) => updateLevel(props.update?.id as string, data),
    onSuccess: (res: AppResponse<unknown>) => {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
    },
    onError: (err: AppReponseError<unknown>) => {
      enqueueSnackbar({ message: err.response?.data.error, variant: "error" });
    },
  });

  const onSubmit = (data: object) => {
    if (!props.update) {
      createLevelMutation.mutate(data);
    } else {
      updateLevelMutation.mutate(data);
    }
  };

  return (
    <div className="level-form">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="form">
          <h1>
            {props.update ? "Éditer un niveau" : "Créer un nouveau niveau"}
          </h1>
          <InputComponent
            control={form.control}
            name="label"
            label="Label"
            type="text"
          />
          <InputComponent
            type="number"
            control={form.control}
            name="minPts"
            label="Points min"
          />
          <InputComponent
            type="number"
            control={form.control}
            name="maxPts"
            label="Point max"
          />
          <Button className="form-input" type="submit" variant="contained">
            {props.update ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LevelFormComponent;
