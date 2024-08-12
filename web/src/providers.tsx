import { QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "./components/ui/tooltip";
import { queryClient, trpc, trpcClient } from "./trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
