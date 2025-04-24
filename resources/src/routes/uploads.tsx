import { useParams } from "react-router";

export function UploadsRoute() {
  const { eventID } = useParams();

  return <div>Uploads: {eventID}</div>;
}
