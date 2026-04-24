import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { lazy } from "react";
import {
  RootPending,
  RootError,
  PagePending,
  PageError,
} from "./components/RootFallbacks";

import { getAuthToken } from "./apolloClient";

const rootRoute = createRootRoute({
  component: Outlet,
  pendingComponent: RootPending,
  errorComponent: RootError,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazy(() => import("./pages/LoginPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => {
    if (!getAuthToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: lazy(() => import("./pages/DashboardPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => {
    if (!getAuthToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: lazy(() => import("./pages/AdminPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  adminRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
