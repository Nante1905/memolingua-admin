import { Package } from "../../../shared/types/Package";

export interface PackageLib {
  id: string;
  title: string;
  imgPath: string | null;
  state: number;
  creationDate: string;
  nb: number;
  themeLabel: string;
  lTarget: string;
  lTargetCode: string;
  lSource: string;
  lSourceCode: string;
  authorRole: string;
  authorName: string;
}

export interface PackageContent extends Package {
  cards: {
    id: string;
    recto: string;
    verso: string;
    state: number;
    medias: {
      id: string;
      mediaType: string;
      mediaPath: string;
    }[];
  }[];
  author: {
    lastname: string;
    firstname: string;
    role: {
      code: string;
    };
  };
}
