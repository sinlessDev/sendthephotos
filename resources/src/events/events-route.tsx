import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, Route, Switch, useLocation, useParams } from "wouter";
import { createEvent, getAllEvents, getEvent } from "./api.ts";
import * as v from "valibot";
import {
  QrCodeDialog,
  QrCodeDialogTrigger,
  QrCodeDialogContent,
} from "./qr-code-dialog.tsx";

export function EventsRoute() {
  return (
    <div>
      <Switch>
        <Route path="/new">
          <NewEventForm />
        </Route>
        <Route path="/">
          <EventsList />
        </Route>
        <Route path="/:eventID">
          <EventDetails />
        </Route>
      </Switch>
    </div>
  );
}

const createEventSchema = v.object({
  name: v.string(),
});

function NewEventForm() {
  const createEventForm = useForm({
    resolver: valibotResolver(createEventSchema),
    defaultValues: {
      name: "",
    },
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
  });

  const [, navigate] = useLocation();

  const onSubmit = (data: any) => {
    createEventMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="p-7 max-w-5xl mx-auto">
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
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents,
  });

  const noEvents = !eventsQuery.data || eventsQuery.data.events.length === 0;

  return (
    <div className="p-7 max-w-5xl mx-auto">
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
      {noEvents ? (
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
      ) : (
        <div className="mt-10">
          <ul className="grid grid-cols-4 gap-4">
            {eventsQuery.data.events.map((event) => (
              <li
                key={event.id}
                className="bg-white p-4 rounded-lg border-2 border-black/15"
              >
                <Link
                  href={`/${event.id}`}
                  className="text-blue-600 underline decoration-2 hover:text-blue-800 text-lg font-medium leading-none"
                >
                  {event.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EventDetails() {
  const { eventID } = useParams<{ eventID: string }>();

  const eventQuery = useQuery({
    queryKey: ["event", eventID],
    queryFn: () => getEvent(eventID),
  });

  const noEvent = !eventQuery.data;

  if (noEvent) {
    return (
      <div className="p-7">
        <h1 className="text-3xl font-bold">No event found</h1>
      </div>
    );
  }

  const noUploads = eventQuery.data.event.uploads.length === 0;

  return (
    <div>
      {!eventQuery.data.event.paid && (
        <div className="bg-striped bg-striped-from-amber-200 bg-striped-to-amber-100 border-b border-b-black/10 shadow-xs">
          <p className="max-w-5xl mx-auto px-7 py-4 text-base font-semibold text-amber-700 text-center">
            Event is in trial mode.{" "}
            <Link
              href={`/events/${eventID}/payment`}
              className="text-amber-950 underline font-bold decoration-2"
            >
              Proceed with payment
            </Link>{" "}
            to enable more than 1 upload.
          </p>
        </div>
      )}
      <div className="p-7 max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 underline decoration-2 hover:text-blue-800 text-lg font-medium"
        >
          Back
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{eventQuery.data.event.name}</h1>
          <div className="flex items-center gap-2">
            <QrCodeDialog>
              <QrCodeDialogTrigger asChild>
                <button className="bg-white hover:bg-stone-200 border border-black/25 p-2 flex items-center justify-center rounded-full">
                  <span
                    className="material-symbols-sharp"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    qr_code
                  </span>
                </button>
              </QrCodeDialogTrigger>
              <QrCodeDialogContent url={`/api/events/${eventID}/qr`} />
            </QrCodeDialog>
            <a
              href={`/${eventID}`}
              className="bg-green-700 size-10 hover:bg-green-800 rounded-full flex items-center justify-center"
              target="_blank"
            >
              <span
                className="material-symbols-sharp text-white"
                style={{
                  fontSize: "24px",
                  fontVariationSettings:
                    "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
                }}
              >
                open_in_new
              </span>
            </a>
          </div>
        </div>
        {noUploads ? (
          <div className="mt-10 outline-2 outline-dashed outline-black/20 rounded-xl flex flex-col items-center justify-center p-9 max-w-lg mx-auto bg-white">
            <h2 className="text-2xl font-bold">No uploads yet</h2>
            <p className="text-lg font-medium">
              <Link
                href={`~/${eventID}`}
                className="text-blue-600 underline decoration-2 hover:text-blue-800"
              >
                Check out guest page
              </Link>{" "}
              to upload photos.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-4 gap-4">
              {eventQuery.data.event.uploads.map((upload) => (
                <img
                  key={upload.id}
                  src={`/files/${upload.id}`}
                  alt={upload.metadata.filename}
                />
              ))}
            </div>
            <div className="flex justify-center mt-7">
              <a
                download
                href={`/api/events/${eventID}/zip`}
                className="bg-green-700 text-white active:bg-green-800 px-2.5 h-12 flex items-center justify-center max-w-fit rounded-md font-semibold"
              >
                Download all photos
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
