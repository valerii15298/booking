import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { createTRPCQueryUtils } from "@trpc/react-query";
import { useState } from "react";
import transformer from "superjson";

import { loading } from "./atoms/loading";
import { ThemeProvider } from "./components/theme/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { routeTree } from "./routeTree.gen";
import { trpc } from "./trpc";

const router = createRouter({ routeTree, context: { utils: undefined! } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const url = "/trpc";

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({ client: createWSClient({ url }), transformer }),
          false: httpBatchLink({ url, transformer }),
        }),
      ],
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
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <RouterProvider
              defaultPendingComponent={() => loading}
              router={router}
              context={{ utils }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
