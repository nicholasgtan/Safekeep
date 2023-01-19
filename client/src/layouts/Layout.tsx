import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div>
      <NavBar />
      <main style={{ top: "104" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
