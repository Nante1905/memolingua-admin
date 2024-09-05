export interface Media {
  blob: string;
  fileName: string;
  contentType: string;
  size?: number;
}

export interface MediaWithPreview extends Media {
  preview: string;
}
