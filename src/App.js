import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Display from "./pages/Display";
import GestionServices from "./pages/GestionServices";
import Sidebar from "./pages/SideBar";
import Navbar from "./pages/Navbar";
import axios from "axios";
import "./index.css";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;


const setCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]');
  if (token) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
  }
};


setCsrfToken();


const observer = new MutationObserver(setCsrfToken);
observer.observe(document.head, { childList: true });

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  if (!authChecked && location.pathname !== "/dashboard") {
    return <div>Loading...</div>;
  }

  if (
    !authenticated &&
    location.pathname !== "/reset-password" &&
    location.pathname !== "/display"
  ) {
    return <Login />;
  }

  if (location.pathname === "/reset-password") {
    return <ResetPassword />;
  }

  return (
    <div className={`flex ${darkMode ? "dark" : ""}`}>
      {!shouldHideSidebar && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          !shouldHideSidebar ? (isCollapsed ? "ml-16" : "ml-64") : ""
        } min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        {!shouldHideSidebar && (
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isCollapsed={isCollapsed}
          />
        )}

        <div
          className={`${
            !shouldHideSidebar ? "pt-20" : ""
          } p-6 overflow-y-auto h-screen`}
        >
          <Routes>
            <Route path="/produits" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<GestionServices />} />
            <Route path="/display" element={<Display />} />
            <Route path="*" element={<Navigate to="/produits" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
