import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { TradeProps } from "./Trades";
import AuthAPI from "../utils/AuthAPI";
import LoadingAPI from "../utils/LoadingAPI";
import axios from "axios";
import caps1stSplitCamel from "../utils/caps1stSplitCamel";
import formatCurrency from "../utils/formatCurrency";
import PieChart from "./PieChart";
import TradeTable from "./TradeTable";

interface DashboardData {
  userClient: {
    name: string;
    accountRep: {
      email: string;
      firstName: string;
      lastName: string;
    };
    account: {
      id: string;
      cashBalance: number;
      equityBalance: number;
      fixedIncomeBal: number;
      trade: TradeProps[];
    };
  };
}

const DashboardSummary = () => {
  const { session } = useContext(AuthAPI);
  const { loading, setLoading } = useContext(LoadingAPI);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    userClient: {
      name: "",
      accountRep: {
        email: "",
        firstName: "",
        lastName: "",
      },
      account: {
        id: "",
        cashBalance: 0,
        equityBalance: 0,
        fixedIncomeBal: 0,
        trade: [],
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<DashboardData>(
          `/api/users/dashboard/${session.currentUserId}`
        );
        if (!data) {
          setLoading(false);
          throw new Error("Network Error");
        }
        if (data !== null) {
          setDashboardData(data);
          setLoading(false);
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
    fetchData();
  }, [session.currentUserId, setLoading]);

  const { cashBalance, equityBalance, fixedIncomeBal } =
    dashboardData.userClient.account;

  const totalNav =
    Number(cashBalance) + Number(equityBalance) + Number(fixedIncomeBal);

  return (
    <Box
      sx={{
        display: "flex",
        height: "67vh",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Box>
          <Typography variant="h3">Retrieving...</Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h3">{dashboardData.userClient.name}</Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          height: "50vh",
          gap: "2rem",
        }}
      >
        <Box
          sx={{
            width: "70%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              // border: "solid 1px #121212",
              display: "flex",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignSelf: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",

                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="h5">Account Summary</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                  <Box
                    sx={{ position: "relative", width: "10vw", height: "20vh" }}
                  >
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
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="h6">Cash Balance:</Typography>
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
                      <Typography variant="h6">Equity Balance:</Typography>
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
                      <Typography variant="h6">
                        Fixed Income Balance:
                      </Typography>
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
        </Box>
        <Box
          sx={{
            width: "30%",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "70%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5">Account Manager</Typography>
                  <a
                    href={`mailto:${dashboardData.userClient.accountRep.email}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Button variant="contained">Contact</Button>
                  </a>
                </Box>
                <br />
                <Typography variant="h6">
                  Name:{" "}
                  {caps1stSplitCamel(
                    dashboardData.userClient.accountRep.firstName
                  )}{" "}
                  {caps1stSplitCamel(
                    dashboardData.userClient.accountRep.lastName
                  )}
                </Typography>
                <Typography variant="h6">
                  Email: {dashboardData.userClient.accountRep.email}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          // width: "30%",
          display: "flex",
          height: "50vh",
          // justifyContent: "center",
          // alignItems: "center",
          // border: "solid 1px #121212",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "68.5%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: "30vh", width: "68.5%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5">Trades Summary</Typography>
            </Box>
            <TradeTable database={dashboardData.userClient.account.trade} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardSummary;
