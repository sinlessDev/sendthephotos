import { a } from "#components/aba";
import { asd } from "#components/bla";
import { useParams } from "react-router";

export function UploadsRoute() {
  const { eventID } = useParams();

  return (
    <div>
      Uploads: {eventID} {a} {asd}
    </div>
  );
}
