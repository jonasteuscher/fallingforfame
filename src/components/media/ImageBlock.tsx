import Image from "next/image";

import { MediaCaption } from "@/components/media/MediaCaption";
import type { MediaAsset } from "@/types/media";

type ImageBlockProps = {
  image?: MediaAsset;
  priority?: boolean;
};

export function ImageBlock({ image, priority = false }: ImageBlockProps) {
  return (
    <figure className="w-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm uppercase tracking-wide text-foreground/60">
            Image placeholder
          </div>
        )}
      </div>
      <MediaCaption caption={image?.caption} credit={image?.credit} />
    </figure>
  );
}
