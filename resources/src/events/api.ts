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
