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
