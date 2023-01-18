import { useField } from "formik";
import type { CustomFieldProps } from "./CustomFieldProps";
import TextField from "@mui/material/TextField";

const CustomInput = ({ ...props }: CustomFieldProps) => {
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
      />
    </>
  );
};
export default CustomInput;
