import { Langage } from "./Langage";

export interface Theme {
  id: string;
  label: string;
  state: number;
  icon: string;
  langExist?: number;
  totalLang?: number;
  nbr: number;
}

export interface ThemeLib extends Theme {
  totalPackage: number;
  existPackage: number;
  totalQuiz: number;
  existQuiz: number;
}

export interface ThemeLabel extends Langage {
  themeLabel?: string;
}

export interface MultiLabelTheme extends Theme {
  labels: ThemeLabel[];
}
