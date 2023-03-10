import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email"),
  password: yup.string(),
});

export const cashBalSchema = yup.object().shape({
  cashBalance: yup.number().min(1, "Amount cannot be 0"),
});

export const tradeInputSchema = yup.object().shape({
  tradeDate: yup.date().required("Required"),
  settlementDate: yup
    .date()
    .min(yup.ref("tradeDate"), "Settlement Date must be after Trade Date")
    .required("Required"),
  stockType: yup
    .string()
    .oneOf(["equity", "fixedIncome"], "Invalid security type")
    .required("Required"),
  position: yup
    .string()
    .oneOf(["buy", "sell"], "Invalid transaction type")
    .required("Required"),
  settlementAmt: yup.number().min(1, "Amount cannot be 0").required("Required"),
});

export const clientSchema = yup.object().shape({
  name: yup.string().required("Required"),
  type: yup.string().required("Required"),
});

export const userSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  firstName: yup.string().required("Required").trim(),
  lastName: yup.string().required("Required").trim(),
  password: yup.string().required("Required"),
  userClientId: yup.string().required("Required"),
});
