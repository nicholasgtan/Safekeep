import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box/Box";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import CustomInput from "./Formik/CustomInput";
import Button from "@mui/material/Button";
import { tradeInputSchema } from "./Formik/yup.schema";
import TradeTable from "./TradeTable";
import CustomSelect from "./Formik/CustomSelect";
import MenuItem from "@mui/material/MenuItem";
import AuthAPI from "../utils/AuthAPI";
import LoadingAPI from "../utils/LoadingAPI";

export interface TradeProps {
  tradeDate: string;
  settlementDate: string;
  position: string;
  stockType: string;
  settlementAmt: number;
  id?: string;
}

export interface TradeData {
  userClient: {
    name: string;
    account: {
      id: string;
      cashBalance: number;
      equityBalance: number;
      fixedIncomeBal: number;
      trade: TradeProps[];
    };
  };
}

export interface AccountBalance extends FormikValues {
  cashBalance?: number;
  equityBalance?: number;
  fixedIncomeBal?: number;
}

// interface TradesPageProps {
//   setAccountId: Dispatch<SetStateAction<string>>;
//   setAccountBal: Dispatch<SetStateAction<AccountBalance>>;
//   render: number;
// }

const Trades = () => {
  const [render, setRender] = useState(1);
  const [success, setSuccess] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accountBal, setAccountBal] = useState<AccountBalance>({});
  const [clientName, setClientName] = useState("");
  const [database, setDatabase] = useState<TradeProps[]>([]);
  const { session } = useContext(AuthAPI);
  const { loading, setLoading } = useContext(LoadingAPI);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<TradeData>(
          `/api/users/trades/${session.currentUserId}`
        );
        if (!data) {
          setLoading(false);
          throw new Error("Network Error");
        }
        if (data !== null) {
          const { cashBalance, equityBalance, fixedIncomeBal, id, trade } =
            data.userClient.account;
          setAccountBal({
            cashBalance,
            equityBalance,
            fixedIncomeBal,
          });
          setAccountId(id);
          setClientName(data.userClient.name);
          setDatabase(trade);
          setLoading(false);
          return trade;
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
    fetchData();
  }, [session.currentUserId, setLoading, setAccountId, render, setAccountBal]);

  const handleTradeInput = async (
    values: TradeProps,
    actions: FormikHelpers<TradeProps>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const { tradeDate, settlementDate, stockType, position, settlementAmt } =
        values;
      const tDate = new Date(tradeDate);
      const formatTradeDate = tDate.toISOString();
      const sDate = new Date(settlementDate);
      const formatSettlementData = sDate.toISOString();
      // checking against account balances
      const { cashBalance, equityBalance, fixedIncomeBal } = accountBal;
      if (position === "buy") {
        const newCashBalance = Number(cashBalance) - Number(settlementAmt);
        if (newCashBalance < 0) {
          setSuccess("Insufficient Cash to Buy");
        } else if (stockType === "equity") {
          const newEquityBalance =
            Number(equityBalance) + Number(settlementAmt);
          const { data } = await axios.put(
            `/api/accounts/${accountId}`,
            {
              cashBalance: newCashBalance,
              equityBalance: newEquityBalance,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          if (!data) {
            setSuccess("Network Error");
          } else {
            // Create
            const { data } = await axios.post(
              "/api/trades",
              {
                tradeDate: formatTradeDate,
                settlementDate: formatSettlementData,
                stockType,
                position,
                settlementAmt,
                custodyAccountId: accountId,
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
              setSuccess("Trade input successful");
              setRender(render + 1);
              actions.resetForm();
            }
            return data;
          }
        } else if (stockType === "fixedIncome") {
          const newFixedIncomeBal =
            Number(fixedIncomeBal) + Number(settlementAmt);
          const { data } = await axios.put(
            `/api/accounts/${accountId}`,
            {
              cashBalance: newCashBalance,
              fixedIncomeBal: newFixedIncomeBal,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          if (!data) {
            setSuccess("Network Error");
          } else {
            // Create
            const { data } = await axios.post(
              "/api/trades",
              {
                tradeDate: formatTradeDate,
                settlementDate: formatSettlementData,
                stockType,
                position,
                settlementAmt,
                custodyAccountId: accountId,
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
              setSuccess("Trade input successful");
              setRender(render + 1);
              actions.resetForm();
            }
            return data;
          }
        }
      } else if (position === "sell") {
        const newCashBalance = Number(cashBalance) + Number(settlementAmt);
        if (stockType === "equity") {
          const newEquityBalance =
            Number(equityBalance) - Number(settlementAmt);
          if (newEquityBalance < 0) {
            setSuccess("Insufficient Equity to Sell");
          }
          const { data } = await axios.put(
            `/api/accounts/${accountId}`,
            {
              cashBalance: newCashBalance,
              equityBalance: newEquityBalance,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          if (!data) {
            setSuccess("Network Error");
          } else {
            // Create
            const { data } = await axios.post(
              "/api/trades",
              {
                tradeDate: formatTradeDate,
                settlementDate: formatSettlementData,
                stockType,
                position,
                settlementAmt,
                custodyAccountId: accountId,
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
              setSuccess("Trade input successful");
              setRender(render + 1);
              actions.resetForm();
            }
            return data;
          }
        } else if (stockType === "fixedIncome") {
          const newFixedIncomeBal =
            Number(fixedIncomeBal) - Number(settlementAmt);
          if (newFixedIncomeBal < 0) {
            setSuccess("Insufficient Fixed Income to Sell");
          }
          const { data } = await axios.put(
            `/api/accounts/${accountId}`,
            {
              cashBalance: newCashBalance,
              fixedIncomeBal: newFixedIncomeBal,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          if (!data) {
            setSuccess("Network Error");
          } else {
            // Create
            const { data } = await axios.post(
              "/api/trades",
              {
                tradeDate: formatTradeDate,
                settlementDate: formatSettlementData,
                stockType,
                position,
                settlementAmt,
                custodyAccountId: accountId,
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
              setSuccess("Trade input successful");
              setRender(render + 1);
              actions.resetForm();
            }
            return data;
          }
        }
      }
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
            <Typography variant="h3">{clientName}</Typography>
            <br />
            <Box sx={{ height: "50vh", width: "100%" }}>
              <TradeTable database={database} />
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: "30%",
          // border: "solid 1px #121212",
          height: "60vh",
        }}
      >
        <Box>
          <Typography variant="h6">Trade Input</Typography>
          <Formik
            initialValues={{
              tradeDate: "",
              settlementDate: "",
              stockType: "",
              position: "",
              settlementAmt: 0,
            }}
            validationSchema={tradeInputSchema}
            onSubmit={handleTradeInput}
          >
            {({ isSubmitting }) => (
              <Form
                autoComplete="off"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // width: "80%",
                  height: "55vh",
                  // border: "solid 1px #121212",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    // my: 1,
                    // alignItems: "center",
                    height: "10vh",
                  }}
                >
                  <Typography variant="body2" sx={{ maxWidth: "40%" }}>
                    Trade Date:
                  </Typography>
                  <CustomInput
                    name="tradeDate"
                    type="date"
                    placeholder="Trade date"
                    style={{ width: "55%" }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    // my: 1,
                    // alignItems: "center",
                    height: "10vh",
                  }}
                >
                  <Typography variant="body2" sx={{ maxWidth: "40%" }}>
                    Settlement Date:
                  </Typography>
                  <CustomInput
                    name="settlementDate"
                    type="date"
                    placeholder="Settlement date"
                    style={{ width: "55%" }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    // my: 1,
                    // alignItems: "center",
                    height: "11vh",
                  }}
                >
                  <Typography variant="body2" sx={{ maxWidth: "40%" }}>
                    Equity/Fixed Income:
                  </Typography>
                  <CustomSelect
                    label="Select"
                    select={true}
                    name="stockType"
                    style={{ width: "55%" }}
                  >
                    <MenuItem value="equity">Equity</MenuItem>
                    <MenuItem value="fixedIncome">Fixed Income</MenuItem>
                  </CustomSelect>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    // my: 1,
                    // alignItems: "center",
                    height: "11vh",
                  }}
                >
                  <Typography variant="body2" sx={{ maxWidth: "40%" }}>
                    Buy/Sell:
                  </Typography>
                  <CustomSelect
                    label="Select"
                    select={true}
                    name="position"
                    style={{ width: "55%" }}
                  >
                    <MenuItem value="buy">Buy</MenuItem>
                    <MenuItem value="sell">Sell</MenuItem>
                  </CustomSelect>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    // my: 1,
                    // alignItems: "center",
                    height: "10vh",
                  }}
                >
                  <Typography variant="body2" sx={{ maxWidth: "40%" }}>
                    Settlement Amount:
                  </Typography>
                  <CustomInput
                    label="Nominal"
                    name="settlementAmt"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    style={{ width: "55%" }}
                  />
                </Box>
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  type="submit"
                  sx={{ height: "36px", width: "100px", my: 1 }}
                >
                  Submit
                </Button>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {success}
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default Trades;
