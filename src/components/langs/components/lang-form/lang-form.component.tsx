import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputComponent from "../../../../shared/components/inputs/text-input/text-input.component";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { Langage } from "../../../../shared/types/Langage";
import { createLang, updateLang } from "../../services/lang.service";
import { langSchema } from "../helpers/lang.validator";
import "./lang-form.component.scss";

interface LangFormComponentProps {
  update?: Langage;
}

const LangFormComponent: FC<LangFormComponentProps> = (props) => {
  const form = useForm({
    resolver: zodResolver(langSchema),
    defaultValues: { ...props?.update },
  });

  const navigate = useNavigate();

  const langMutationCreate = useMutation({
    mutationKey: ["langs/create"],
    mutationFn: (data: object) => createLang(data),
    onSuccess(res: AxiosResponse<ApiResponse>) {
      enqueueSnackbar({
        message: res.data.message,
        variant: "success",
        onClose: () => navigate("/langs", { replace: true }),
      });
    },
    onError(err: AxiosError<ApiResponse>) {
      enqueueSnackbar({
        message: err.response?.data.error,
        variant: "error",
      });
    },
  });
  const langMutationUpdate = useMutation({
    mutationKey: ["langs/update"],
    mutationFn: (data: object) =>
      updateLang({ data, id: props.update?.id as string }),
    onSuccess(res: AxiosResponse<ApiResponse>) {
      enqueueSnackbar({
        message: res.data.message,
        variant: "success",
        onClose: () => navigate("/langs", { replace: true }),
      });
    },
    onError(err: AxiosError<ApiResponse>) {
      enqueueSnackbar({
        message: err.response?.data.error,
        variant: "error",
      });
    },
  });

  const handleSubmit = (data: object) => {
    if (props.update) {
      langMutationUpdate.mutate(data);
      //   console.log(data);
    } else {
      langMutationCreate.mutate(data);
    }
  };

  return (
    <div className="lang-form">
      <div className="container">
        <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
          <div className="form">
            <h1>
              {props.update ? "Mettre à jour la langue" : "Créer une langue"}
            </h1>
            <InputComponent
              type={"text"}
              name={"label"}
              control={form.control}
              label={"Label"}
            />
            <InputComponent
              type={"text"}
              name={"code"}
              control={form.control}
              label={"Code"}
            />
            <div className="form-input">
              <Button type="submit" color="primary" variant="contained">
                {props.update ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LangFormComponent;
