import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import AuthAPI from "../utils/AuthAPI";
import LoadingAPI from "../utils/LoadingAPI";
import MenuItem from "@mui/material/MenuItem";
import { Form, Formik, FormikValues } from "formik";
import CustomSelect from "./Formik/CustomSelect";
import axios from "axios";
import { TradeProps } from "./Trades";
import formatDate from "../utils/formatDate";
import caps1stSplitCamel from "../utils/caps1stSplitCamel";
import formatCurrency from "../utils/formatCurrency";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pie } from "react-chartjs-2";

export interface UserList {
  email: string;
  firstName: string;
  lastName: string;
  id?: string;
}

export interface Client extends FormikValues {
  id?: string;
  name: string;
  type: string;
  account: {
    cashBalance: number;
    equityBalance: number;
    fixedIncomeBal: number;
    trade: TradeProps[];
  };
  userList: UserList[];
}

const columns: GridColDef[] = [
  { field: "tradeDate", headerName: "Trade Date", minWidth: 120 },
  { field: "settlementDate", headerName: "Settlement Date", minWidth: 120 },
  { field: "position", headerName: "Buy/Sell", minWidth: 100 },
  { field: "stockType", headerName: "Equity/FixedIncome", minWidth: 150 },
  { field: "settlementAmt", headerName: "Settlement Amount", minWidth: 150 },
  { field: "id", headerName: "Trade ID", minWidth: 250, flex: 1 },
];

const columnsUser: GridColDef[] = [
  { field: "firstName", headerName: "First Name", minWidth: 100, flex: 1 },
  { field: "lastName", headerName: "Last Name", minWidth: 100, flex: 1 },
  { field: "email", headerName: "Email", minWidth: 185, flex: 1 },
];

const Clients = () => {
  const { session } = useContext(AuthAPI);
  const { loading, setLoading } = useContext(LoadingAPI);
  const [clientList, setClientList] = useState<Client[]>([]);
  const [loadClientList, setLoadClientList] = useState<boolean>(false);
  const [client, setClient] = useState<Client>({
    id: "",
    name: "",
    type: "",
    account: {
      cashBalance: 0,
      equityBalance: 0,
      fixedIncomeBal: 0,
      trade: [],
    },
    userList: [],
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setLoadClientList(true);
        const { data } = await axios.get<Client[]>(
          `/api/clients/all/${session.currentUserId}`
        );
        if (!data) {
          setLoadClientList(false);
          throw new Error("Network Error");
        }
        if (data !== null) {
          setClientList(data);
          setClient(data[0]);
          setLoadClientList(false);
          setLoading(false);
        }
        return data;
      } catch (error) {
        setLoadClientList(false);
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
    fetchClients();
  }, [session.currentUserId, setLoadClientList, setLoading]);

  const { cashBalance, equityBalance, fixedIncomeBal } = client.account;

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
    const mapDatabase = client.account.trade.map((trade) => {
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

  const rowsUser = () => {
    const mapDatabaseUser = client.userList.map((user, index) => {
      const { firstName, lastName, email } = user;

      const userRow = {
        firstName: caps1stSplitCamel(firstName),
        lastName: caps1stSplitCamel(lastName),
        email: email,
        id: index,
      };
      return userRow;
    });
    return mapDatabaseUser;
  };

  const clientListMap = clientList.map((option: Client) => {
    return (
      <MenuItem key={option.id} value={option.id}>
        {option.name}
      </MenuItem>
    );
  });

  const handleSelect = async (values: FormikValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      setLoading(true);
      const { data } = await axios.get<Client>(`/api/clients/${values.id}`);
      if (!data) {
        setLoading(false);
        throw new Error("Network Error");
      }
      if (data !== null) {
        setClient(data);
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
          <Typography variant="h3">{client.name}</Typography>
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
                    {Number(cashBalance) === 0 &&
                    Number(equityBalance) === 0 &&
                    Number(fixedIncomeBal) === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Typography variant="body1">No Data</Typography>
                      </Box>
                    ) : (
                      <Pie data={pieData} />
                    )}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "85%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5">Client List</Typography>
              </Box>
              <br />
              {loadClientList ? (
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
                <Formik
                  initialValues={{ id: client.id }}
                  onSubmit={handleSelect}
                >
                  {({ isSubmitting }) => (
                    <Form
                      autoComplete="off"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "60%",
                      }}
                    >
                      <CustomSelect label="Select" select={true} name="id">
                        {clientListMap}
                      </CustomSelect>
                      <br />
                      <Button
                        variant="contained"
                        disabled={isSubmitting}
                        type="submit"
                        sx={{ height: "36px", width: "110px" }}
                      >
                        Retrieve
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "50vh",
        }}
      >
        <Box sx={{ display: "flex", width: "70%" }}>
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
            <Box sx={{ height: "30vh", width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5">Trades Summary</Typography>
              </Box>
              <DataGrid
                rows={rows()}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                autoPageSize={true}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: "30%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "80%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5">User List</Typography>
              </Box>
              <br />
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
                <Box sx={{ height: "30vh", width: "100%" }}>
                  <DataGrid
                    rows={rowsUser()}
                    columns={columnsUser}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    autoPageSize={true}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Clients;
