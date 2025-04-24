import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./main.css";

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
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
