import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Boxes,
  HeartPulse,
  Monitor,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import axios from "axios";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navItems = [
    { name: "Produits", icon: <Boxes size={20} />, path: "/produits" },
    { name: "Services", icon: <HeartPulse size={20} />, path: "/services" },
    { name: "Display", icon: <Monitor size={20} />, path: "/display" },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      await axios.post(
        "http://localhost:8000/logout",
        {},
        {
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1] || ""
            ),
          },
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");

      // ✅ Redirect and force refresh
      navigate("/", { replace: true });
      window.location.reload(); // force reload to clear state/auth
    } catch (err) {
      console.error("Erreur de déconnexion:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!isCollapsed && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 border-r border-slate-200 dark:border-gray-700 shadow-xl flex flex-col justify-between z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="relative">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-10"
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>

          <div className="p-4">
            <div
              className={`flex items-center gap-3 mb-8 transition-all duration-300 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={require("../assets/logo2.jpg")}
                  alt="Logo"
                  className="h-10 w-10 rounded-lg object-cover shadow-lg"
                />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    M3A PHARMA
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Dashboard
                  </p>
                </div>
              )}
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700/50 hover:scale-[1.02]"
                      } ${isCollapsed ? "justify-center" : ""}`}
                    >
                      <div
                        className={`transition-transform duration-200 ${
                          isActive ? "scale-110" : "group-hover:scale-105"
                        }`}
                      >
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                      {isActive && (
                        <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </Link>
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        {item.name}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
          <div className="relative group">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
    ${isCollapsed ? "justify-center" : ""}
    bg-gradient-to-r from-red-500 to-red-600 text-white
    hover:from-red-600 hover:to-red-700
    shadow-md hover:shadow-lg
    disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div
                className={`transition-transform duration-200 ${
                  isLoading ? "animate-spin" : "group-hover:scale-105"
                }`}
              >
                <LogOut size={20} />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium">
                  {isLoading ? "Déconnexion..." : "Déconnexion"}
                </span>
              )}
            </button>
            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Déconnexion
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
