import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Level } from "../../../../shared/types/Level";
import { AppResponse } from "../../../../shared/types/Response";
import { findAllLevels } from "../../../quiz/services/quiz.service";
import LevelListComponent from "../../components/level-list/level-list.component";
import "./list.root.scss";

const LevelListRoot = () => {
  const levelsQuery = useQuery<AppResponse<Level[]>>({
    queryKey: ["levels"],
    queryFn: () => findAllLevels(),
  });

  return (
    <div className="list-root">
      <header>
        <h1>Liste des niveaux</h1>
        <Link to={"/levels/create"}>
          <Button color="secondary" variant="contained">
            Creer un niveau
          </Button>
        </Link>
      </header>
      <section className="container">
        <LevelListComponent
          levels={levelsQuery.data?.data.payload as Level[]}
          levelsLoading={levelsQuery.isFetching}
        />
      </section>
    </div>
  );
};

export default LevelListRoot;
