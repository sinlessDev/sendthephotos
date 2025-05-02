import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
export {
  Dialog as QrCodeDialog,
  DialogTrigger as QrCodeDialogTrigger,
} from "@radix-ui/react-dialog";

type QrCodeDialogContentProps = {
  url: string;
};

export function QrCodeDialogContent({ url }: QrCodeDialogContentProps) {
  return (
    <DialogPortal>
      <DialogContent className="fixed bg-white inset-0 p-7 flex items-center justify-center *:data-[slot='close']:top-7 *:data-[slot='close']:right-7 *:data-[slot='close']:absolute *:data-[slot='download']:bottom-7 *:data-[slot='download']:right-7 *:data-[slot='download']:absolute">
        <DialogTitle className="sr-only">QR-код</DialogTitle>
        <DialogDescription className="sr-only">
          QR-код для гостей
        </DialogDescription>
        <img className="h-full aspect-square" src={url} alt="QR-код" />
        <DialogClose asChild>
          <button className="rounded-full bg-white active:bg-stone-200 border border-black/25 p-2 flex items-center justify-center absolute top-7 right-7">
            <span
              className="material-symbols-sharp"
              style={{
                fontSize: "24px",
                fontVariationSettings:
                  "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
              }}
            >
              close
            </span>
          </button>
        </DialogClose>
        <a
          download
          href={url}
          className="rounded-full bg-white hover:bg-stone-200 border border-black/25 p-2 flex items-center justify-center absolute bottom-7 right-7"
        >
          <span
            className="material-symbols-sharp"
            style={{
              fontSize: "24px",
              fontVariationSettings:
                "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24",
            }}
          >
            download
          </span>
        </a>
      </DialogContent>
    </DialogPortal>
  );
}
