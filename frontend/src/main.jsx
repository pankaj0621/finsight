import React from "react";
import ReactDOM from "react-dom/client";
import FinSight from "./FinSight.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <FinSight />
    </ErrorBoundary>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FinSight />
  </React.StrictMode>
);
