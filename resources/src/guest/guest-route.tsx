import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { getEvent } from "../events/api.ts";
import * as tus from "tus-js-client";
export function GuestRoute() {
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

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];

    const upload = new tus.Upload(file, {
      endpoint: "/api/uploads",
      metadata: {
        filename: file.name,
      },
      headers: {
        "X-Event-ID": eventID,
      },
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      upload.start();
    });
  };

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">{eventQuery.data.event.name}</h1>
      <input
        type="file"
        name="uploads"
        id="uploads"
        accept="image/*"
        hidden
        onChange={onFilesChange}
      />
      <label
        htmlFor="uploads"
        className="bg-green-700 text-white active:bg-green-800 px-2.5 h-12 flex items-center justify-center max-w-fit rounded-md font-semibold mt-10"
      >
        Upload files
      </label>
    </div>
  );
}
