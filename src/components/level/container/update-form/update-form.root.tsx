import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import LevelFormComponent from "../../components/level-form/level-form.component";
import { getLevelById } from "../../services/level.service";

const LevelUpdateFormRoot = () => {
  const params = useParams<{ id: string }>();
  const levelQuery = useQuery({
    queryKey: ["level/id"],
    queryFn: () => getLevelById(params.id as string),
  });

  return (
    <div className="update-form-root">
      <AppLoaderComponent loading={levelQuery.isFetching}>
        <LevelFormComponent update={levelQuery.data?.data.payload} />
      </AppLoaderComponent>
    </div>
  );
};

export default LevelUpdateFormRoot;
