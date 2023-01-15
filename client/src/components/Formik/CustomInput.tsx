import { useField } from "formik";

interface CustomInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
}

const CustomInput = ({ label, ...props }: CustomInputProps) => {
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
