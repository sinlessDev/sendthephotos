import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./main.css";
import { UploadsRoute } from "./routes/uploads.tsx";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<h1 className="text-3xl font-serif">Hello World</h1>}
        />
        <Route path="/:eventID" element={<UploadsRoute />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
