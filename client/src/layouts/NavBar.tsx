import { useState } from "react";
import Login from "../components/Login";
import axios from "axios";
import { Typography, Button, AppBar, Toolbar, Box } from "@mui/material";
import { useContext } from "react";
import AuthAPI from "../utils/AuthAPI";

const NavBar = () => {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { session, setSession } = useContext(AuthAPI);

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
    <AppBar color="secondary" sx={{ display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontSize: 24 }}>
          Safekeep💰
        </Typography>
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
            >
              {loading ? <>Loading...</> : <>Logout</>}
            </Button>
          )}
        </div>
      </Toolbar>
      <Box
        sx={{
          textAlign: "end",
          marginTop: "0.5rem",
          marginRight: "0.5rem",
          height: "2rem",
        }}
      >
        {status}
      </Box>
    </AppBar>
  );
};

export default NavBar;
