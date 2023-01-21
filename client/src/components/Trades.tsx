import { useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box/Box";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import CustomInput from "./Formik/CustomInput";
import Button from "@mui/material/Button";
import { tradeInputSchema } from "./Formik/yup.schema";
import TradeTable from "./TradeTable";
import CustomSelect from "./Formik/CustomSelect";
import MenuItem from "@mui/material/MenuItem";

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

const Trades = () => {
  const [render, setRender] = useState(1);
  const [success, setSuccess] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accountBal, setAccountBal] = useState<AccountBalance>({});
  console.log(accountBal);

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
    <Box sx={{ display: "flex", height: "68vh", gap: "2rem" }}>
      <Box
        sx={{
          width: "70%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TradeTable
          setAccountId={setAccountId}
          render={render}
          setAccountBal={setAccountBal}
        />
      </Box>
      <Box
        sx={{
          width: "30%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5">Trade Input</Typography>
          <br />
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
                  width: "60%",
                  height: "60vh",
                }}
              >
                <Typography sx={{ mb: 1 }}>Trade Date:</Typography>
                <CustomInput
                  name="tradeDate"
                  type="date"
                  placeholder="Trade date"
                />
                <br />
                <Typography sx={{ mb: 1 }}>Settlement Date:</Typography>
                <CustomInput
                  name="settlementDate"
                  type="date"
                  placeholder="Settlement date"
                />
                <br />
                <Typography sx={{ mb: 1 }}>Equity/Fixed Income:</Typography>
                <CustomSelect label="Select" select={true} name="stockType">
                  <MenuItem value="equity">Equity</MenuItem>
                  <MenuItem value="fixedIncome">Fixed Income</MenuItem>
                </CustomSelect>
                <br />
                <Typography sx={{ mb: 1 }}>Buy/Sell:</Typography>
                <CustomSelect label="Select" select={true} name="position">
                  <MenuItem value="buy">Buy</MenuItem>
                  <MenuItem value="sell">Sell</MenuItem>
                </CustomSelect>
                <br />
                <Typography sx={{ mb: 1 }}>Settlement Amount:</Typography>
                <CustomInput
                  label="Nominal"
                  name="settlementAmt"
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
