import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomeRoot from "./components/home/home.root";
import LangCreateRoot from "./components/langs/container/lang-create-root/lang-create.root";
import LangImportRoot from "./components/langs/container/lang-import-root/lang-import.root";
import LangListRoot from "./components/langs/container/lang-list-root/lang-list.root";
import LangUpdateRoot from "./components/langs/container/lang-update-root/lang-update.root";
import LevelFormComponent from "./components/level/components/level-form/level-form.component";
import LevelListRoot from "./components/level/container/list-root/list.root";
import LevelUpdateFormRoot from "./components/level/container/update-form/update-form.root";
import LoginRoot from "./components/login/container/login.root";
import AddCardRoot from "./components/packages/containers/add-card/add-card.root";
import CreatePackageRoot from "./components/packages/containers/create-package/create-package.root";
import PackageDetailsRoot from "./components/packages/containers/package-details/package-details.root";
import PackageListRoot from "./components/packages/containers/package-list/package-list.root";
import UpdatePackageRoot from "./components/packages/containers/update-package/update-package.root";
import AnswerListRoot from "./components/quiz/containers/answer-list-root/answer-list.root";
import AnswerUpdateRoot from "./components/quiz/containers/answer-update-root/answer-update.root";
import ImportQuizRoot from "./components/quiz/containers/import-quiz-root/import-quiz.root";
import QuestionImportRoot from "./components/quiz/containers/question-import-root/question-import.root";
import QuestionListRoot from "./components/quiz/containers/question-list-root/question-list.root";
import QuestionUpdateRoot from "./components/quiz/containers/question-update-root/question-update.root";
import QuizAddQuestionRoot from "./components/quiz/containers/quiz-add-question-root/quiz-add-question.root";
import QuizCreationRoot from "./components/quiz/containers/quiz-creation-root/quiz-creation.root";
import QuizListRoot from "./components/quiz/containers/quiz-list-root/quiz-list.root";
import QuizUpdateRoot from "./components/quiz/containers/quiz-update-root/quiz-update.root";
import ThemeCreateRoot from "./components/themes/containers/theme-create/theme-create.root";
import ThemeImportRoot from "./components/themes/containers/theme-import-root/theme-import.root";
import ThemeListRoot from "./components/themes/containers/theme-list/theme-list.root";
import ThemeUpdateRoot from "./components/themes/containers/theme-update/theme-update.root";
import UserListRoot from "./components/users/container/user-list-root/user-list.root";

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
    ],
  },
]);
