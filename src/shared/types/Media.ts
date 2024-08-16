export interface Media {
  blob: string;
  fileName: string;
  contentType: string;
}

export interface MediaWithPreview extends Media {
  preview: string;
}
