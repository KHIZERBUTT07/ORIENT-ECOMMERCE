import React from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img src="/images/orientlogo.jpg" alt="Orient Logo" className="h-10 w-auto" />
        </NavLink>

        {/* Navigation Links */}
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

        {/* Search Bar & Cart */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-full px-4 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500">
              <FaSearch />
            </button>
          </div>

          {/* Cart */}
          <NavLink to="/cart" className="relative text-xl text-black hover:text-red-500">
            <FaShoppingCart />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              2
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
