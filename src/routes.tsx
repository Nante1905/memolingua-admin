/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "./App";

const DetailsDashboardRoot = lazy(
  () =>
    import(
      "./components/dashboard/containers/details-dashboard/details-dashboard.root"
    )
);
const GeneralStatsRoot = lazy(
  () =>
    import(
      "./components/dashboard/containers/general-stats-root/general-stats.root"
    )
);
const HomeRoot = lazy(() => import("./components/home/home.root"));
const LangCreateRoot = lazy(
  () => import("./components/langs/container/lang-create-root/lang-create.root")
);
const LangImportRoot = lazy(
  () => import("./components/langs/container/lang-import-root/lang-import.root")
);
const LangListRoot = lazy(
  () => import("./components/langs/container/lang-list-root/lang-list.root")
);
const LangUpdateRoot = lazy(
  () => import("./components/langs/container/lang-update-root/lang-update.root")
);
const LevelFormComponent = lazy(
  () => import("./components/level/components/level-form/level-form.component")
);
const LevelListRoot = lazy(
  () => import("./components/level/container/list-root/list.root")
);
const LevelUpdateFormRoot = lazy(
  () => import("./components/level/container/update-form/update-form.root")
);
const LoginRoot = lazy(() => import("./components/login/container/login.root"));
const AddCardRoot = lazy(
  () => import("./components/packages/containers/add-card/add-card.root")
);
const CardImportRoot = lazy(
  () =>
    import("./components/packages/containers/card-import-root/card-import.root")
);
const CreatePackageRoot = lazy(
  () =>
    import(
      "./components/packages/containers/create-package/create-package.root"
    )
);
const PackageDetailsRoot = lazy(
  () =>
    import(
      "./components/packages/containers/package-details/package-details.root"
    )
);
const PackageImportRoot = lazy(
  () =>
    import(
      "./components/packages/containers/package-import-root/package-import.root"
    )
);
const PackageListRoot = lazy(
  () =>
    import("./components/packages/containers/package-list/package-list.root")
);
const UpdatePackageRoot = lazy(
  () =>
    import(
      "./components/packages/containers/update-package/update-package.root"
    )
);
const AnswerListRoot = lazy(
  () => import("./components/quiz/containers/answer-list-root/answer-list.root")
);
const AnswerUpdateRoot = lazy(
  () =>
    import("./components/quiz/containers/answer-update-root/answer-update.root")
);
const ImportQuizRoot = lazy(
  () => import("./components/quiz/containers/import-quiz-root/import-quiz.root")
);
const QuestionImportRoot = lazy(
  () =>
    import(
      "./components/quiz/containers/question-import-root/question-import.root"
    )
);
const QuestionListRoot = lazy(
  () =>
    import("./components/quiz/containers/question-list-root/question-list.root")
);
const QuestionUpdateRoot = lazy(
  () =>
    import(
      "./components/quiz/containers/question-update-root/question-update.root"
    )
);
const QuizAddQuestionRoot = lazy(
  () =>
    import(
      "./components/quiz/containers/quiz-add-question-root/quiz-add-question.root"
    )
);
const QuizCreationRoot = lazy(
  () =>
    import("./components/quiz/containers/quiz-creation-root/quiz-creation.root")
);
const QuizListRoot = lazy(
  () => import("./components/quiz/containers/quiz-list-root/quiz-list.root")
);
const QuizUpdateRoot = lazy(
  () => import("./components/quiz/containers/quiz-update-root/quiz-update.root")
);
const ThemeCreateRoot = lazy(
  () => import("./components/themes/containers/theme-create/theme-create.root")
);
const ThemeImportRoot = lazy(
  () =>
    import("./components/themes/containers/theme-import-root/theme-import.root")
);
const ThemeListRoot = lazy(
  () => import("./components/themes/containers/theme-list/theme-list.root")
);
const ThemeUpdateRoot = lazy(
  () => import("./components/themes/containers/theme-update/theme-update.root")
);
const UserListRoot = lazy(
  () => import("./components/users/container/user-list-root/user-list.root")
);
const NotFoundPage = lazy(
  () => import("./shared/components/error/404/not-found-page.root")
);

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoot />,
  },
  {
    path: "",
    element: (
      <App>
        <Outlet />
      </App>
    ),
    children: [
      {
        path: "/home",
        element: <HomeRoot />,
      },
      {
        path: "/packages/create",
        element: <CreatePackageRoot />,
      },
      {
        path: "/packages/:id/add-cards",
        element: <AddCardRoot />,
      },
      {
        path: "/quizs/create",
        element: <QuizCreationRoot />,
      },
      {
        path: "/quizs/add-question",
        element: <QuizAddQuestionRoot />,
      },
      {
        path: "/quizs",
        element: <QuizListRoot />,
      },
      {
        path: "/quizs/import",
        element: <ImportQuizRoot />,
      },
      {
        path: "/quizs/:id/update",
        element: <QuizUpdateRoot />,
      },
      {
        path: "/questions",
        element: <QuestionListRoot />,
      },
      {
        path: "/questions/import",
        element: <QuestionImportRoot />,
      },
      {
        path: "/answers",
        element: <AnswerListRoot />,
      },
      {
        path: "/answers/:id/update",
        element: <AnswerUpdateRoot />,
      },
      {
        path: "/packages",
        element: <PackageListRoot />,
      },
      {
        path: "/levels",
        element: <LevelListRoot />,
      },
      {
        path: "/levels/create",
        element: <LevelFormComponent />,
      },
      {
        path: "/levels/:id/update",
        element: <LevelUpdateFormRoot />,
      },
      {
        path: "/questions/:id/update",
        element: <QuestionUpdateRoot />,
      },
      {
        path: "/langs",
        element: <LangListRoot />,
      },
      {
        path: "/langs/create",
        element: <LangCreateRoot />,
      },
      {
        path: "/langs/:id/update",
        element: <LangUpdateRoot />,
      },
      {
        path: "/packages/:id/content",
        element: <PackageDetailsRoot />,
      },
      {
        path: "/packages/:id/update",
        element: <UpdatePackageRoot />,
      },
      {
        path: "/themes",
        element: <ThemeListRoot />,
      },
      {
        path: "/themes/create",
        element: <ThemeCreateRoot />,
      },
      {
        path: "/themes/:id/update",
        element: <ThemeUpdateRoot />,
      },
      {
        path: "/langs/import",
        element: <LangImportRoot />,
      },
      {
        path: "/themes/import",
        element: <ThemeImportRoot />,
      },
      {
        path: "/users",
        element: <UserListRoot />,
      },
      {
        path: "/packages/import",
        element: <PackageImportRoot />,
      },
      {
        path: "/cards/import",
        element: <CardImportRoot />,
      },
      {
        path: "/stats/details",
        element: <DetailsDashboardRoot />,
      },
      {
        path: "/stats",
        element: <GeneralStatsRoot />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
