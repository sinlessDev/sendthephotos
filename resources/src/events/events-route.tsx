import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { Link, Route, Switch, useLocation } from "wouter";
import { createEvent } from "./api.ts";
import * as v from "valibot";

export function EventsRoute() {
  return (
    <div className="max-w-5xl mx-auto">
      <Switch>
        <Route path="/new">
          <NewEventForm />
        </Route>
        <Route path="/">
          <EventsList />
        </Route>
      </Switch>
    </div>
  );
}

const createEventSchema = v.object({
  name: v.string(),
});

function NewEventForm() {
  const createEventForm = useForm<v.InferInput<typeof createEventSchema>>({
    resolver: valibotResolver(createEventSchema),
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
  });

  const [location, navigate] = useLocation();

  const onSubmit = (data: v.InferInput<typeof createEventSchema>) => {
    createEventMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="p-7">
      <h1 className="text-3xl font-bold">New Event</h1>
      <form
        className="mt-10 max-w-2xl sm:max-w-sm"
        onSubmit={createEventForm.handleSubmit(onSubmit)}
      >
        <label htmlFor="name" className="font-semibold text-lg">
          Name
        </label>
        <input
          id="name"
          className="text-lg w-full mt-2 block font-semibold px-2.5 h-12 border-2 rounded-md bg-white border-black/30"
          {...createEventForm.register("name")}
        />
        <button
          type="submit"
          className="text-lg mt-5 w-full font-semibold px-2.5 h-12 bg-green-700 active:bg-green-800 text-white rounded-md"
        >
          Create
        </button>
      </form>
    </div>
  );
}

function EventsList() {
  return (
    <div className="p-7">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Link
          href="/new"
          className="material-symbols-sharp text-green-700 hover:text-green-800"
          style={{
            fontSize: "48px",
            fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48",
          }}
        >
          add_circle
        </Link>
      </div>
      <div className="mt-10 outline-2 outline-dashed outline-black/20 rounded-xl flex flex-col items-center justify-center p-9 max-w-lg mx-auto bg-white">
        <h2 className="text-2xl font-bold">No events yet</h2>
        <p className="text-lg font-medium">
          <Link
            href="/new"
            className="text-blue-600 underline decoration-2 hover:text-blue-800"
          >
            Create an event
          </Link>{" "}
          to get started.
        </p>
      </div>
    </div>
  );
}
