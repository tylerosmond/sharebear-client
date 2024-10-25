import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ApplicationViews } from "./components/ApplicationViews.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApplicationViews />
  </StrictMode>
);
