import { useState } from "react";
import Login from "./Login";

const NavBar = () => {
  const [status, setStatus] = useState("");

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>Logo</div>
        <div style={{display:"flex"}}>
        <Login setStatus={setStatus} />
        <button>Logout</button>
        </div>
      </div>
      <div style={{alignSelf: "end", marginTop: "0.5rem", marginRight: "0.5rem"}}>
        {status}
      </div>
    </div>
  );
};

export default NavBar;
