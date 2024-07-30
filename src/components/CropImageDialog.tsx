import { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import "cropperjs/dist/cropper.css";

interface Props {
  src: string;
  cropAspectRation: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

const CropImageDialog = ({
  cropAspectRation,
  onClose,
  onCropped,
  src,
}: Props) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const crop = () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Crop image</DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRation}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageDialog;
