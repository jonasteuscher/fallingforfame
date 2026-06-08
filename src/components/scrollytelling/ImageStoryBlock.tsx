import { ImageBlock } from "@/components/media/ImageBlock";
import type { MediaAsset } from "@/types/media";

type ImageStoryBlockProps = {
  title: string;
  body: string;
  image?: MediaAsset;
};

export function ImageStoryBlock({ title, body, image }: ImageStoryBlockProps) {
  return (
    <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-[1fr_0.8fr]">
      <ImageBlock image={image} />
      <div className="min-w-0 self-center">
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
        <p className="mt-4 leading-7 text-foreground/72">{body}</p>
      </div>
    </div>
  );
}
