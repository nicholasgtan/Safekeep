import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email"),
  password: yup.string(),
});

export const cashDepoSchema = yup.object().shape({
  cashBalance: yup.number().min(0),
});
