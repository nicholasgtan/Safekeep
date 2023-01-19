import { useState, useContext } from "react";
import Login from "../components/Login";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AuthAPI from "../utils/AuthAPI";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../components/material-ui/LogoIcon";

const NavBar = () => {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { session, setSession } = useContext(AuthAPI);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/session", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response) {
        setLoading(false);
        setSession({
          authenticated: false,
          currentUserId: "",
          currentUserName: "",
          role: "",
          msg: "",
        });
        setStatus("You are now logged out.");
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        // console.log("error message: ", error.response?.data.msg);
        setStatus(error.response?.data.msg);
        // 👇️ error: AxiosError<any, any>
        return error.message;
      } else {
        // console.log("unexpected error: ", error);
        setStatus("An unexpected error occurred");
        return "An unexpected error occurred";
      }
    }
  };

  return (
    <AppBar
      color="secondary"
      position="sticky"
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Paper>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <LogoIcon
              color="inherit"
              viewBox="0 0 120 120"
              sx={{ height: "49px", width: "49px" }}
            />
            <Typography variant="h3" sx={{ mt: 1 }}>
              Safekeep
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "0.2rem" }}>
            {session.authenticated === false ? (
              <Login
                setStatus={setStatus}
                loading={loading}
                setLoading={setLoading}
              />
            ) : (
              <Button
                variant="contained"
                onClick={handleLogout}
                disabled={loading}
                sx={{ height: "36px" }}
              >
                {loading ? <>Loading...</> : <>Logout</>}
              </Button>
            )}
          </div>
        </Toolbar>
        <Box
          sx={{
            backgroundColor: "#121212",
            textAlign: "end",
            marginTop: "0.5rem",
            height: "2rem",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#fff", paddingTop: "0.3rem", paddingRight: "1.3rem" }}
          >
            {status}
          </Typography>
        </Box>
      </Paper>
    </AppBar>
  );
};

export default NavBar;
