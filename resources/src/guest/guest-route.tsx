import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
import * as tus from "tus-js-client";
import { Link, useParams, useRoute } from "wouter";
import { deleteUpload, getEventForGuest, getUpload } from "./api.ts";

const fingerprint = await FingerprintJS.load()
  .then((fp) => fp.get())
  .then((result) => result.visitorId);

export function GuestRoute() {
  const { eventID } = useParams<{ eventID: string }>();

  const queryClient = useQueryClient();

  const eventQuery = useQuery({
    queryKey: ["event", eventID],
    queryFn: () => getEventForGuest(eventID, fingerprint),
  });

  const deleteUploadMutation = useMutation({
    mutationFn: (uploadID: string) => deleteUpload(uploadID),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event", eventID] });
    },
  });

  const noEvent = !eventQuery.data;

  if (noEvent) {
    return (
      <div className="p-7">
        <h1 className="text-3xl font-bold">No event found</h1>
      </div>
    );
  }

  const onFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const batchID = crypto.randomUUID();

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
          fingerprint,
          batchID,
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
    <div>
      {!eventQuery.data.event.paid && (
        <div className="bg-striped bg-striped-from-amber-200 bg-striped-to-amber-100 border-b border-b-black/10 shadow-xs">
          <p className="max-w-5xl mx-auto px-7 py-4 text-base font-semibold text-amber-700 text-center">
            Event is in trial mode. If you're the host,{" "}
            <Link
              href={`~/events/${eventID}`}
              className="text-amber-950 underline font-bold decoration-2"
            >
              activate
            </Link>{" "}
            your event to enable more than 1 upload.
          </p>
        </div>
      )}
      <div className="p-7 max-w-5xl mx-auto">
        <title>{`${eventQuery.data.event.name} - SendThePhotos`}</title>
        <div className="flex items-center gap-2 justify-between">
          <h1 className="text-3xl font-bold">{eventQuery.data.event.name}</h1>
          <input
            type="file"
            name="uploads"
            id="uploads"
            accept="image/*,video/*"
            hidden
            onChange={onFilesChange}
            multiple
          />
          <label
            htmlFor="uploads"
            aria-disabled={!eventQuery.data.event.uploadAvailable}
            className="bg-green-700 text-white active:bg-green-800 px-2.5 h-12 flex items-center justify-center max-w-fit rounded-md font-semibold aria-disabled:bg-stone-200 aria-disabled:text-stone-400"
          >
            Upload files
          </label>
        </div>
        {noUploads ? (
          <div className="mt-10 outline-2 outline-dashed outline-black/20 rounded-xl flex flex-col items-center justify-center p-9 max-w-lg mx-auto bg-white">
            <h2 className="text-2xl font-bold">No uploads yet</h2>
            <p className="text-lg font-medium">
              Don't be shy, share some memories!
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-3 gap-x-7 gap-y-10">
            {eventQuery.data.event.uploads.map((upload) => (
              <div key={upload.id} className="flex items-center">
                <div className="relative">
                  <Link href={`~/${eventID}/gallery/${upload.id}`}>
                    {upload.metadata.mimeType.startsWith("image/") ? (
                      <img
                        src={`/files/${upload.id}`}
                        alt={upload.metadata.filename}
                        className="rounded-lg"
                      />
                    ) : (
                      <video
                        src={`/files/${upload.id}`}
                        className="rounded-lg"
                        autoPlay
                        muted
                        loop
                      />
                    )}
                  </Link>
                  {upload.deletable && (
                    <button
                      onClick={() => deleteUploadMutation.mutate(upload.id)}
                      className="absolute -top-3 -right-3 bg-red-600 rounded-full text-white size-11 flex items-center justify-center active:bg-red-700"
                    >
                      <span
                        className="material-symbols-sharp"
                        style={{
                          fontSize: "24px",
                          fontVariationSettings:
                            "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
                        }}
                      >
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <footer className="p-5 w-full flex items-center justify-center mt-10">
          <p className="text-lg font-semibold">
            Made with{" "}
            <a href="/" className="text-blue-600 underline decoration-2">
              SendThePhotos
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export function GalleryRoute() {
  const { eventID, uploadID } = useParams<{
    eventID: string;
    uploadID: string;
  }>();

  const [match] = useRoute("/events/*");

  useLayoutEffect(() => {
    document.body.classList.add("overscroll-none", "bg-black");

    return () => {
      document.body.classList.remove("overscroll-none", "bg-black");
    };
  }, []);

  const eventQuery = useQuery({
    queryKey: ["event", eventID],
    queryFn: () => getEventForGuest(eventID, fingerprint),
  });

  const uploadQuery = useQuery({
    queryKey: ["upload", uploadID],
    queryFn: () => getUpload(uploadID),
  });

  const noEvent = !eventQuery.data;

  if (noEvent) {
    return <div>No event found</div>;
  }

  const uploadIDIndex = eventQuery.data.event.uploads.findIndex(
    (upload) => upload.id === uploadID
  );

  const nextUpload = eventQuery.data.event.uploads.at(
    uploadIDIndex + 1 > eventQuery.data.event.uploads.length - 1
      ? 0
      : uploadIDIndex + 1
  )?.id;
  const previousUpload = eventQuery.data.event.uploads.at(
    uploadIDIndex - 1 < 0
      ? eventQuery.data.event.uploads.length - 1
      : uploadIDIndex - 1
  )?.id;

  const noUpload = !uploadQuery.data;

  if (noUpload) {
    return <div>Upload not found</div>;
  }

  return (
    <div className="h-screen p-8 relative">
      <Link
        href={match ? `~/events/${eventID}` : `~/${eventID}`}
        className="absolute top-8 right-8 text-white size-12 flex items-center justify-center hover:bg-white/15 rounded-full"
      >
        <span
          className="material-symbols-sharp"
          style={{
            fontSize: "24px",
            fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
          }}
        >
          close
        </span>
      </Link>
      <div className="max-w-lg h-full mx-auto w-full relative">
        {uploadQuery.data.upload.metadata.mimeType.startsWith("image/") ? (
          <img
            src={`/files/${uploadID}`}
            alt={uploadID}
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            src={`/files/${uploadID}`}
            className="h-full w-full object-contain"
            controls
          />
        )}
        {previousUpload && eventQuery.data.event.uploads.length > 1 && (
          <Link
            href={
              match
                ? `~/events/${eventID}/gallery/${previousUpload}`
                : `~/${eventID}/gallery/${previousUpload}`
            }
            className="absolute top-1/2 -left-16 -translate-y-1/2 text-white size-12 flex items-center justify-center hover:bg-white/15 rounded-full"
          >
            <span
              className="material-symbols-sharp"
              style={{
                fontSize: "48px",
                fontVariationSettings:
                  "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48",
              }}
            >
              chevron_left
            </span>
          </Link>
        )}
        {nextUpload && eventQuery.data.event.uploads.length > 1 && (
          <Link
            href={
              match
                ? `~/events/${eventID}/gallery/${nextUpload}`
                : `~/${eventID}/gallery/${nextUpload}`
            }
            className="absolute top-1/2 -right-16 -translate-y-1/2 text-white size-12 flex items-center justify-center hover:bg-white/15 rounded-full"
          >
            <span
              className="material-symbols-sharp"
              style={{
                fontSize: "48px",
                fontVariationSettings:
                  "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48",
              }}
            >
              chevron_right
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
