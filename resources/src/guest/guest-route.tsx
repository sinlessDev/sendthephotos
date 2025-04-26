import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { getEvent } from "../events/api.ts";
import * as tus from "tus-js-client";

export function GuestRoute() {
  const { eventID } = useParams<{ eventID: string }>();

  const queryClient = useQueryClient();

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
      throw new Error("No files coming from input");
    }

    for (const file of e.target.files) {
      const upload = new tus.Upload(file, {
        endpoint: "/files",
        metadata: {
          filename: file.name,
          mimeType: file.type,
          eventID,
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["event", eventID] });
        },
      });

      upload.findPreviousUploads().then((previousUploads) => {
        const lastUpload = previousUploads
          .sort(
            (a, b) =>
              new Date(b.creationTime).getTime() -
              new Date(a.creationTime).getTime()
          )
          .at(0);

        if (lastUpload) {
          upload.resumeFromPreviousUpload(lastUpload);
        }

        upload.start();
      });
    }
  };

  const noUploads = eventQuery.data.event.uploads.length === 0;

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-3xl font-bold">{eventQuery.data.event.name}</h1>
        <input
          type="file"
          name="uploads"
          id="uploads"
          accept="image/*"
          hidden
          onChange={onFilesChange}
          multiple
        />
        <label
          htmlFor="uploads"
          className="bg-green-700 text-white active:bg-green-800 px-2.5 h-12 flex items-center justify-center max-w-fit rounded-md font-semibold"
        >
          Upload files
        </label>
      </div>
      {noUploads ? (
        <div className="mt-10 outline-2 outline-dashed outline-black/20 rounded-xl flex flex-col items-center justify-center p-9 max-w-lg mx-auto bg-white">
          <h2 className="text-2xl font-bold">No uploads yet</h2>
          <p className="text-lg font-medium">
            Don't be shy, upload some photos!
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-4 gap-4">
          {eventQuery.data.event.uploads.map((upload) => (
            <img
              key={upload.id}
              src={`/files/${upload.id}`}
              alt={upload.metadata.filename}
            />
          ))}
        </div>
      )}
    </div>
  );
}
