import { useShape } from "@electric-sql/react";

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

export function useEventGuestShape(eventID: string, fingerprint: string) {
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
    fingerprint: string;
    batch_id: string;
    visible: boolean;
  }>({
    url: `${window.location.origin}/electric/v1/shape`,
    params: {
      table: "uploads",
      columns: ["id", "metadata", "fingerprint", "batch_id", "visible"],
      where: "event_id = $1",
      params: [eventID],
    },
  });

  const count = new Set(uploads.data.map((upload) => upload.batch_id)).size;

  return {
    ...event.data[0],
    uploads: uploads.data
      .map((upload) => ({
        ...upload,
        deletable: upload.fingerprint === fingerprint,
      }))
      .filter((upload) => upload.fingerprint === fingerprint || upload.visible),
    uploadAvailable: event.data[0]?.paid ? true : count < 1,
  };
}

export function useUploadShape(uploadID: string) {
  const upload = useShape<{
    id: string;
    metadata: { filename: string; mimeType: string };
  }>({
    url: `${window.location.origin}/electric/v1/shape`,
    params: {
      table: "uploads",
      columns: ["id", "metadata"],
      where: "id = $1",
      params: [uploadID],
    },
  });

  return upload.data[0];
}
