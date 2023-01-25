import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TradeProps } from "./Trades";
import caps1stSplitCamel from "../utils/caps1stSplitCamel";
import formatCurrency from "../utils/formatCurrency";
import formatDate from "../utils/formatDate";

const columns: GridColDef[] = [
  { field: "tradeDate", headerName: "Trade Date", minWidth: 120 },
  { field: "settlementDate", headerName: "Settlement Date", minWidth: 120 },
  { field: "position", headerName: "Buy/Sell", minWidth: 100 },
  { field: "stockType", headerName: "Equity/FixedIncome", minWidth: 150 },
  { field: "settlementAmt", headerName: "Settlement Amount", minWidth: 150 },
  { field: "id", headerName: "Trade ID", minWidth: 250, flex: 1 },
];

interface TradeTableProps {
  database: TradeProps[];
}

export default function TradeTable({ database }: TradeTableProps) {
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
    </>
  );
}
