import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  LinearProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FC, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import DateRangePicker from "../../../../shared/components/date-range-picker/date-range-picker.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import NumberDashboardComponent from "../../components/number-dashboard/number-dashboard.component";
import { findGeneralDashboardData } from "../../services/dashboard.service";
import "./general-stats.root.scss";

interface GeneralStatsRootState {
  startDate?: string;
  endDate?: string;
  openPDFPopup: boolean;
}

const GeneralStatsRoot: FC = () => {
  const [state, setState] = useState<GeneralStatsRootState>({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    openPDFPopup: false,
  });
  const navigate = useNavigate();

  const dashboardDataQuery = useQuery({
    queryKey: ["dashboard/general", state?.startDate, state?.endDate],
    queryFn: () =>
      findGeneralDashboardData(
        state?.startDate as string,
        state?.endDate as string
      ),
  });

  const langUserData = useMemo(
    () => ({
      labels: dashboardDataQuery.data?.data.payload.usersPerLang.map(
        (e) => e.targetCode
      ),
      datasets: [
        {
          label: "Utilisateurs",
          data: dashboardDataQuery.data?.data.payload.usersPerLang.map(
            (e) => e.nbUser
          ),
          backgroundColor: "#94b5e9",
          borderColor: "#94b5e9",
          // borderRadius: 10,
          barPercentage: 1,
          datalabels: {
            labels: {
              title: null,
            },
          },
        },
      ],
    }),
    [dashboardDataQuery.data]
  );
  const sessionData = useMemo(
    () => ({
      labels: dashboardDataQuery.data?.data.payload.hourlySession?.map(
        (e) => e.h
      ),
      datasets: [
        {
          label: "Apprentissage",
          data: dashboardDataQuery.data?.data.payload.hourlySession?.map(
            (e) => e.totalLearning
          ),
          backgroundColor: "#AFECA8",
          borderColor: "#AFECA8",
          borderRadius: 10,
          barPercentage: 1,
          datalabels: {
            labels: {
              title: null,
            },
          },
        },
        {
          label: "Révision",
          data: dashboardDataQuery.data?.data.payload.hourlySession?.map(
            (e) => e.totalReview
          ),
          backgroundColor: "#94b5e9",
          borderColor: "#94b5e9",
          borderRadius: 10,
          barPercentage: 1,
          datalabels: {
            labels: {
              title: null,
            },
          },
        },
      ],
    }),
    [dashboardDataQuery.data]
  );

  const plugin = {
    id: "custom_canvas_background_color",
    beforeDraw: (chart: any) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, chart.width + 1, chart.height);
      ctx.restore();
    },
  };

  const users = useMemo(
    () => dashboardDataQuery.data?.data.payload.signedUser,
    [dashboardDataQuery.data]
  );
  const avgSession = useMemo(
    () => dashboardDataQuery.data?.data.payload.avgSessionPerDay,
    [dashboardDataQuery.data]
  );
  const chartRef = useRef<any>(null);
  const form = useForm();

  const chartRefs = {
    packages: useRef<any>(null),
    quiz: useRef<any>(null),
    users: useRef<any>(null),
    sessions: useRef<any>(null),
  };

  const generatePDF = (data: Record<string, boolean | undefined>) => {
    console.log(data);
    console.log(chartRefs);

    const doc = new jsPDF("portrait", "px", "A4");
    let top = 40;
    const padding = 20;
    const canvaMargin = 30;
    const width = doc.internal.pageSize.width - padding * 4;
    const height = data.manyPage
      ? doc.internal.pageSize.height / 2
      : 3 * (doc.internal.pageSize.height / 8); // 1/2 of the page or 1/2 of 1/4
    let count = 0;

    // title
    doc.setFont("Helvetica", "", "bold");
    const lineHeight = 15;

    let title = `Statistiques générales Mémolingua`;
    doc.setFontSize(16);
    doc.text(
      title,
      doc.internal.pageSize.width / 2 - doc.getTextWidth(title) / 2,
      top
    );
    top += lineHeight;

    doc.setFontSize(14);
    title = `${
      state.startDate ? dayjs(state.startDate).format("DD MMM YYYY") : ""
    } - ${state.endDate ? dayjs(state.endDate).format("DD MMM YYYY") : ""}`;
    doc.text(
      title,
      doc.internal.pageSize.width / 2 - doc.getTextWidth(title) / 2,
      top
    );
    top += lineHeight * 2;

    doc.setFont("Helvetica", "", "bold");
    doc.setFontSize(12);

    // TABS
    let tableData = [];
    if (data.packages) {
      title = `Tendance d'apprentissage des thèmes parmi les paquets:`;
      doc.text(title, padding, top);
      doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
      top += lineHeight;
      doc.setFont("Helvetica", "", "normal");
      tableData = (
        dashboardDataQuery.data?.data.payload.usersPerThemeOnPackages ?? []
      ).map((u) => [
        u.idTheme,
        u.label,
        u.nbr,
        `${((u.nbr / (users as number)) * 100).toFixed(2)} %`,
      ]);

      autoTable(doc, {
        startY: top,
        theme: "grid",
        tableWidth: data.manyPage ? width : width / 1.5,
        head: [["Id", "Label", "Nombre d'utilisateurs", "Pourcentage"]],
        body: tableData,
        didDrawPage: (d) => {
          top = d.cursor?.y as number;
        },
        columnStyles: {
          2: {
            halign: "right",
          },
          3: {
            halign: "right",
          },
        },
        // headStyles: {
        //   fillColor
        // }
      });
      count += 1;
    }
    top += lineHeight * 2;

    doc.setFont("Helvetica", "", "bold");
    if (data.quiz) {
      if (count > 0 && data.manyPage) {
        doc.addPage();
        top = 40;
      }
      title = `Tendance des thèmes parmi les quiz:`;
      doc.text(title, padding, top);
      doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
      top += lineHeight;
      doc.setFont("Helvetica", "", "normal");
      tableData = (
        dashboardDataQuery.data?.data.payload.usersPerThemeOnQuiz ?? []
      ).map((u) => [
        u.idTheme,
        u.label,
        u.nbr,
        `${((u.nbr / (users as number)) * 100).toFixed(2)} %`,
      ]);

      autoTable(doc, {
        startY: top,
        theme: "grid",
        tableWidth: data.manyPage ? width : width / 1.5,
        head: [["Id", "Label", "Nombre d'utilisateurs", "Pourcentage"]],
        body: tableData,
        didDrawPage: (d) => {
          top = d.cursor?.y as number;
        },
        columnStyles: {
          2: {
            halign: "right",
          },
          3: {
            halign: "right",
          },
        },
        // headStyles: {
        //   fillColor
        // }
      });
      count += 1;
    }
    top += lineHeight * 2;

    // CHART
    doc.setFont("Helvetica", "", "bold");
    let canva = null;
    if (data.users) {
      if (
        count > 0 &&
        (height + top > doc.internal.pageSize.getHeight() || data.manyPage)
      ) {
        doc.addPage();
        top = 40;
      }

      title = `Répartition des apprenants par langue:`;
      doc.text(title, padding, top);
      doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
      top += lineHeight;
      canva = chartRefs.users.current!.canvas as HTMLCanvasElement;
      doc.addImage(canva, "png", padding, top, width, height);
      top += height + canvaMargin;
      count += 1;
    }

    if (data.sessions) {
      if (
        count > 0 &&
        (height + top > doc.internal.pageSize.getHeight() || data.manyPage)
      ) {
        doc.addPage();
        top = 40;
      }
      title = `Nombre totale de sessions par heure:`;
      doc.text(title, padding, top);
      doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
      top += lineHeight;
      canva = chartRefs.sessions.current!.canvas as HTMLCanvasElement;
      doc.addImage(canva, "png", padding, top, width, height);
      top += height + canvaMargin;
      count += 1;
    }

    doc.save(
      `Statistiques-generale-Mémolingua-${state.startDate?.replace(
        "-",
        "/"
      )}-${state.endDate?.replace("-", "/")}.pdf`
    );
  };

  const pdfFormOptions = form.watch();

  const invalidPdfOptions = useMemo(
    () =>
      Object.keys(pdfFormOptions)
        .slice(0, -1)
        .every((k) => !pdfFormOptions[k]),
    [pdfFormOptions]
  );

  return (
    <>
      <div className="general-stats-root">
        <div className="header">
          <h1>Statistiques générales</h1>
          <Button
            onClick={() => {
              console.log(chartRef.current?.canvas);
              // pdftest();
              setState((state) => ({ ...state, openPDFPopup: true }));
            }}
          >
            test
          </Button>
        </div>
        <section className="general-stats-root_main">
          <div className="filter">
            <DateRangePicker
              onSubmit={(data: { start: Dayjs; end: Dayjs }) => {
                setState((state) => ({
                  ...state,
                  startDate: data.start.format("YYYY-MM-DD"),
                  endDate: data.end.format("YYYY-MM-DD"),
                }));
              }}
            />
          </div>
          <AppLoaderComponent loading={dashboardDataQuery.isFetching}>
            <div className="numbers">
              <div className="numbers_item">
                <NumberDashboardComponent
                  icon={"fas fa-users" as IconProp}
                  nbr={users as number}
                  label={"Utilisateurs inscrits"}
                />
              </div>
              <div className="numbers_item">
                <NumberDashboardComponent
                  icon={"fas fa-book-open" as IconProp}
                  nbr={avgSession as number}
                  label={"Session/jour"}
                />
              </div>
              <div className="numbers_item">
                <div className="number-item">
                  <Link to={`/stats/details`}>
                    <Button>Voir les détails par langue</Button>
                  </Link>
                </div>
              </div>
            </div>
          </AppLoaderComponent>

          <div className="charts">
            <div className="middle">
              <div className="left">
                <AppLoaderComponent loading={dashboardDataQuery.isFetching}>
                  <div className="user-lang">
                    <div
                      className="folder"
                      data-content="Nombre d'utilisateurs par langue"
                    >
                      <div className="user-lang_chart chart-div">
                        <div className="chart-body">
                          <Bar
                            id="user-lang-chart"
                            data={langUserData}
                            plugins={[plugin]}
                            ref={chartRefs.users}
                            options={{
                              events: ["click"],
                              onClick(_event, elements) {
                                if (elements[0]) {
                                  navigate(
                                    `/stats/details?lang=${
                                      dashboardDataQuery.data?.data.payload
                                        .usersPerLang[elements[0].index]
                                        .idLanguageTarget
                                    }`
                                  );
                                }
                              },
                              maintainAspectRatio: false,
                              plugins: {
                                title: {
                                  display: true,
                                  text: "Nombre d'utilisateurs par langue",
                                  position: "bottom",
                                },
                                legend: {
                                  display: true,
                                },
                              },
                              scales: {
                                y: {
                                  max: 20,
                                  title: {
                                    text: "Utilisateurs",
                                    display: true,
                                  },
                                },
                                x: {
                                  max: 24,
                                  title: {
                                    text: "Langues",
                                    display: true,
                                  },
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AppLoaderComponent>
              </div>

              <div className="right">
                <AppLoaderComponent loading={dashboardDataQuery.isFetching}>
                  <div className="linear-stat">
                    <h3>Tendance des thèmes </h3>
                    <div className="linear-stat-body" ref={chartRefs.packages}>
                      {dashboardDataQuery.data?.data.payload.usersPerThemeOnPackages.map(
                        (e) => (
                          <div className="theme-item" key={`pack-${e.idTheme}`}>
                            <p className="no-margin">{e?.label}</p>
                            <div className="progress-div">
                              <LinearProgress
                                value={(e?.nbr / (users as number)) * 100}
                                // value={(t.nbr / totalUsers) * 100}
                                variant="determinate"
                                color="accent"
                                className="progress-bar"
                              />
                              <div className="progress-label">
                                <small>
                                  {(
                                    (e?.nbr / (users as number)) *
                                    100
                                  ).toLocaleString("fr", {
                                    maximumFractionDigits: 2,
                                  })}
                                  %
                                </small>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </AppLoaderComponent>
                <AppLoaderComponent loading={dashboardDataQuery.isFetching}>
                  <div className="linear-stat">
                    <h3>Tendance des thèmes sur les quiz</h3>
                    <div className="linear-stat-body">
                      {dashboardDataQuery.data?.data.payload.usersPerThemeOnQuiz.map(
                        (e) => (
                          <div className="theme-item" key={`quiz-${e.idTheme}`}>
                            <p className="no-margin">{e?.label}</p>
                            <div className="progress-div">
                              <LinearProgress
                                value={(e?.nbr / (users as number)) * 100}
                                // value={(t.nbr / totalUsers) * 100}
                                variant="determinate"
                                color="accent"
                                className="progress-bar"
                              />
                              <div className="progress-label">
                                <small>
                                  {(
                                    (e?.nbr / (users as number)) *
                                    100
                                  ).toLocaleString("fr", {
                                    maximumFractionDigits: 2,
                                  })}
                                  %
                                </small>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </AppLoaderComponent>
              </div>
            </div>
            <AppLoaderComponent loading={dashboardDataQuery.isFetching}>
              <div className="bottom">
                <div
                  className="folder"
                  data-content="Nombre totale de session par heure"
                >
                  <div className="hourly-session_chart chart-div">
                    <div className="chart-body">
                      <Bar
                        id="hourly-session-chart"
                        data={sessionData}
                        plugins={[plugin]}
                        ref={chartRefs.sessions}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            title: {
                              display: true,
                              text: "Nombre totale de session par heure",
                              position: "bottom",
                            },
                            legend: {
                              display: true,
                            },
                          },
                          scales: {
                            y: {
                              max: 20,
                              title: { text: "Nb", display: true },
                            },
                            x: {
                              max: 24,
                              title: {
                                text: "Heures",
                                display: true,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AppLoaderComponent>
          </div>
        </section>
      </div>
      <Dialog
        open={state.openPDFPopup}
        onClose={() => setState((state) => ({ ...state, openPDFPopup: false }))}
      >
        <div className="dialog-content">
          <h2 className="text-center">Configurer le PDF</h2>
          <form onSubmit={form.handleSubmit(generatePDF)}>
            <div>
              <h3>Choisir les graphes</h3>
              {/* <div>
                <FormControlLabel
                  label="Tous"
                  control={
                    <Checkbox
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        console.log("change", Object.keys(pdfFormOptions));
                        // form.setValue("quiz", true);
                        const keys =
                          Object.keys(pdfFormOptions).length > 0
                            ? Object.keys(pdfFormOptions)
                            : Object.keys(form.watch());

                        keys.slice(0, -1).forEach((k) => {
                          console.log(k);
                          form.setValue(k, event.target.checked);
                        });
                      }}
                      // indeterminate
                    />
                  }
                />
              </div> */}
              <Controller
                control={form.control}
                name="packages"
                render={({ field }) => (
                  <FormControlLabel
                    label="Tendance des thèmes sur les paquets"
                    {...field}
                    control={<Checkbox />}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="quiz"
                render={({ field }) => (
                  <FormControlLabel
                    label="Tendance des thèmes sur les quiz"
                    control={<Checkbox {...field} />}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormControlLabel
                    label="Nombre d'utilisateurs par langue"
                    control={<Checkbox {...field} />}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="sessions"
                render={({ field }) => (
                  <FormControlLabel
                    label="Nombre total de session par heure"
                    control={<Checkbox {...field} />}
                  />
                )}
              />
            </div>
            <div>
              <h3>Mise en page</h3>

              <Controller
                control={form.control}
                name="manyPage"
                render={({ field }) => (
                  <FormControlLabel
                    label="Un graphe par page"
                    control={<Checkbox {...field} />}
                  />
                )}
              />
            </div>
            <div className="text-center">
              <Button
                variant="contained"
                type="submit"
                disabled={invalidPdfOptions}
              >
                Générer
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default GeneralStatsRoot;
