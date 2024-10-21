import { PictureAsPdf, Star } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  Fab,
  FormControlLabel,
  LinearProgress,
} from "@mui/material";
import dayjs from "dayjs";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Controller, useForm } from "react-hook-form";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { getFlagLinkFromCompleteCode } from "../../../../shared/services/api/flags/flag-api.service";
import { generateDetailsDashboardPDF } from "../../helper/dashboard.helper";
import { StatsDetails } from "../../types/dashboard.type";
import "./details-dashboard.component.scss";

interface DetailsDashboardProps {
  isFetching: boolean;
  stats?: StatsDetails;
  start: string;
  end: string;
}

const DetailsDashboardComponent: React.FC<DetailsDashboardProps> = (props) => {
  const totalUser = props.stats?.stats.totalUser ?? 0;

  const [openPDFPopup, setOpenPDFPopUp] = useState(false);

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

  const form = useForm();
  const chartRefs = {
    sessions: useRef<any>(null),
    levels: useRef<any>(null),
  };
  const pdfFormOptions = form.watch();

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

  const invalidPdfOptions = useMemo(
    () =>
      Object.keys(pdfFormOptions)
        .slice(0, -1)
        .every((k) => !pdfFormOptions[k]),
    [pdfFormOptions]
  );

  return (
    <>
      {!props.isFetching && (
        <Fragment>
          <div className="details-dashboard-header text-center">
            <div className="inline-flex">
              <h2>
                {props.stats?.stats.lang.label}({props.stats?.stats.lang.code})
              </h2>
              <img
                src={getFlagLinkFromCompleteCode(
                  props.stats?.stats.lang.code as string,
                  48
                )}
                alt={props.stats?.stats.lang.code}
              />
            </div>
            <p className="no-margin">
              {dayjs(props.stats?.start as string).format("DD MMM YYYY")} au{" "}
              {dayjs(props.stats?.end as string).format("DD MMM YYYY")}{" "}
            </p>
          </div>
          <Fab
            className="floating-action-btn"
            color="primary"
            onClick={() => {
              setOpenPDFPopUp(true);
            }}
          >
            <PictureAsPdf />
          </Fab>
        </Fragment>
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
                {props.stats?.stats.levels.length == 0 || totalUser == 0 ? (
                  <p className="caption text-center">Aucune donnée.</p>
                ) : (
                  <Fragment>
                    <Pie
                      data={levelData}
                      id="level-chart"
                      plugins={[plugin]}
                      ref={chartRefs.levels}
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

      <Dialog
        open={openPDFPopup}
        onClose={() => {
          setOpenPDFPopUp(false);
          form.reset();
        }}
      >
        <div className="pdf-dialog-content">
          <h2 className="text-center">Configurer le PDF</h2>
          <form
            onSubmit={form.handleSubmit((data) => {
              if (props.stats?.stats.lang) {
                console.log("manomboka");
                generateDetailsDashboardPDF(
                  data,
                  props.stats?.stats.lang,
                  chartRefs,
                  props.start,
                  props.end,
                  props.stats?.stats.packages,
                  props.stats?.stats.quiz,
                  totalUser
                );
              }
            })}
          >
            <div>
              <h3>Choisir les graphes</h3>

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
                name="levels"
                render={({ field }) => (
                  <FormControlLabel
                    label="Répartition des utilisateurs par niveau"
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

export default DetailsDashboardComponent;
