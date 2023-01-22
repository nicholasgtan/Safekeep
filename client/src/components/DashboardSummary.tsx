import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { TradeData, TradeProps } from "./Trades";
import AuthAPI from "../utils/AuthAPI";
import LoadingAPI from "../utils/LoadingAPI";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import formatDate from "../utils/formatDate";
import caps1stSplitCamel from "../utils/caps1stSplitCamel";
import formatCurrency from "../utils/formatCurrency";
import { NavLink } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import Access from "./Access";

const columns: GridColDef[] = [
  { field: "tradeDate", headerName: "Trade Date", minWidth: 120 },
  { field: "settlementDate", headerName: "Settlement Date", minWidth: 120 },
  { field: "position", headerName: "Buy/Sell", minWidth: 100 },
  { field: "stockType", headerName: "Equity/FixedIncome", minWidth: 150 },
  { field: "settlementAmt", headerName: "Settlement Amount", minWidth: 150 },
  { field: "id", headerName: "Trade ID", minWidth: 250, flex: 1 },
];

const DashboardSummary = () => {
  const [accountId, setAccountId] = useState("");
  const [database, setDatabase] = useState<TradeProps[]>([]);
  const { session } = useContext(AuthAPI);
  const { loading, setLoading } = useContext(LoadingAPI);
  const [clientName, setClientName] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    cashBalance: 0,
    equityBalance: 0,
    fixedIncomeBal: 0,
  });
  const [accountRep, setAccountRep] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

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
          const { id, trade } = data.userClient.account;
          setAccountId(id);
          setAccountDetails(data.userClient.account);
          setClientName(data.userClient.name);
          setAccountRep(data.userClient.accountRep);
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
  }, [session.currentUserId, setLoading, setAccountId]);

  const { cashBalance, equityBalance, fixedIncomeBal } = accountDetails;

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

  const rows = () => {
    const mapDatabase = database.map((trade) => {
      const {
        tradeDate,
        settlementDate,
        position,
        stockType,
        settlementAmt,
        id,
      } = trade;

      const tradeRow = {
        tradeDate: formatDate(tradeDate),
        settlementDate: formatDate(settlementDate),
        position: caps1stSplitCamel(position),
        stockType: caps1stSplitCamel(stockType),
        settlementAmt: formatCurrency(settlementAmt),
        id: id,
      };
      return tradeRow;
    });
    return mapDatabase;
  };

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
          <Typography variant="h3">{clientName}</Typography>
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
                    <Pie data={pieData} />
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
                    href={`mailto:${accountRep.email}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Button variant="contained">Contact</Button>
                  </a>
                </Box>
                <br />
                <Typography variant="h6">
                  Name: {caps1stSplitCamel(accountRep.firstName)}{" "}
                  {caps1stSplitCamel(accountRep.lastName)}
                </Typography>
                <Typography variant="h6">Email: {accountRep.email}</Typography>
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
            <DataGrid
              rows={rows()}
              columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              autoPageSize={true}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardSummary;
