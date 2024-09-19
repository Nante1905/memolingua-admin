import { ImportDTO } from "../../../shared/types/ImportDTO";

export interface PackageImportDTO extends ImportDTO {
  title: string;
  theme: string;
  source: string;
  target: string;
}

export interface CardImportDTO extends ImportDTO {
  package: string;
  recto: string;
  verso: string;
}
