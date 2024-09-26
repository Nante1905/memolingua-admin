import { Star } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import { useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "./details-dashboard.component.scss";

const sessions = [
  {
    h: 0,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 1,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 2,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 3,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 4,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 5,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 6,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 7,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 8,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 9,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 10,
    totalLearning: 4,
    totalReview: 0,
  },
  {
    h: 11,
    totalLearning: 4,
    totalReview: 2,
  },
  {
    h: 12,
    totalLearning: 0,
    totalReview: 1,
  },
  {
    h: 13,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 14,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 15,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 16,
    totalLearning: 2,
    totalReview: 0,
  },
  {
    h: 17,
    totalLearning: 1,
    totalReview: 0,
  },
  {
    h: 18,
    totalLearning: 1,
    totalReview: 0,
  },
  {
    h: 19,
    totalLearning: 1,
    totalReview: 0,
  },
  {
    h: 20,
    totalLearning: 1,
    totalReview: 0,
  },
  {
    h: 21,
    totalLearning: 1,
    totalReview: 0,
  },
  {
    h: 22,
    totalLearning: 1,
    totalReview: 0,
  },
  {
    h: 23,
    totalLearning: 0,
    totalReview: 0,
  },
  {
    h: 24,
    totalLearning: 0,
    totalReview: 0,
  },
];
const totalUsers = 30;
const themes = [
  {
    idTheme: "THM002",
    label: "Famille",
    icon: "users",
    nbr: 7,
  },
  {
    idTheme: "THM001",
    label: "Nourritures",
    icon: "cutlery",
    nbr: 22,
  },
];
const levels = [
  {
    id: "LVL01",
    label: "Débutant",
    nbr: 2,
  },
  {
    id: "LVL02",
    label: "Intermédiaire",
    nbr: 1,
  },
];

const DetailsDashboardComponent = () => {
  const sessionData = useMemo(
    () => ({
      labels: sessions.map((s) => s.h),
      datasets: [
        {
          label: "Apprentissage",
          data: sessions.map((s) => s.totalLearning),
          backgroundColor: "#AFECA8",
          borderColor: "#AFECA8",
          borderRadius: 10,
          barPercentage: 1,
        },
        {
          label: "Révision",
          data: sessions.map((s) => s.totalReview),
          backgroundColor: "#94b5e9",
          borderColor: "#94b5e9",
          borderRadius: 10,
          barPercentage: 1,
        },
      ],
    }),
    []
  );
  const quizData = useMemo(
    () => ({
      labels: levels.map((l) => l.label),
      datasets: [
        {
          label: "Niveau",
          data: levels.map((l) => l.nbr),
        },
      ],
    }),
    []
  );

  return (
    <div className="details-dashboard-body">
      <div className="up">
        <div
          className="folder"
          data-content="Nombre totale de session par heure"
        >
          <div className="session-chart chart-div">
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
            </div>
          </div>
        </div>
      </div>
      <div className="down">
        <div className="left">
          <div className="linear-stat">
            <h3>Tendance des thèmes</h3>
            <div className="linear-stat-body">
              {themes.map((t) => (
                <div className="theme-item" key={t.idTheme}>
                  <p className="no-margin">{t.label}</p>
                  <div className="progress-div">
                    <LinearProgress
                      value={(t.nbr / totalUsers) * 100}
                      variant="determinate"
                      color="accent"
                      className="progress-bar"
                    />
                    <div className="progress-label">
                      <small>
                        {((t.nbr / totalUsers) * 100).toLocaleString("fr", {
                          maximumFractionDigits: 2,
                        })}
                        %
                      </small>
                    </div>
                  </div>
                </div>
              ))}

              {themes.map((t) => (
                <div className="theme-item" key={t.idTheme}>
                  <p className="no-margin">{t.label}</p>
                  <div className="progress-div">
                    <LinearProgress
                      value={(t.nbr / totalUsers) * 100}
                      variant="determinate"
                      color="accent"
                      className="progress-bar"
                    />
                    <div className="progress-label">
                      <small>
                        {((t.nbr / totalUsers) * 100).toLocaleString("fr", {
                          maximumFractionDigits: 2,
                        })}
                        %
                      </small>
                    </div>
                  </div>
                </div>
              ))}

              {themes.map((t) => (
                <div className="theme-item" key={t.idTheme}>
                  <p className="no-margin">{t.label}</p>
                  <div className="progress-div">
                    <LinearProgress
                      value={(t.nbr / totalUsers) * 100}
                      variant="determinate"
                      color="accent"
                      className="progress-bar"
                    />
                    <div className="progress-label">
                      <small>
                        {((t.nbr / totalUsers) * 100).toLocaleString("fr", {
                          maximumFractionDigits: 2,
                        })}
                        %
                      </small>
                    </div>
                  </div>
                </div>
              ))}

              {themes.map((t) => (
                <div className="theme-item" key={t.idTheme}>
                  <p className="no-margin">{t.label}</p>
                  <div className="progress-div">
                    <LinearProgress
                      value={(t.nbr / totalUsers) * 100}
                      variant="determinate"
                      color="accent"
                      className="progress-bar"
                    />
                    <div className="progress-label">
                      <small>
                        {((t.nbr / totalUsers) * 100).toLocaleString("fr", {
                          maximumFractionDigits: 2,
                        })}
                        %
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="linear-stat">
            <h3>Tendance des quiz</h3>
            <div className="linear-stat-body">
              {themes.map((t) => (
                <div className="theme-item" key={t.idTheme}>
                  <p className="no-margin">{t.label}</p>
                  <div className="progress-div">
                    <LinearProgress
                      value={(t.nbr / totalUsers) * 100}
                      variant="determinate"
                      color="accent"
                      className="progress-bar"
                    />
                    <div className="progress-label">
                      <small>
                        {((t.nbr / totalUsers) * 100).toLocaleString("fr", {
                          maximumFractionDigits: 2,
                        })}
                        %
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right">
          {quizData.datasets.length == 0 ? (
            <p>
              <small>Pas de donnée.</small>
            </p>
          ) : (
            <div className="levels-stat">
              <h3>Répartition par niveau</h3>

              <Pie
                data={quizData}
                options={{
                  plugins: {
                    autocolors: {
                      mode: "data",
                    },
                  },
                }}
                style={{ marginTop: "2rem" }}
              />
              <div className="levels-legends">
                {levels.map((l) => (
                  <div className="inline-flex" key={`lvl_${l.id}`}>
                    <Star color="primary" />
                    {l.label}: {l.nbr}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsDashboardComponent;
