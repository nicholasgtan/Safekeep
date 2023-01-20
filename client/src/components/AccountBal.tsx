import { useContext, useEffect, useState } from "react";
import AuthAPI from "../utils/AuthAPI";
import axios from "axios";
import Typography from "@mui/material/Typography";
import LoadingAPI from "../utils/LoadingAPI";

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

  return (
    <div>
      <Typography>
        Cash Balance:{" "}
        {loading ? "Loading..." : accountDetails.userClient.account.cashBalance}
      </Typography>
      <Typography>
        Equity Balance:{" "}
        {loading
          ? "Loading..."
          : accountDetails.userClient.account.equityBalance}
      </Typography>
      <Typography>
        FixedIncome Balance:{" "}
        {loading
          ? "Loading..."
          : accountDetails.userClient.account.fixedIncomeBal}
      </Typography>
    </div>
  );
};

export default AccountBal;
