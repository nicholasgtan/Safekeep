import { useField } from "formik";
import type { CustomSelectProps } from "./CustomFieldProps";
import TextField from "@mui/material/TextField";

const CustomSelect = ({ ...props }: CustomSelectProps) => {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        {...field}
        {...props}
        error={meta.touched && meta.error ? true : false}
        helperText={
          meta.touched &&
          meta.error && <span className="error"> {meta.error} </span>
        }
        size="small"
      />
    </>
  );
};
export default CustomSelect;
