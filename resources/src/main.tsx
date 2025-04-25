import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { Route } from "wouter";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <Route path="/hello-world">
      <h1 className="font-serif text-3xl font-bold">Hello World</h1>
    </Route>
  </StrictMode>
);
