import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { createTRPCQueryUtils } from "@trpc/react-query";
import React, { Suspense } from "react";

import type { AppRouter } from "@/trpc";

const TanStackRouterDevtools = import.meta.env.VITE_TAN_STACK_DEV_TOOLS
  ? React.lazy(async () =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel,
      })),
    )
  : () => null;

export const Route = createRootRouteWithContext<{
  utils: ReturnType<typeof createTRPCQueryUtils<AppRouter>>;
}>()({
  component: () => (
    <Suspense>
      <Outlet />
      <TanStackRouterDevtools position="top-right" />
    </Suspense>
  ),
});
