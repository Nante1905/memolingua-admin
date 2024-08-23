import { useQuery } from "@tanstack/react-query";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import QuizFormComponent from "../../components/quiz-form/quiz-form.component";
import {
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
          />
        </AppLoaderComponent>
      </div>
    </div>
  );
};

export default QuizCreationRoot;
