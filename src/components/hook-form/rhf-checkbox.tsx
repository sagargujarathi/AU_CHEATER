import { Controller, useFormContext } from "react-hook-form";
// @mui
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import ErrorComponent from "./error-component";

// ----------------------------------------------------------------------

export interface RHFCheckboxProps
  extends Omit<FormControlLabelProps, "control"> {
  name: string;
  color?: string;
  helperText?: React.ReactNode;
}

export function RHFCheckbox({
  name,
  helperText,
  color = "",
  ...other
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                sx={{
                  "&.Mui-checked": {
                    color: color ? color : "initial",
                  },
                }}
              />
            }
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? <ErrorComponent message={error?.message} /> : helperText}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
