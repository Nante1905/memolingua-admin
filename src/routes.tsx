import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomeRoot from "./components/home/home.root";
import LangCreateRoot from "./components/langs/container/lang-create-root/lang-create.root";
import LangListRoot from "./components/langs/container/lang-list-root/lang-list.root";
import LangUpdateRoot from "./components/langs/container/lang-update-root/lang-update.root";
import LevelFormComponent from "./components/level/components/level-form/level-form.component";
import LevelListRoot from "./components/level/container/list-root/list.root";
import LevelUpdateFormRoot from "./components/level/container/update-form/update-form.root";
import LoginRoot from "./components/login/container/login.root";
import AddCardRoot from "./components/packages/containers/add-card/add-card.root";
import CreatePackageRoot from "./components/packages/containers/create-package/create-package.root";
import PackageListRoot from "./components/packages/containers/package-list/package-list.root";
import AnswerListRoot from "./components/quiz/containers/answer-list-root/answer-list.root";
import QuestionListRoot from "./components/quiz/containers/question-list-root/question-list.root";
import QuizAddQuestionRoot from "./components/quiz/containers/quiz-add-question-root/quiz-add-question.root";
import QuizCreationRoot from "./components/quiz/containers/quiz-creation-root/quiz-creation.root";
import QuizListRoot from "./components/quiz/containers/quiz-list-root/quiz-list.root";

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
        path: "/create-package",
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
        path: "/quizs/questions",
        element: <QuestionListRoot />,
      },
      {
        path: "/quizs/answers",
        element: <AnswerListRoot />,
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
    ],
  },
]);
