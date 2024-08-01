import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(async () =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // Default: res.TanStackRouterDevtoolsPanel
        })),
      );
export const Route = createRootRoute({
  component: () => (
    <>
      <header>Hello</header>
      <main>
        <Outlet />
      </main>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
