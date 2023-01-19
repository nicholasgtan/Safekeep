import { useContext, useEffect, useState } from "react";
import AuthAPI from "../utils/AuthAPI";
import axios from "axios";
import Typography from "@mui/material/Typography";

const AccountBal = () => {
  const { session } = useContext(AuthAPI);
  const [accountDetails, setAccountDetails] = useState<AccountData>({
    email: "",
    firstName: "",
    lastName: "",
    userClient: {
      name: "",
      accountRep: {
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const response = await axios.get<AccountData>(
          `/api/user/account/${session.currentUserId}`
        );
        if (!response) {
          throw new Error("Network Error");
        }
        if (response !== null) {
          //   setAccountDetails(response);
          console.log(response);
          return response;
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
    fetchAccount();
  }, [accountDetails, session.currentUserId]);

  return (
    <div>
      <Typography>
        Cash Balance: {accountDetails.userClient.account.cashBalance}
      </Typography>
      <Typography>
        Equity Balance: {accountDetails.userClient.account.equityBalance}
      </Typography>
      <Typography>
        FixedIncome Balance: {accountDetails.userClient.account.fixedIncomeBal}
      </Typography>
    </div>
  );
};

export default AccountBal;
