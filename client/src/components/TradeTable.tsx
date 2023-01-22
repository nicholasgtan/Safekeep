import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import formatDate from "../utils/formatDate";
import { AccountBalance, TradeData, TradeProps } from "./Trades";
import axios from "axios";
import AuthAPI from "../utils/AuthAPI";
import LoadingAPI from "../utils/LoadingAPI";
import caps1stSplitCamel from "../utils/caps1stSplitCamel";
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

interface TradesPageProps {
  setAccountId: Dispatch<SetStateAction<string>>;
  setAccountBal: Dispatch<SetStateAction<AccountBalance>>;
  render: number;
}

export default function TradeTable({
  setAccountId,
  render,
  setAccountBal,
}: TradesPageProps) {
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
          const { cashBalance, equityBalance, fixedIncomeBal, id, trade } =
            data.userClient.account;
          setAccountBal({
            cashBalance,
            equityBalance,
            fixedIncomeBal,
          });
          setAccountId(id);
          setClientName(data.userClient.name);
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
  }, [session.currentUserId, setLoading, setAccountId, render, setAccountBal]);

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
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              autoPageSize={true}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
