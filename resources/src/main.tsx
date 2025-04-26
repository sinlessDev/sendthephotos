import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Switch } from "wouter";
import { EventsRoute } from "./events/events-route.tsx";
import { GalleryRoute, GuestRoute } from "./guest/guest-route.tsx";
import "./main.css";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element not found");
}
const queryClient = new QueryClient();

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/events/:eventID/gallery/:uploadID">
          <GalleryRoute />
        </Route>
        <Route path="/events" nest>
          <EventsRoute />
        </Route>
        <Route path="/:eventID/gallery/:uploadID">
          <GalleryRoute />
        </Route>
        <Route path="/:eventID" nest>
          <GuestRoute />
        </Route>
      </Switch>
    </QueryClientProvider>
  </StrictMode>,
);
