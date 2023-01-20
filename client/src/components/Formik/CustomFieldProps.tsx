//Formik Custom field props
export interface CustomFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  style?: React.CSSProperties;
  InputProps?: {
    inputProps: {
      min: number;
    };
  };
}
