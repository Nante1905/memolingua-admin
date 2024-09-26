import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "@mui/icons-material";
import { Button, FormHelperText } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import "./date-range-picker.component.scss";

interface DateRangeProps {
  defaultStart?: Dayjs;
  defaultEnd?: Dayjs;
  onSubmit: (data: { start: Dayjs; end: Dayjs }) => void;
}

const DateRangePicker: React.FC<DateRangeProps> = (props) => {
  const form = useForm({
    resolver: zodResolver(
      z
        .object({
          start: z.coerce.date({
            invalid_type_error: "Date invalide",
          }),
          end: z.coerce.date({
            invalid_type_error: "Date invalide",
          }),
        })
        .refine((data) => data.start < data.end, {
          message: "Intervalle invalide",
          path: ["date"],
        })
    ),
  });

  const onSubmit = useCallback(
    (data: any) => {
      props.onSubmit({
        start: dayjs(data.start as Date),
        end: dayjs(data.end as Date),
      });
    },
    [props]
  );

  return (
    <div className="date-range-picker">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form className="form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="inputs">
            <Controller
              control={form.control}
              name="start"
              defaultValue={props.defaultStart ?? dayjs().startOf("month")}
              render={({ field }) => (
                <DatePicker
                  slotProps={{
                    textField: {
                      size: "small",
                      error:
                        !!form.formState.errors.date ||
                        !!form.formState.errors.start,
                    },
                  }}
                  {...field}
                  label="Début"
                  format="DD-MM-YYYY"
                />
              )}
            />
            <p>à</p>
            <Controller
              control={form.control}
              name="end"
              defaultValue={props.defaultEnd ?? dayjs().endOf("month")}
              render={({ field }) => (
                <DatePicker
                  slotProps={{
                    textField: {
                      size: "small",
                      error:
                        !!form.formState.errors.date ||
                        !!form.formState.errors.end,
                    },
                  }}
                  {...field}
                  label="Fin"
                  format="DD-MM-YYYY"
                />
              )}
            />

            <Button variant="contained" type="submit" size="small">
              <Search fontSize="small" />
            </Button>
          </div>
          {form.formState.errors.date && (
            <FormHelperText error className="text-center">
              <>{form.formState.errors.date.message}</>
            </FormHelperText>
          )}
          {form.formState.errors.end && (
            <FormHelperText error className="text-center">
              <>Date limite: {form.formState.errors.end.message}</>
            </FormHelperText>
          )}
          {form.formState.errors.start && (
            <FormHelperText error className="text-center">
              <>Date de début: {form.formState.errors.start.message}</>
            </FormHelperText>
          )}
        </form>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangePicker;
