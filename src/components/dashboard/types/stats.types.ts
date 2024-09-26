export interface GeneralStatsData {
  signedUser: number;
  avgSessionPerDay: number;
  usersPerLang: UserPerLang[];
  usersPerThemeOnPackages: UserPerTheme[];
  usersPerThemeOnQuiz: UserPerTheme[];
  hourlySession: HourlySession[];
}

export interface HourlySession {
  h: number;
  totalLearning: number;
  totalReview: number;
}

export interface UserPerLang {
  idLanguageTarget: string;
  targetLabel: string;
  targetCode: string;
  nbUser: number;
}
export interface UserPerTheme {
  idTheme: string;
  label: string;
  nbr: number;
}
