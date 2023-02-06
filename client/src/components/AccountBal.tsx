import { useContext, useEffect, useState } from "react";
import AuthAPI from "../utils/AuthAPI";
import axios from "axios";
import Typography from "@mui/material/Typography";
import LoadingAPI from "../utils/LoadingAPI";
import Box from "@mui/material/Box/Box";
import { CircularProgress } from "@mui/material";
import formatCurrency from "../utils/formatCurrency";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import CustomInput from "./Formik/CustomInput";
import Button from "@mui/material/Button";
import { cashBalSchema } from "./Formik/yup.schema";
import PieChart from "./PieChart";
import CustomNumInput from "./Formik/CustomNumInput";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface AccountData {
  email: string;
  firstName: string;
  lastName: string;
  userClient: {
    name: string;
    accountRep: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    account: {
      id: string;
      cashBalance: number;
      equityBalance: number;
      fixedIncomeBal: number;
    };
  };
}

const AccountBal = () => {
  const { session } = useContext(AuthAPI);
  const { loading, setLoading } = useContext(LoadingAPI);
  const [render, setRender] = useState(1);
  const [successD, setSuccessD] = useState("");
  const [successW, setSuccessW] = useState("");
  const [accountDetails, setAccountDetails] = useState<AccountData>({
    email: "",
    firstName: "",
    lastName: "",
    userClient: {
      name: "",
      accountRep: {
        id: "",
        email: "",
        firstName: "",
        lastName: "",
      },
      account: {
        id: "",
        cashBalance: 0,
        equityBalance: 0,
        fixedIncomeBal: 0,
      },
    },
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<AccountData>(
          `/api/users/account/${session.currentUserId}`
        );
        if (!data) {
          setLoading(false);
          throw new Error("Network Error");
        }
        if (data !== null) {
          setLoading(false);
          if (data.userClient.accountRep.id !== session.currentUserId) {
            setAccountDetails(data);
          }
          return data;
        }
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          console.log("error message: ", error.response?.data.msg);
          // setStatus(error.response?.data.msg);
          // 👇️ error: AxiosError<any, any>
          return error.message;
        } else {
          // console.log("unexpected error: ", error);
          return "An unexpected error occurred";
        }
      }
    };
    fetchAccount();
  }, [session.currentUserId, setLoading, render]);

  const { cashBalance, equityBalance, fixedIncomeBal } =
    accountDetails.userClient.account;

  const totalNav =
    Number(cashBalance) + Number(equityBalance) + Number(fixedIncomeBal);

  interface CashDepo extends FormikValues {
    cashBalance: number;
  }

  const handleDeposit = async (
    values: CashDepo,
    actions: FormikHelpers<CashDepo>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCashBalance =
      Number(accountDetails.userClient.account.cashBalance) +
      Number(values.cashBalance);
    try {
      const { data } = await axios.put(
        `/api/accounts/cash/${accountDetails.userClient.account.id}`,
        {
          cashBalance: newCashBalance,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!data) {
        throw new Error("Network Error");
      }
      if (data !== null) {
        setAccountDetails({ ...accountDetails, ...data });
        setSuccessD("Transaction successful");
        setRender(render + 1);
        actions.resetForm();
      }
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.response?.data.msg);
        // setStatus(error.response?.data.msg);
        // 👇️ error: AxiosError<any, any>
        return error.message;
      } else {
        // console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };

  const handleWithdraw = async (
    values: CashDepo,
    actions: FormikHelpers<CashDepo>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCashBalance =
      Number(accountDetails.userClient.account.cashBalance) -
      Number(values.cashBalance);
    if (newCashBalance < 0) {
      setSuccessW("Insufficient Cash to Withdraw");
    }
    try {
      const { data } = await axios.put(
        `/api/accounts/cash/${accountDetails.userClient.account.id}`,
        {
          cashBalance: newCashBalance,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!data) {
        throw new Error("Network Error");
      }
      if (data !== null) {
        setAccountDetails({ ...accountDetails, ...data });
        setSuccessW("Transaction successful");
        setRender(render - 1);
        actions.resetForm();
      }
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.response?.data.msg);
        // setStatus(error.response?.data.msg);
        // 👇️ error: AxiosError<any, any>
        return error.message;
      } else {
        // console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };

  return (
    <Box sx={{ display: "flex", height: "68vh", gap: "1rem" }}>
      <Box
        sx={{
          width: "70%",
          // border: "solid 1px #121212",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Box sx={{ alignSelf: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: "90%" }}>
            <Typography variant="h3">
              {accountDetails.userClient.name}
            </Typography>
            <br />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ position: "relative", width: "30vw", height: "50vh" }}>
                <PieChart
                  cashBalance={cashBalance}
                  equityBalance={equityBalance}
                  fixedIncomeBal={fixedIncomeBal}
                />
              </Box>
              <Box
                sx={{
                  width: "35%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Cash:</Typography>
                  <br />
                  <Typography variant="h6">
                    ${formatCurrency(cashBalance)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Equity:</Typography>
                  <Typography variant="h6">
                    ${formatCurrency(equityBalance)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Fixed Income:</Typography>
                  <Typography variant="h6">
                    ${formatCurrency(fixedIncomeBal)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">Total NAV:</Typography>
                  <Typography variant="h6">
                    ${formatCurrency(totalNav)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: "30%",
          // border: "solid 1px #121212",
          // display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box height="10vh">
          <Typography variant="h5">Deposit Cash</Typography>
          <br />
          <Formik
            enableReinitialize={true}
            initialValues={{ cashBalance: 0 }}
            validationSchema={cashBalSchema}
            onSubmit={handleDeposit}
          >
            {({ isSubmitting }) => (
              <Form
                autoComplete="off"
                style={{ display: "flex", gap: "0.2rem" }}
              >
                <CustomNumInput
                  label="Cash"
                  name="cashBalance"
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <br />
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                  sx={{ height: "36px", width: "110px" }}
                >
                  Deposit
                </Button>
              </Form>
            )}
          </Formik>
          <Typography variant="body2">{successD}</Typography>
        </Box>
        <br />
        <br />
        <Box height="10vh">
          <Typography variant="h5">Withdraw Cash</Typography>
          <br />
          <Formik
            initialValues={{ cashBalance: 0 }}
            validationSchema={cashBalSchema}
            onSubmit={handleWithdraw}
          >
            {({ isSubmitting }) => (
              <Form
                autoComplete="off"
                style={{ display: "flex", gap: "0.2rem" }}
              >
                <CustomInput
                  label="Cash"
                  name="cashBalance"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <br />
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                  sx={{ height: "36px", width: "110px" }}
                >
                  Withdraw
                </Button>
              </Form>
            )}
          </Formik>
          <Typography variant="body2">{successW}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountBal;
