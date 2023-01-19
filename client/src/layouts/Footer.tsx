import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography
      variant="caption"
      sx={{ color: "primary.main", mx: 1, my: 4, fontSize: 14 }}
    >
      {"© "}
      {new Date().getFullYear() + " "}
      Safekeep
    </Typography>
  );
}

export default function AppFooter() {
  return (
    <Paper
      component="footer"
      elevation={4}
      sx={{
        bgcolor: "secondary.main",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          component: "ul",
          m: 0,
          listStyle: "none",
          p: 0,
          display: "flex",
        }}
      >
        <Box sx={{ component: "li", mx: 1, my: 4, display: "inline" }}>
          <Link variant="body2" color="primary.main" href="">
            About Us
          </Link>
        </Box>
        <Box sx={{ component: "li", mx: 1, my: 4, display: "inline" }}>
          <Link variant="body2" color="primary.main" href="">
            Contact
          </Link>
        </Box>
        <Box sx={{ component: "li", mx: 1, my: 4, display: "inline" }}>
          <Link variant="body2" color="primary.main" href="">
            Help Centre
          </Link>
        </Box>
      </Box>
      <Copyright />
    </Paper>
  );
}
