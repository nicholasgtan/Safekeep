import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Layout from "./layouts/Layout";
import AuthAPI from "./utils/AuthAPI";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./utils/PrivateRoutes";
import AccountBal from "./components/AccountBal";
import DashboardSummary from "./components/DashboardSummary";
import Trades from "./components/Trades";
import Clients from "./components/Clients";
import Access from "./components/Access";

function App() {
  interface SessionData {
    cookie?: unknown;
    authenticated: boolean;
    currentUserId: string;
    currentUserName: string;
    role: string;
    msg: string;
  }

  const [session, setSession] = useState<SessionData>({
    authenticated: false,
    currentUserId: "",
    currentUserName: "",
    role: "",
    msg: "",
  });

  // console.log(session);

  return (
    <AuthAPI.Provider value={{ session, setSession }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="/dashboard" element={<DashboardSummary />} />
                <Route path="/dashboard/account" element={<AccountBal />} />
                <Route path="/dashboard/trades" element={<Trades />} />
                <Route path="/dashboard/clients" element={<Clients />} />
                <Route path="/dashboard/access" element={<Access />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthAPI.Provider>
  );
}

export default App;
