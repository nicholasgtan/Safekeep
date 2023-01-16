import { useField } from "formik";
import { CustomFieldProps } from "./CustomFieldProps";

const CustomInput = ({ label, ...props }: CustomFieldProps ) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label>{label}</label>
      <br />
      <input
        {...field}
        {...props}
        className={meta.touched && meta.error ? "input-error" : ""}
      />
      {meta.touched && meta.error && (
        <span className="error"> {meta.error} </span>
      )}
    </>
  );
};
export default CustomInput;
