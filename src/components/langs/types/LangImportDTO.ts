import { ImportDTO } from "../../../shared/types/ImportDTO";

export interface LangImportDTO extends ImportDTO {
  label: string;
  code: string;
}
