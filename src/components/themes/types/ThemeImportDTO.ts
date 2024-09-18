import { ImportDTO } from "../../../shared/types/ImportDTO";

export interface ThemeImportDTO extends ImportDTO {
  theme: string;
  langage: string;
  traduction: string;
}
