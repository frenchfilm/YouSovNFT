import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="flex justify-between items-center h-16 bg-white/30 text-black relative shadow-lg font-mono backdrop-blur-md border border-gray-200 rounded-lg"
      role="navigation"
    >
      <div className="flex items-center space-x-4 pr-8 md:block">
        <Link
          className={`p-4 bg-white/50 rounded hover:bg-white/70 transition duration-300 ${
            isActive("/") ? "underline" : ""
          }`}
          to="/"
        >
          Minting Form
        </Link>
        <Link
          className={`p-4 bg-white/50 rounded hover:bg-white/70 transition duration-300 ${
            isActive("/deployments") ? "underline" : ""
          }`}
          to="/deployments"
        >
          Deployments
        </Link>
        <Link
          className={`p-4 bg-white/50 rounded hover:bg-white/70 transition duration-300 ${
            isActive("/mint") ? "underline" : ""
          }`}
          to="/mint"
        >
          Public Mint
        </Link>
        <button className="p-4">
          <ConnectButton />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
