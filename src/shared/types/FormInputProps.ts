import { Control, FieldValue } from "react-hook-form";

export interface FormInputProps {
  control?: Control<FieldValue<any>>;
  name: string;
  label: string;
  className?: string;
}
