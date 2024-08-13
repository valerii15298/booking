import "./globals.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<StrictMode children={<App />} />);
