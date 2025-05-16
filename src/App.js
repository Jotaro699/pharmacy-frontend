// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <Routes>
//       {/* إذا ما كانش token، خليه يدير login */}
//       <Route
//         path="/"
//         element={!token ? <Login /> : <Navigate to="/dashboard" />}
//       />

//       {/* إذا ما كانش token، ما يدخلش للداشبورد */}
//       <Route
//         path="/dashboard"
//         element={token ? <Dashboard /> : <Navigate to="/" />}
//       />
//     </Routes>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Display from "./pages/Display";
import axios from "axios";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={!authenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={authenticated ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route path="/display" element={<Display />} />
    </Routes>
  );
}

export default App;
