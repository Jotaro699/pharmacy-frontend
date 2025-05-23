// // import React from "react";
// // import { Routes, Route, Navigate } from "react-router-dom";
// // import Login from "./pages/Login";
// // import Dashboard from "./pages/Dashboard";

// // function App() {
// //   const token = localStorage.getItem("token");

// //   return (
// //     <Routes>
// //       {/* إذا ما كانش token، خليه يدير login */}
// //       <Route
// //         path="/"
// //         element={!token ? <Login /> : <Navigate to="/dashboard" />}
// //       />

// //       {/* إذا ما كانش token، ما يدخلش للداشبورد */}
// //       <Route
// //         path="/dashboard"
// //         element={token ? <Dashboard /> : <Navigate to="/" />}
// //       />
// //     </Routes>
// //   );
// // }

// // export default App;

// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Display from "./pages/Display";
// import axios from "axios";

// function App() {
//   const [authChecked, setAuthChecked] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/api/user", { withCredentials: true })
//       .then(() => setAuthenticated(true))
//       .catch(() => setAuthenticated(false))
//       .finally(() => setAuthChecked(true));
//   }, []);

//   if (!authChecked) return <div>Loading...</div>;

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={!authenticated ? <Login /> : <Navigate to="/dashboard" />}
//       />
//       <Route
//         path="/dashboard"
//         element={authenticated ? <Dashboard /> : <Navigate to="/" />}
//       />
//       <Route path="/display" element={<Display />} />
//     </Routes>
//   );
// }

// export default App;
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import "./index.css";
import ResetPassword from "./pages/ResetPassword"; // selon dossier dyalek
import Dashboard from "./pages/Dashboard";
import Display from "./pages/Display";
import GestionServices from "./pages/GestionServices";
import Sidebar from "./pages/SideBar";
import Navbar from "./pages/Navbar";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const location = useLocation();
  const hideSidebarRoutes = ["/display"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  useEffect(() => {
    axios
      .get("/api/user")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (!authChecked && location.pathname !== "/produits") {
    return <div>Loading...</div>;
  }
    // if (!authenticated) return <Login />;

  return (
    <div className={`flex ${darkMode ? "dark" : ""}`}>
      {!shouldHideSidebar && (
        <div className="flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <Sidebar />
        </div>
      )}

      <div
        className={`${
          !shouldHideSidebar ? "ml-64" : ""
        } flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        {!shouldHideSidebar && (
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        )}

        <div className={`p-4 ${!shouldHideSidebar ? "pt-20" : ""}`}>
          <Routes>
            <Route path="/produits" element={<Dashboard />} />
            <Route path="/services" element={<GestionServices />} />
            <Route path="/display" element={<Display />} />
            <Route path="*" element={<Navigate to="/produits" />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;