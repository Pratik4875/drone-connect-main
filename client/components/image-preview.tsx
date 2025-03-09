import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ImagePreviewProps {
  files: File[] | string; // Accepts an array of File objects or a string URL
}

const ImagePreview: FC<ImagePreviewProps> = ({ files }) => {
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  useEffect(() => {
    if (!files) {
      setPreviewURL(null);
      return;
    }

    if (Array.isArray(files) && files.length > 0 && files[0] instanceof File) {
      const objectUrl = URL.createObjectURL(files[0]);
      setPreviewURL(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup memory
    }

    if (typeof files === "string") {
      setPreviewURL(files);
    }
  }, [files]);

  if (!previewURL) return null;

  return (
    <div className="mx-auto">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={previewURL}
          height={200}
          width={200}
          alt="image-preview"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  );
};

export default ImagePreview;
