import { TanStackRouterVite as tanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import type { ProxyOptions } from "vite";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, "..") };
  const proxyOptions = {
    changeOrigin: false,
    ws: true,
    target: `http://localhost:${env["VITE_API_PORT"]}`,
  } satisfies ProxyOptions;
  process.env["VITE_BUILD_DATE"] = new Date().toISOString();
  return {
    envDir: "..",
    plugins: [tanStackRouterVite(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: Number(env["VITE_PORT"]),
      proxy: {
        "/trpc": proxyOptions,
      },
    },
    preview: {
      port: Number(env["VITE_PORT"]),
    },
  };
});
