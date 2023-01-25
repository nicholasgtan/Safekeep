import { Box, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";

interface PieProps {
  cashBalance: number;
  equityBalance: number;
  fixedIncomeBal: number;
}

const PieChart = ({ cashBalance, equityBalance, fixedIncomeBal }: PieProps) => {
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

  return (
    <>
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
    </>
  );
};

export default PieChart;
