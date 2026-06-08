import { ImageBlock } from "@/components/media/ImageBlock";
import type { MediaAsset } from "@/types/media";

type ImageGalleryProps = {
  images: MediaAsset[];
};

export function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="border border-border bg-surface p-6 text-foreground/70">
        Image gallery placeholder
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2" aria-label="Image gallery">
      {images.map((image) => (
        <ImageBlock key={image.src} image={image} />
      ))}
    </div>
  );
}
