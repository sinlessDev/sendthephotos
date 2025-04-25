import { Link, Route, Switch } from "wouter";

export function EventsRoute() {
  return (
    <Switch>
      <Route path="/new">
        <NewEventForm />
      </Route>
      <Route path="/">
        <EventsList />
      </Route>
    </Switch>
  );
}
function NewEventForm() {
  return (
    <div className="p-7">
      <h1 className="text-3xl font-bold">New Event</h1>
      <form className="mt-7">
        <input
          type="text"
          placeholder="Name"
          className="text-xl font-semibold px-2.5 h-12 border-2 rounded-md focus:outline-[3px] focus:-outline-offset-[3px] focus:outline-blue-600 placeholder:text-black"
        />
        <button
          type="submit"
          className="text-xl font-semibold px-2.5 h-12 bg-blue-600 text-white rounded-md ml-2"
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
          className="material-symbols-sharp text-green-700 active:text-green-800"
          style={{
            fontSize: "48px",
            fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48",
          }}
        >
          add_circle
        </Link>
      </div>
      <div className="mt-10 outline-[3px] outline-dashed outline-black/15 rounded-xl flex flex-col items-center justify-center p-9 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold">No events yet</h2>
        <p className="text-lg font-bold">
          <Link
            href="/new"
            className="text-blue-600 underline decoration-[3px]"
          >
            Create an event
          </Link>{" "}
          to get started.
        </p>
      </div>
    </div>
  );
}
