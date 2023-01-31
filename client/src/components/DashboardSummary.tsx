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
        gap: "1rem",
        flexDirection: "column",
        // border: "solid 1px #121212",
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
          // height: "45vh",
        }}
      >
        <Box
          sx={{
            width: "35vw",
            // border: "solid 1px #121212",
            display: "flex",
            // justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "35vh",
              // border: "solid 1px #121212",
              display: "flex",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: "column",
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
                  }}
                >
                  <Typography variant="h6">Account Summary</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    // border: "solid 1px #121212",
                  }}
                >
                  <Box
                    sx={{
                      width: "90%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      // border: "solid 1px #121212",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1">Cash:</Typography>
                      <br />
                      <Typography variant="body1">
                        ${formatCurrency(cashBalance)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1">Equity:</Typography>
                      <Typography variant="body1">
                        ${formatCurrency(equityBalance)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1">Fixed Income:</Typography>
                      <Typography variant="body1">
                        ${formatCurrency(fixedIncomeBal)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1">Total NAV:</Typography>
                      <Typography variant="body1">
                        ${formatCurrency(totalNav)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{ position: "relative", width: "25vw", height: "25vh" }}
                  >
                    <PieChart
                      cashBalance={cashBalance}
                      equityBalance={equityBalance}
                      fixedIncomeBal={fixedIncomeBal}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              // flexDirection: "row",
              // height: "1vh",
              // justifyContent: "center",
              // alignItems: "center",
              // border: "solid 1px #121212",
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
                  flexDirection: "column",
                  // border: "solid 1px #121212",
                  width: "95%",
                  // justifyContent: "space-around",
                }}
              >
                <Typography variant="h6">Account Manager</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    Name:{" "}
                    {caps1stSplitCamel(
                      dashboardData.userClient.accountRep.firstName
                    )}{" "}
                    {caps1stSplitCamel(
                      dashboardData.userClient.accountRep.lastName
                    )}
                  </Typography>
                  <Typography variant="body2">
                    Email: {dashboardData.userClient.accountRep.email}
                  </Typography>
                  <a
                    href={`mailto:${dashboardData.userClient.accountRep.email}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Button variant="contained">Contact</Button>
                  </a>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                height: "40vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: "49vh" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Trades Summary</Typography>
              </Box>
              <TradeTable database={dashboardData.userClient.account.trade} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardSummary;
