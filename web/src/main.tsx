// eslint-disable-next-line no-console
console.log("Build date:", import.meta.env.VITE_BUILD_DATE);

import "./globals.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";

const root = ReactDOM.createRoot(document.getElementById("app")!);
const disableReactStrictMode = ["false", "0", ""].includes(
  import.meta.env.VITE_REACT_STRICT_MODE!,
);
root.render(
  disableReactStrictMode ? <App /> : <StrictMode children={<App />} />,
);
