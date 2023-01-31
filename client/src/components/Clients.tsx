import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import AuthAPI from "../utils/AuthAPI";
import LoadingAPI from "../utils/LoadingAPI";
import MenuItem from "@mui/material/MenuItem";
import { Form, Formik, FormikValues } from "formik";
import CustomSelect from "./Formik/CustomSelect";
import axios from "axios";
import { TradeProps } from "./Trades";
import caps1stSplitCamel from "../utils/caps1stSplitCamel";
import formatCurrency from "../utils/formatCurrency";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PieChart from "./PieChart";
import TradeTable from "./TradeTable";

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
        height: "65vh",
        // gap: "1rem",
        flexDirection: "column",
        // border: "solid 1px #121212",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
            width: "40%",
            // border: "solid 1px #121212",
            // display: "flex",
          }}
        >
          <Box
            sx={{
              my: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                        // flexDirection: "column",
                        width: "100%",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <CustomSelect
                        label="Client List"
                        select={true}
                        name="id"
                        style={{ width: "70%" }}
                      >
                        {clientListMap}
                      </CustomSelect>

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
          height: "65vh",
          gap: "1rem",
          // border: "solid 1px #121212",
          // width: "30%",
        }}
      >
        <Box
          sx={{
            width: "25%",
            display: "flex",
            // justifyContent: "space-between",
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
                    // justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="h5">Account Summary</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Box
                    sx={{ position: "relative", width: "20vw", height: "30vh" }}
                  >
                    <PieChart
                      cashBalance={cashBalance}
                      equityBalance={equityBalance}
                      fixedIncomeBal={fixedIncomeBal}
                    />
                  </Box>
                  <Box
                    sx={{
                      // width: "35%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      my: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2">Cash:</Typography>
                      <br />
                      <Typography variant="body2">
                        ${formatCurrency(cashBalance)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2">Equity:</Typography>
                      <Typography variant="body2">
                        ${formatCurrency(equityBalance)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2">Fixed Income:</Typography>
                      <Typography variant="body2">
                        ${formatCurrency(fixedIncomeBal)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2">Total NAV:</Typography>
                      <Typography variant="body2">
                        ${formatCurrency(totalNav)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        {/* </Box>
      <Box
        sx={{
          display: "flex",
          height: "50vh",
        }}
      > */}
        <Box sx={{ display: "flex", width: "50%" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // width: "68.5%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: "50vh", width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5">Trades Summary</Typography>
              </Box>
              <TradeTable database={client.account.trade} />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: "25%",
            display: "flex",
            // border: "solid 1px #121212",
          }}
        >
          <Box
            sx={{
              display: "flex",
              // justifyContent: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {/* <Box sx={{ width: "100%" }}> */}
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ height: "50vh" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5">User List</Typography>
                </Box>
                <DataGrid
                  rows={rowsUser()}
                  columns={columnsUser}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  autoPageSize={true}
                />
              </Box>
            )}
            {/* </Box> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Clients;
