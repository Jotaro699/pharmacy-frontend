import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode, isCollapsed }) => {
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav
      className={`fixed top-0 z-40 ${
        isCollapsed ? "left-16" : "left-64"
      } right-0 bg-white dark:bg-gray-900 shadow px-6 py-4 transition-all duration-300`}
    >
      {" "}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="overflow-hidden w-[500px] md:w-[1000px]">
          <p className="whitespace-nowrap animate-scrollText text-blue-700 dark:text-blue-300 font-semibold text-sm text-center">
            Système de gestion parapharmaceutique
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
