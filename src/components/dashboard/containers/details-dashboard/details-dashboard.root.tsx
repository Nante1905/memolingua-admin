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
import { Dayjs } from "dayjs";
import { useParams } from "react-router-dom";
import DateRangePicker from "../../../../shared/components/date-range-picker/date-range-picker.component";
import DetailsDashboardComponent from "../../components/details-dashboard/details-dashboard.component";

ChartJS.register(
  ArcElement,
  BarElement,
  Legend,
  Title,
  Tooltip,
  CategoryScale,
  LinearScale,
  autocolors
);

const DetailsDashboardRoot = () => {
  const idLang = useParams().idLang;
  return (
    <div id="details-dashboard-root">
      <h1>Détails des statistiques {idLang}</h1>
      <DateRangePicker
        onSubmit={(data: { start: Dayjs; end: Dayjs }) => {
          console.log({
            start: data.start.format("YYYY-MM-DD"),
            end: data.end.format("YYYY-MM-DD"),
          });
        }}
      />
      <DetailsDashboardComponent />
    </div>
  );
};

export default DetailsDashboardRoot;
