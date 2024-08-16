import { Media } from "../../../shared/types/Media";

export interface PackageFormState {
  img: Media,
  imgPreview: string
}

export const initialPackageFormState: PackageFormState = {
  img: {
    fileName: "",
    blob: "",
    contentType: ""
  },
  imgPreview: ""
};
