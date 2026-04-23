import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import { getAuthToken } from "./apolloClient";

const rootRoute = createRootRoute({
  component: Outlet,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => {
    if (!getAuthToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
