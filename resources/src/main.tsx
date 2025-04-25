import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Switch } from "wouter";
import { EventsRoute } from "./events/events-route.tsx";
import "./main.css";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <Switch>
      <Route path="/events" nest>
        <EventsRoute />
      </Route>
    </Switch>
  </StrictMode>
);
