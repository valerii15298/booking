import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCQueryUtils } from "@trpc/react-query";
import { useState } from "react";
import transformer from "superjson";

import { TooltipProvider } from "./components/ui/tooltip";
import { loading } from "./loading";
import { routeTree } from "./routeTree.gen";
import { trpc } from "./trpc";

const router = createRouter({ routeTree, context: { utils: undefined! } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [loggerLink(), httpBatchLink({ url: "/trpc", transformer })],
    }),
  );
  const [utils] = useState(() =>
    createTRPCQueryUtils({
      client: trpcClient,
      queryClient,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider
            defaultPendingComponent={() => loading}
            router={router}
            context={{ utils }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
