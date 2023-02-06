import { useField } from "formik";
import type { CustomFieldProps } from "./CustomFieldProps";
import TextField from "@mui/material/TextField";
import { forwardRef } from "react";
import { NumericFormat } from "react-number-format";
import {
  InputAttributes,
  NumericFormatProps,
} from "react-number-format/types/types";

interface CustomProps {
  onChange: (event: {
    target: {
      name: string;
      value: number | undefined;
    };
  }) => void;
  name: string;
}

const NumberFormatCustom = forwardRef<
  NumericFormatProps<InputAttributes>,
  CustomProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        const { floatValue } = values;
        onChange({
          target: {
            name: props.name,
            value: floatValue,
          },
        });
      }}
      valueIsNumericString={true}
      thousandSeparator=","
      allowNegative={false}
      decimalScale={2}
    />
  );
});

const CustomNumInput = ({ ...props }: CustomFieldProps) => {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        {...field}
        {...props}
        InputProps={{
          inputComponent: NumberFormatCustom as never,
        }}
        error={meta.touched && meta.error ? true : false}
        helperText={
          meta.touched &&
          meta.error && <span className="error"> {meta.error} </span>
        }
      />
    </>
  );
};
export default CustomNumInput;
