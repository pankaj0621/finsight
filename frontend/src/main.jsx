import { StrictMode } from "react";
import { createRoot }  from "react-dom/client";
import "./styles/globals.css";
import FinSight from "./FinSight.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FinSight />
  </StrictMode>
);
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <FinSight />
    </ErrorBoundary>
  </StrictMode>
);