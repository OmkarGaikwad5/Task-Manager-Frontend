import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to logout");
      console.error(err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold text-gray-900 transition-transform duration-300 hover:scale-105 hover:text-primary"
        >
          🗂️ Task Manager
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user && <Badge className="font-semibold text-sm">Hi, {user.name}</Badge>}
          {user ? (
            <Button
              variant="destructive"
              className="rounded-lg px-4 py-2 shadow hover:shadow-md transition-all duration-300"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button
                className="rounded-lg px-4 py-2 shadow hover:shadow-md transition-all duration-300"
                onClick={() => toast("Redirecting to login...")}
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 hover:text-primary focus:outline-none"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-md animate-fadeIn">
          <div className="flex flex-col gap-3 p-4 text-center">
            {user && (
              <Badge className="w-full flex justify-center font-semibold text-sm">
                Hi, {user.name}
              </Badge>
            )}
            {user ? (
              <Button
                variant="destructive"
                className="w-full rounded-lg px-4 py-2 shadow hover:shadow-md transition-all duration-300"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" className="w-full">
                <Button
                  className="w-full rounded-lg px-4 py-2 shadow hover:shadow-md transition-all duration-300"
                  onClick={() => toast("Redirecting to login...")}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
