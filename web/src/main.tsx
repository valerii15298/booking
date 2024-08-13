import "./globals.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { loading } from "./loading";
import { Providers } from "./providers";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider defaultPendingComponent={() => loading} router={router} />
    </Providers>
  </StrictMode>,
);
