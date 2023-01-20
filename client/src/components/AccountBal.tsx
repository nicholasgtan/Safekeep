import { useContext, useEffect, useState } from "react";
import AuthAPI from "../utils/AuthAPI";
import axios from "axios";
import Typography from "@mui/material/Typography";
import LoadingAPI from "../utils/LoadingAPI";
import Box from "@mui/material/Box/Box";
import { CircularProgress } from "@mui/material";
import formatCurrency from "../utils/FormatCurrency";

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

  return (
    <Box sx={{ display: "flex", height: "68vh", gap: "2rem" }}>
      <Box
        sx={{
          width: "70%",
          border: "solid 1px #121212",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            <Typography variant="h4">
              {accountDetails.userClient.name}
            </Typography>
            <br />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 15,
                }}
              >
                <Typography>Cash Balance:</Typography>
                <Typography>${formatCurrency(cashBalance)}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 15,
                }}
              >
                <Typography>Equity Balance:</Typography>
                <Typography>${formatCurrency(equityBalance)}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 15,
                }}
              >
                <Typography>Fixed Income Balance:</Typography>
                <Typography>${formatCurrency(fixedIncomeBal)}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 15,
                }}
              >
                <Typography>Total NAV:</Typography>
                <Typography>${formatCurrency(totalNav)}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ width: "30%", border: "solid 1px #121212" }}>Deposit Cash</Box>
    </Box>
  );
};

export default AccountBal;
