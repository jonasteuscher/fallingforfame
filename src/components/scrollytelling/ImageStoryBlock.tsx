import { ImageBlock } from "@/components/media/ImageBlock";
import type { MediaAsset } from "@/types/media";

type ImageStoryBlockProps = {
  title: string;
  body: string;
  image?: MediaAsset;
};

export function ImageStoryBlock({ title, body, image }: ImageStoryBlockProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <ImageBlock image={image} />
      <div className="self-center">
        <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
        <p className="mt-4 leading-7 text-foreground/72">{body}</p>
      </div>
    </div>
  );
}
