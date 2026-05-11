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

import {
  getAuthToken,
  verifySession,
  verifySuperAdminSession,
} from "./apolloClient";

async function requireAuth() {
  if (getAuthToken()) return;
  const user = await verifySession();
  if (!user) throw redirect({ to: "/" });
}

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
  beforeLoad: requireAuth,
  component: lazy(() => import("./pages/DashboardPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: requireAuth,
  component: lazy(() => import("./pages/AdminPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const superAdminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/superadmin",
  component: lazy(() => import("./pages/SuperAdminLoginPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const superAdminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/superadmin/dashboard",
  beforeLoad: async () => {
    const ok = await verifySuperAdminSession();
    if (!ok) throw redirect({ to: "/superadmin" });
  },
  component: lazy(() => import("./pages/SuperAdminDashboardPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup",
  beforeLoad: requireAuth,
  component: lazy(() => import("./pages/setupPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const bookkeepingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bookkeeping",
  beforeLoad: requireAuth,
  component: lazy(() => import("./pages/BookkeepingPage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invoices",
  beforeLoad: requireAuth,
  component: lazy(() => import("./pages/InvoicePage")),
  pendingComponent: PagePending,
  errorComponent: PageError,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  adminRoute,
  superAdminLoginRoute,
  superAdminDashboardRoute,
  setupRoute,
  bookkeepingRoute,
  invoicesRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
