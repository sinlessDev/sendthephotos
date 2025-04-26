type CreateEventResponse = {
  event: {
    id: string;
  };
};

type CreateEventArgs = {
  name: string;
};

export async function createEvent(
  args: CreateEventArgs
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

type GetEventsResponse = {
  events: {
    id: string;
    name: string;
    stats: {
      totalUploadsCount: number;
      videoUploadsCount: number;
      photoUploadsCount: number;
    };
    lastUpload: {
      id: string;
      metadata: {
        filename: string;
        mimeType: string;
      };
    } | null;
  }[];
};

export async function getAllEvents(): Promise<GetEventsResponse> {
  const response = await fetch("/api/events");

  if (!response.ok) {
    throw new Error("Failed to get events");
  }

  return response.json();
}

type GetEventResponse = {
  event: {
    name: string;
    paid: boolean;
    qrCodeURL: string;
    uploads: {
      id: string;
      metadata: {
        filename: string;
        mimeType: string;
      };
      visible: boolean;
    }[];
    stats: {
      totalUploadsCount: number;
      videoUploadsCount: number;
      photoUploadsCount: number;
    };
  };
};

export async function getEvent(eventID: string): Promise<GetEventResponse> {
  const response = await fetch(`/api/events/${eventID}`);

  return response.json();
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
