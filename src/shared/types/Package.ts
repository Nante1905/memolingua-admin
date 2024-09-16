import { Langage } from "./Langage";
import { Theme } from "./Theme";

export interface Package {
  id: string;
  title: string;
  imgPath: string;
  state: number;
  creationDate: Date;
  languageSource: Langage;
  languageTarget: Langage;
  theme: Theme;
}
