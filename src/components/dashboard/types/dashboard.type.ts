import { Langage } from "../../../shared/types/Langage";

interface HourlySessionNbr {
  h: number;
  totalLearning: number;
  totalReview: number;
}

interface UserThemeNbr {
  idTheme: string;
  label: string;
  nbr: number;
}

interface UserLevelNbr {
  id: string;
  label: string;
  nbr: number;
}

export interface StatsDetails {
  start: string;
  end: string;
  stats: {
    lang: Langage;
    totalUser: number;
    sessions: HourlySessionNbr[];
    packages: UserThemeNbr[];
    quiz: UserThemeNbr[];
    levels: UserLevelNbr[];
  };
}

export interface GeneralStatsData {
  signedUser: number;
  avgSessionPerDay: number;
  usersPerLang: UserPerLang[];
  usersPerThemeOnPackages: UserThemeNbr[];
  usersPerThemeOnQuiz: UserThemeNbr[];
  hourlySession: HourlySessionNbr[];
}

export interface UserPerLang {
  idLanguageTarget: string;
  targetLabel: string;
  targetCode: string;
  nbUser: number;
}
