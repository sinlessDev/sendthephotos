import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Switch } from "wouter";
import { EventsRoute } from "./routes/events/events-route.tsx";
import { GalleryRoute, GuestRoute } from "./routes/guest/guest-route.tsx";
import { LandingRoute } from "./routes/landing/landing-route.tsx";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element not found");
}

createRoot(rootEl).render(
  <StrictMode>
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
      <Route path="/">
        <LandingRoute />
      </Route>
    </Switch>
  </StrictMode>
);
