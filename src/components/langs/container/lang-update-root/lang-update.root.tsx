import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import LangFormComponent from "../../components/lang-form/lang-form.component";
import { findLangById } from "../../services/lang.service";

const LangUpdateRoot = () => {
  const params = useParams<{ id: string }>();
  const langsQuery = useQuery({
    queryKey: ["langs/byid"],
    queryFn: () => findLangById(params?.id as string),
    enabled: params.id != undefined,
  });

  return (
    <div className="lang-update-root">
      <section className="lang-update-root_main">
        <AppLoaderComponent loading={langsQuery.isFetching}>
          {" "}
          <LangFormComponent update={langsQuery.data?.data.payload} />
        </AppLoaderComponent>
      </section>
    </div>
  );
};

export default LangUpdateRoot;
