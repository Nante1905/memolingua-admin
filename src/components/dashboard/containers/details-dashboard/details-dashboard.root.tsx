import { useQuery } from "@tanstack/react-query";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import autocolors from "chartjs-plugin-autocolors";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import DateRangePicker from "../../../../shared/components/date-range-picker/date-range-picker.component";
import SelectInputControlledComponent from "../../../../shared/components/inputs/select-input/select-input-controlled.component";
import { Langage } from "../../../../shared/types/Langage";
import { getNonPaginatedLangs } from "../../../langs/services/lang.service";
import DetailsDashboardComponent from "../../components/details-dashboard/details-dashboard.component";
import { getDashboardDetails } from "../../services/dashboard.service";
import { StatsDetails } from "../../types/dashboard.type";
import "./details-dashboard.root.scss";

ChartJS.register(
  ArcElement,
  BarElement,
  Legend,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
  autocolors,
  ChartDataLabels
);

const DetailsDashboardRoot = () => {
  const [searchParams] = useSearchParams();
  const idLang = searchParams.get("lang");

  const [dateRange, setDateRange] = useState<{
    start?: string;
    end?: string;
  }>();
  const [lang, selectLang] = useDebounceValue(idLang, 500);

  const statQuery = useQuery({
    queryKey: ["details-stat", lang, dateRange?.start, dateRange?.end],
    queryFn: () =>
      getDashboardDetails(lang as string, dateRange?.start, dateRange?.end),
    enabled: !!lang,
    retry: false,
  });

  const langsQuery = useQuery({
    queryKey: ["langs"],
    queryFn: getNonPaginatedLangs,
  });

  return (
    <div id="details-dashboard-root">
      <div className="details-dashboard-root-header">
        <h1>Détails des statistiques</h1>

        <SelectInputControlledComponent
          items={langsQuery.data?.data?.payload as Langage[]}
          loading={langsQuery.isFetching}
          valueGetter={(item: Langage) => item?.id}
          labelGetter={(item: Langage) => item?.label}
          label={"Langue"}
          onValueChange={(value: string) => selectLang(value)}
          size="small"
          defaultValue={idLang ?? undefined}
        />
      </div>
      <DateRangePicker
        onSubmit={(data: { start: Dayjs; end: Dayjs }) => {
          setDateRange({
            start: data.start.format("YYYY-MM-DD"),
            end: data.end.format("YYYY-MM-DD"),
          });
        }}
      />
      {statQuery.isSuccess && (
        <DetailsDashboardComponent
          isFetching={statQuery.isFetching}
          stats={statQuery.data?.data.payload as StatsDetails}
        />
      )}
    </div>
  );
};

export default DetailsDashboardRoot;
