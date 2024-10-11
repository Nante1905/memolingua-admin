import { Button } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";
import InputFileComponent from "../../../../shared/components/inputs/input-file/input-file.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import "./quiz-import-form.component.scss";

interface QuizImportFormComponentProps {
  onSubmit: (data: object) => void;
  label: string;
  loading: boolean;
}

const QuizImportFormComponent: FC<QuizImportFormComponentProps> = (props) => {
  const form = useForm();

  return (
    <div className="quiz-import-form">
      <form onSubmit={form.handleSubmit((data) => props.onSubmit(data))}>
        <div className="form">
          <div className="form-input">
            <InputFileComponent
              control={form.control}
              form={form}
              name="file"
              label={props.label}
            />
          </div>
          <div className="form-input">
            <Button variant="contained" color="primary" type="submit">
              <AppLoaderComponent loading={props.loading} color="#000">
                Importer
              </AppLoaderComponent>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuizImportFormComponent;
