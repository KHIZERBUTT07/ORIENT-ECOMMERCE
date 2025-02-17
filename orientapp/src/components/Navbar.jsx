import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <NavLink to="/" className="text-xl font-bold text-red-600">
          ORIENT
        </NavLink>

        <div className="space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-red-500 ${isActive ? "text-red-500 font-bold" : "text-black"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `hover:text-red-500 ${isActive ? "text-red-500 font-bold" : "text-black"}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-red-500 ${isActive ? "text-red-500 font-bold" : "text-black"}`
            }
          >
            Who We Are
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-red-500 ${isActive ? "text-red-500 font-bold" : "text-black"}`
            }
          >
            Contact
          </NavLink>
        </div>

        <div className="space-x-4">
          <NavLink to="/cart" className="relative">
            🛒 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
