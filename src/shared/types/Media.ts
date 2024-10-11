export interface Media {
  blob: string;
  fileName: string;
  contentType: string;
  size?: number;
}

export interface MediaWithPreview {
  media: Media;
  preview: string;
}
