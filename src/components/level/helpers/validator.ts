import { z } from "zod";
import {
  numberRequired,
  strRequired,
} from "../../../shared/constants/validator.constant";

export const levelSchema = z.object({
  label: strRequired,
  minPts: numberRequired(0, Infinity),
  maxPts: numberRequired(0, Infinity),
});
