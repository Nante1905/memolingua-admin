import { MediaWithPreview } from "../../../shared/types/Media";

export interface CardMedia {
  img: MediaWithPreview | undefined;
  video: MediaWithPreview | undefined;
  audio: MediaWithPreview | undefined;
}
