import { useShape } from "@electric-sql/react";

type CreateEventResponse = {
  event: {
    id: string;
  };
};

type CreateEventArgs = {
  name: string;
};

export async function createEvent(
  args: CreateEventArgs,
): Promise<CreateEventResponse> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
}

type Event = {
  id: string;
  name: string;
};

type Upload = {
  id: string;
  metadata: {
    filename: string;
    mimeType: string;
  };
  event_id: string;
};

export function useAllEventsShape() {
  const events = useShape<Event>({
    url: `${window.location.origin}/electric/v1/shape`,
    params: {
      table: "events",
      columns: ["id", "name"],
    },
  });

  const uploads = useShape<Upload>({
    url: `${window.location.origin}/electric/v1/shape`,
    params: {
      table: "uploads",
      columns: ["id", "metadata", "event_id"],
    },
  });

  return events.data.map((event) => ({
    ...event,
    stats: {
      totalUploadsCount: uploads.data.filter(
        (upload) => upload.event_id === event.id,
      ).length,
      videoUploadsCount: uploads.data.filter(
        (upload) =>
          upload.event_id === event.id &&
          upload.metadata.mimeType.startsWith("video/"),
      ).length,
      photoUploadsCount: uploads.data.filter(
        (upload) =>
          upload.event_id === event.id &&
          upload.metadata.mimeType.startsWith("image/"),
      ).length,
    },
    lastUpload:
      uploads.data
        .filter((upload) => upload.event_id === event.id)
        .sort((a, b) => a.metadata.filename.localeCompare(b.metadata.filename))
        .at(0) ?? null,
  }));
}

export function useEventShape(eventID: string) {
  const event = useShape<{
    id: string;
    name: string;
    paid: boolean;
  }>({
    url: `${window.location.origin}/electric/v1/shape`,
    params: {
      table: "events",
      columns: ["id", "name", "paid"],
      where: "id = $1",
      params: [eventID],
    },
  });

  const uploads = useShape<{
    id: string;
    metadata: { filename: string; mimeType: string };
    visible: boolean;
  }>({
    url: `${window.location.origin}/electric/v1/shape`,
    params: {
      table: "uploads",
      columns: ["id", "metadata", "visible"],
      where: "event_id = $1",
      params: [eventID],
    },
  });

  return {
    ...event.data[0],
    uploads: uploads.data,
    stats: {
      totalUploadsCount: uploads.data.length,
      videoUploadsCount: uploads.data.filter((upload) =>
        upload.metadata.mimeType.startsWith("video/"),
      ).length,
      photoUploadsCount: uploads.data.filter((upload) =>
        upload.metadata.mimeType.startsWith("image/"),
      ).length,
    },
  };
}

export async function toggleUploadVisibility(uploadID: string) {
  const response = await fetch(`/api/uploads/${uploadID}/toggle-visibility`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle upload visibility");
  }
}

export async function deleteEvent(eventID: string) {
  const response = await fetch(`/api/events/${eventID}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
}
