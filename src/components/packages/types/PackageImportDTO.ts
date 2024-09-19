import { ImportDTO } from "../../../shared/types/ImportDTO";

export interface PackageImportDTO extends ImportDTO {
  title: string;
  theme: string;
  source: string;
  target: string;
}
