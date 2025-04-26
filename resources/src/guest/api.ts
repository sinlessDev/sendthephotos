export async function deleteUpload(uploadID: string) {
  const res = await fetch(`/files/${uploadID}`, {
    method: "DELETE",
    headers: {
      "Tus-Resumable": "1.0.0",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete upload");
  }
}

type EventForGuest = {
  event: {
    name: string;
    paid: boolean;
    uploadAvailable: boolean;
    uploads: {
      id: string;
      metadata: { filename: string; mimeType: string };
      deletable: boolean;
    }[];
  };
};

export async function getEventForGuest(
  eventID: string,
  fingerprint: string
): Promise<EventForGuest> {
  const res = await fetch(`/api/events/${eventID}/${fingerprint}`);

  if (!res.ok) {
    throw new Error("Failed to get event");
  }

  return res.json();
}
