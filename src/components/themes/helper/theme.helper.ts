import z from "zod";
import { formErrors } from "../../../shared/constants/form-errors.constant";
import { MultiLabelTheme, Theme } from "../../../shared/types/Theme";

export const ThemeSchema = z.object({
  label: z.string().min(1, formErrors["fr"].required),
  icon: z.string().nullable().optional(),
  langs: z.array(
    z
      .object({
        id: z.string().min(1, formErrors["fr"].required),
        label: z.string(),
        // label: z.string().min(1, formErrors["fr"].required),
      })
      .optional()
  ),
});

export const themeFactory = (data: MultiLabelTheme) => {
  console.log(data);

  const t: Theme = {
    id: data?.id,
    label: data?.label,
    state: data?.state,
    icon: data?.icon,
    nbr: data?.nbr,
  };
  return t;
};
