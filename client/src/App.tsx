import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<div>Home</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
