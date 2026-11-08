import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth";
import "./styles.css";

// #region agent log
fetch("http://127.0.0.1:7873/ingest/f2d26f48-fe57-4cf7-80e9-c9b218690d22", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "7a4984",
  },
  body: JSON.stringify({
    sessionId: "7a4984",
    runId: "post-fix",
    hypothesisId: "B",
    location: "main.jsx:boot",
    message: "SPA boot",
    data: {
      pathname: window.location.pathname,
      href: window.location.href,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
