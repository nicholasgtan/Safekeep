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

export interface CustomSelectProps {
  label?: string;
  name: string;
  type?: string;
  select?: boolean;
  placeholder?: string;
  value?: string;
  style?: React.CSSProperties;
  InputProps?: {
    inputProps: {
      min: number;
    };
  };
  children?: React.ReactNode;
}
