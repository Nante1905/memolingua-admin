import { Star } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import dayjs from "dayjs";
import React, { Fragment, useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { getFlagLink } from "../../../../shared/services/api/flags/flag-api.service";
import { StatsDetails } from "../../types/dashboard.type";
import "./details-dashboard.component.scss";

interface DetailsDashboardProps {
  isFetching: boolean;
  stats?: StatsDetails;
}

const DetailsDashboardComponent: React.FC<DetailsDashboardProps> = (props) => {
  const totalUser = props.stats?.stats.totalUser ?? 0;
  const sessionData = useMemo(
    () => ({
      labels: props.stats?.stats.sessions.map((s) => s.h),
      datasets: [
        {
          label: "Apprentissage",
          data: props.stats?.stats.sessions.map((s) => s.totalLearning),
          backgroundColor: "#AFECA8",
          borderColor: "#AFECA8",
          borderRadius: 10,
          barPercentage: 1,
        },
        {
          label: "Révision",
          data: props.stats?.stats.sessions.map((s) => s.totalReview),
          backgroundColor: "#94b5e9",
          borderColor: "#94b5e9",
          borderRadius: 10,
          barPercentage: 1,
        },
      ],
    }),
    [props]
  );

  const levelData = useMemo(
    () => ({
      labels: props.stats?.stats.levels.map((l) => l.label),
      datasets: [
        {
          label: "Niveau",
          data: props.stats?.stats.levels.map((l) => l.nbr),
        },
      ],
    }),
    [props]
  );

  return (
    <>
      {!props.isFetching && (
        <div className="details-dashboard-header text-center">
          <div className="inline-flex">
            <h2>
              {props.stats?.stats.lang.label}({props.stats?.stats.lang.code})
            </h2>
            <img
              src={getFlagLink(props.stats?.stats.lang.code as string, 48)}
              alt={props.stats?.stats.lang.code}
            />
          </div>
          <p className="no-margin">
            {dayjs(props.stats?.start as string).format("DD MMM YYYY")} au{" "}
            {dayjs(props.stats?.end as string).format("DD MMM YYYY")}{" "}
          </p>
        </div>
      )}
      <div className="details-dashboard-body">
        <div className="up">
          <div
            className="folder"
            data-content="Nombre totale de session par heure"
          >
            <div className="session-chart chart-div">
              <div className="chart-body">
                <AppLoaderComponent loading={props.isFetching}>
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
                        datalabels: {
                          listeners: {
                            click: () => {
                              console.log("click");
                            },
                          },
                          labels: {
                            title: null,
                          },
                        },
                      },
                      scales: {
                        y: {
                          max: 10,
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
                </AppLoaderComponent>
              </div>
            </div>
          </div>
        </div>
        <div className="down">
          <div className="left">
            <div className="linear-stat">
              <h3>Tendance des thèmes</h3>
              <div className="linear-stat-body">
                <AppLoaderComponent loading={props.isFetching}>
                  {props.stats?.stats.packages.map((t) => (
                    <div className="theme-item" key={t.idTheme}>
                      <p className="no-margin">{t.label}</p>
                      <div className="progress-div">
                        <LinearProgress
                          value={totalUser > 0 ? (t.nbr / totalUser) * 100 : 0}
                          variant="determinate"
                          color="accent"
                          className="progress-bar"
                        />
                        <div className="progress-label">
                          <small>
                            {(totalUser > 0
                              ? (t.nbr / totalUser) * 100
                              : 0
                            ).toLocaleString("fr", {
                              maximumFractionDigits: 2,
                            })}
                            %
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </AppLoaderComponent>
              </div>
              <p className="caption">
                *Pourcentage d'utilisateur ayant appris le thème.
              </p>
            </div>
            <div className="linear-stat">
              <h3>Tendance des quiz</h3>
              <div className="linear-stat-body">
                <AppLoaderComponent loading={props.isFetching}>
                  {props.stats?.stats.quiz.map((t) => (
                    <div className="theme-item" key={t.idTheme}>
                      <p className="no-margin">{t.label}</p>
                      <div className="progress-div">
                        <LinearProgress
                          value={totalUser > 0 ? (t.nbr / totalUser) * 100 : 0}
                          variant="determinate"
                          color="accent"
                          className="progress-bar"
                        />
                        <div className="progress-label">
                          <small>
                            {(totalUser > 0
                              ? (t.nbr / totalUser) * 100
                              : 0
                            ).toLocaleString("fr", {
                              maximumFractionDigits: 2,
                            })}
                            %
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </AppLoaderComponent>
              </div>
              <p className="caption">
                *Pourcentage d'utilisateur ayant effectué des quiz dans les
                thèmes.
              </p>
            </div>
          </div>

          <div className="right">
            <div className="levels-stat">
              <h3>Répartition par niveau</h3>
              <AppLoaderComponent loading={props.isFetching}>
                {props.stats?.stats.levels.length == 0 ? (
                  <p className="caption text-center">Aucune donnée.</p>
                ) : (
                  <Fragment>
                    <Pie
                      data={levelData}
                      id="level-chart"
                      options={{
                        plugins: {
                          autocolors: {
                            mode: "data",
                          },
                          datalabels: {
                            formatter: (value, context) => {
                              const labels = context.chart.data.labels;
                              return `${
                                labels ? labels[context.dataIndex] : ""
                              }\n(${((value / totalUser) * 100).toFixed(2)}%)`;
                            },
                            color: "#000",
                            font: {
                              weight: "bold",
                            },
                          },
                        },
                      }}
                      style={{ marginTop: "2rem" }}
                    />
                    <div className="levels-legends">
                      {props.stats?.stats.levels.map((l) => (
                        <div className="inline-flex" key={`lvl_${l.id}`}>
                          <Star color="primary" />
                          {l.label}: {l.nbr}
                        </div>
                      ))}
                    </div>
                  </Fragment>
                )}
              </AppLoaderComponent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsDashboardComponent;
