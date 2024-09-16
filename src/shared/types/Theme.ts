import { Langage } from "./Langage";

export interface Theme {
  id: string;
  label: string;
  state: number;
  icon: string;
  nbr: number;
  langExist?: number;
  totalLang?: number;
}

export interface ThemeLabel extends Langage {
  themeLabel?: string;
}

export interface MultiLabelTheme extends Theme {
  labels: ThemeLabel[];
}
