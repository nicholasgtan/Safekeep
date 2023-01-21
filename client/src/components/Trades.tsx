import { useContext, useState } from "react";
import AuthAPI from "../utils/AuthAPI";
import axios from "axios";
import Typography from "@mui/material/Typography";
import LoadingAPI from "../utils/LoadingAPI";
import Box from "@mui/material/Box/Box";
import { CircularProgress } from "@mui/material";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import CustomInput from "./Formik/CustomInput";
import Button from "@mui/material/Button";
import { cashDepoSchema } from "./Formik/yup.schema";
import TradeTable from "./TradeTable";

export interface TradeProps {
  tradeDate: string;
  settlementDate: string;
  position: string;
  stockType: string;
  settlementAmt: number;
  id: string;
}

export interface TradeData {
  userClient: {
    name: string;
    account: {
      trade: TradeProps[];
    };
  };
}

const Trades = () => {
  const { session } = useContext(AuthAPI);
  const { loading, setLoading } = useContext(LoadingAPI);
  const [render, setRender] = useState(1);
  const [successD, setSuccessD] = useState("");
  const [successW, setSuccessW] = useState("");

  // useEffect(() => {
  //   const fetchAccount = async () => {
  //     try {
  //       setLoading(true);
  //       const { data } = await axios.get<TradeData>(
  //         `/api/users/account/${session.currentUserId}`
  //       );
  //       if (!data) {
  //         setLoading(false);
  //         throw new Error("Network Error");
  //       }
  //       if (data !== null) {
  //         setLoading(false);
  //         if (data.userClient.accountRep.id !== session.currentUserId) {
  //           setAccountDetails(data);
  //           render + 1;
  //         }
  //         return data;
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       if (axios.isAxiosError(error)) {
  //         console.log("error message: ", error.response?.data.msg);
  //         // setStatus(error.response?.data.msg);
  //         // 👇️ error: AxiosError<any, any>
  //         return error.message;
  //       } else {
  //         // console.log("unexpected error: ", error);
  //         return "An unexpected error occurred";
  //       }
  //     }
  //   };
  //   fetchAccount();
  // }, [session.currentUserId, setLoading, render]);

  // interface CashDepo extends FormikValues {
  //   cashBalance: number;
  // }

  // const handleDeposit = async (
  //   values: CashDepo,
  //   actions: FormikHelpers<CashDepo>
  // ) => {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   const newCashBalance =
  //     Number(accountDetails.userClient.account.cashBalance) +
  //     Number(values.cashBalance);
  //   try {
  //     const { data } = await axios.put(
  //       `/api/accounts/cash/${accountDetails.userClient.account.id}`,
  //       {
  //         cashBalance: newCashBalance,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       }
  //     );
  //     if (!data) {
  //       throw new Error("Network Error");
  //     }
  //     if (data !== null) {
  //       setAccountDetails({ ...accountDetails, ...data });
  //       setSuccessD("Transaction successful");
  //       setRender(render + 1);
  //       actions.resetForm();
  //     }
  //     return data;
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.log("error message: ", error.response?.data.msg);
  //       // setStatus(error.response?.data.msg);
  //       // 👇️ error: AxiosError<any, any>
  //       return error.message;
  //     } else {
  //       // console.log("unexpected error: ", error);
  //       return "An unexpected error occurred";
  //     }
  //   }
  // };

  // const handleWithdraw = async (
  //   values: CashDepo,
  //   actions: FormikHelpers<CashDepo>
  // ) => {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   const newCashBalance =
  //     Number(accountDetails.userClient.account.cashBalance) -
  //     Number(values.cashBalance);
  //   try {
  //     const { data } = await axios.put(
  //       `/api/accounts/cash/${accountDetails.userClient.account.id}`,
  //       {
  //         cashBalance: newCashBalance,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       }
  //     );
  //     if (!data) {
  //       throw new Error("Network Error");
  //     }
  //     if (data !== null) {
  //       setAccountDetails({ ...accountDetails, ...data });
  //       setSuccessW("Transaction successful");
  //       setRender(render - 1);
  //       actions.resetForm();
  //     }
  //     return data;
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.log("error message: ", error.response?.data.msg);
  //       // setStatus(error.response?.data.msg);
  //       // 👇️ error: AxiosError<any, any>
  //       return error.message;
  //     } else {
  //       // console.log("unexpected error: ", error);
  //       return "An unexpected error occurred";
  //     }
  //   }
  // };

  return (
    <Box sx={{ display: "flex", height: "68vh", gap: "2rem" }}>
      <Box
        sx={{
          width: "70%",
          // border: "solid 1px #121212",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* {loading ? (
          <Box sx={{ alignSelf: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: "90%" }}>
            <Typography variant="h3">Company Name</Typography>
            <br />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}> */}
        <TradeTable />
        {/* </Box>
          </Box>
        )} */}
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
        {" "}
        <Box height="106.55px">
          <Typography variant="h5">Trade Input</Typography>
          <br />
          <Formik
            initialValues={{ cashBalance: 0 }}
            validationSchema={cashDepoSchema}
            onSubmit={() => {
              console.log("submit");
            }}
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
                  Deposit
                </Button>
              </Form>
            )}
          </Formik>
          <Typography variant="body2">{successD}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Trades;
