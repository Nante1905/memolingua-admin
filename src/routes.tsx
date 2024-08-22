import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomeRoot from "./components/home/home.root";
import LoginRoot from "./components/login/container/login.root";
import AddCardRoot from "./components/packages/containers/add-card/add-card.root";
import CreatePackageRoot from "./components/packages/containers/create-package/create-package.root";
import QuizAddQuestionRoot from "./components/quiz/containers/quiz-add-question-root/quiz-add-question.root";
import QuizCreationRoot from "./components/quiz/containers/quiz-creation-root/quiz-creation.root";

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
        path: "/quiz/create",
        element: <QuizCreationRoot />,
      },
      {
        path: "/quiz/add-question",
        element: <QuizAddQuestionRoot />,
      },
    ],
  },
]);
