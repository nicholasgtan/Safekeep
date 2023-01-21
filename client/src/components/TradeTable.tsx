import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import formatDate from "../utils/formatDate";
import { TradeData, TradeProps } from "./Trades";
import axios from "axios";
import AuthAPI from "../utils/AuthAPI";
import LoadingAPI from "../utils/LoadingAPI";
import capitaliseFirstLetter from "../utils/capitaliseFirstLetter";
import { CircularProgress, Typography } from "@mui/material";
import formatCurrency from "../utils/formatCurrency";

const columns: GridColDef[] = [
  { field: "tradeDate", headerName: "Trade Date", minWidth: 120 },
  { field: "settlementDate", headerName: "Settlement Date", minWidth: 120 },
  { field: "position", headerName: "Buy/Sell", minWidth: 100 },
  { field: "stockType", headerName: "Equity/FixedIncome", minWidth: 150 },
  { field: "settlementAmt", headerName: "Settlement Amount", minWidth: 150 },
  { field: "id", headerName: "Trade ID", minWidth: 250, flex: 1 },
];

export default function TradeTable() {
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
          setLoading(false);
          setClientName(data.userClient.name);
          const { trade } = data.userClient.account;
          // if (data.userClient.accountRep.id !== session.currentUserId) {\
          setDatabase(trade);
          //   render + 1;
          // }
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
  }, [session.currentUserId, setLoading]);

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
        position: capitaliseFirstLetter(position),
        stockType: capitaliseFirstLetter(stockType),
        settlementAmt: formatCurrency(settlementAmt),
        id: id,
      };
      return tradeRow;
    });
    return mapDatabase;
  };

  return (
    <>
      {loading ? (
        <Box sx={{ alignSelf: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: "90%" }}>
          <Typography variant="h3">{clientName}</Typography>
          <br />
          <Box sx={{ height: "60vh", width: "100%" }}>
            <DataGrid
              rows={rows()}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
