import { useContext, useEffect, useState } from "react";
import AuthAPI from "../utils/AuthAPI";
import axios from "axios";
import Typography from "@mui/material/Typography";
import LoadingAPI from "../utils/LoadingAPI";
import Box from "@mui/material/Box/Box";
import { CircularProgress } from "@mui/material";
import formatCurrency from "../utils/formatCurrency";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Form, Formik } from "formik";
import CustomInput from "./Formik/CustomInput";
import Button from "@mui/material/Button";
import { cashDepoSchema } from "./Formik/yup.schema";

ChartJS.register(ArcElement, Tooltip, Legend);

const AccountBal = () => {
  const { session } = useContext(AuthAPI);
  const { loading, setLoading } = useContext(LoadingAPI);
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
        cashBalance: 0,
        equityBalance: 0,
        fixedIncomeBal: 0,
      },
    },
  });

  interface AccountData {
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
        cashBalance: number;
        equityBalance: number;
        fixedIncomeBal: number;
      };
    };
  }

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
  }, [session.currentUserId, setLoading]);

  const { cashBalance, equityBalance, fixedIncomeBal } =
    accountDetails.userClient.account;

  const totalNav =
    Number(cashBalance) + Number(equityBalance) + Number(fixedIncomeBal);

  const pieData = {
    labels: ["Cash", "Equity", "Fixed Income"],
    datasets: [
      {
        label: "Total NAV Value",
        data: [
          Number(cashBalance),
          Number(equityBalance),
          Number(fixedIncomeBal),
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleDeposit = () => {
    console.log("adding money");
  };

  const handleWithdraw = () => {
    console.log("taking money");
  };

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
              <Box sx={{ position: "relative", width: "30vw", height: "60vh" }}>
                <Pie data={pieData} />
              </Box>
              <Box sx={{ width: "35%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Cash Balance:</Typography>
                  <br />
                  <Typography>${formatCurrency(cashBalance)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Equity Balance:</Typography>
                  <Typography>${formatCurrency(equityBalance)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Fixed Income Balance:</Typography>
                  <Typography>${formatCurrency(fixedIncomeBal)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Total NAV:</Typography>
                  <Typography>${formatCurrency(totalNav)}</Typography>
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
        <Typography variant="h4">Deposit Cash</Typography>
        <br />
        <Formik
          initialValues={{ cashBalance: "" }}
          validationSchema={cashDepoSchema}
          onSubmit={handleDeposit}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off" style={{ display: "flex", gap: "0.2rem" }}>
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
        <br />
        <br />
        <Typography variant="h4">Withdraw Cash</Typography>
        <br />
        <Formik
          initialValues={{ cashBalance: "" }}
          validationSchema={cashDepoSchema}
          onSubmit={handleWithdraw}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off" style={{ display: "flex", gap: "0.2rem" }}>
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
      </Box>
    </Box>
  );
};

export default AccountBal;
