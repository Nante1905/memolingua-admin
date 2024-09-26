import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Button, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { FC, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import DateRangePicker from "../../../../shared/components/date-range-picker/date-range-picker.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import NumberDashboardComponent from "../../components/number-dashboard/number-dashboard.component";
import { findGeneralDashboardData } from "../../services/dashboard.service";
import "./general-stats.root.scss";

interface GeneralStatsRootState {
  startDate: string;
  endDate: string;
}

const GeneralStatsRoot: FC = () => {
  const [state, setState] = useState<GeneralStatsRootState>();
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

  const users = useMemo(
    () => dashboardDataQuery.data?.data.payload.signedUser,
    [dashboardDataQuery.data]
  );
  const avgSession = useMemo(
    () => dashboardDataQuery.data?.data.payload.avgSessionPerDay,
    [dashboardDataQuery.data]
  );

  return (
    <div className="general-stats-root">
      <div className="header">
        <h1>Statistiques générales</h1>
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
                          options={{
                            events: ["click"],
                            onClick(event, elements) {
                              // console.log(elements);
                              if (elements[0]) {
                                navigate(
                                  `/stats/details?lang=${
                                    dashboardDataQuery.data?.data.payload
                                      .usersPerLang[elements[0].index]
                                      .idLanguageTarget
                                  }`
                                );
                              }
                              console.log(
                                dashboardDataQuery.data?.data.payload
                                  .usersPerLang[elements[0].index]
                              );
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
                                title: { text: "Utilisateurs", display: true },
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
                  <div className="linear-stat-body">
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
  );
};

export default GeneralStatsRoot;
