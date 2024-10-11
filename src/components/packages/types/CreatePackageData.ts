import { Media } from "../../../shared/types/Media";

export interface CreatePackageData {
  title: string;
  theme: string;
  sourceLang: string;
  targetLang: string;
  img: Media;
}
