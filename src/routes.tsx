import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomeRoot from "./components/home/home.root";
import LoginRoot from "./components/login/container/login.root";
import CreatePackageRoot from "./components/packages/containers/create-package/create-package.root";

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
    ],
  },
]);
