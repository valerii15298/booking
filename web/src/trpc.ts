import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCQueryUtils,
  createTRPCReact,
  httpBatchLink,
  loggerLink,
} from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "../../api/src/trpc";

export const trpc = createTRPCReact<AppRouter>();

export type { AppRouter };

export const queryClient = new QueryClient();
export const trpcClient = trpc.createClient({
  links: [
    loggerLink(),
    httpBatchLink({ url: "/trpc", transformer: superjson }),
  ],
});
export const trpcUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient,
});
