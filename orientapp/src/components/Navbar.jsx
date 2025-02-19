import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import logo from "/images/logo.png";

const Navbar = ({ cartCount, setIsCartOpen }) => {
  const location = useLocation();
  const [localCartCount, setLocalCartCount] = useState(cartCount);

  useEffect(() => {
    setLocalCartCount(cartCount);
  }, [cartCount]);

  const isActive = (path) => (location.pathname === path ? "text-red-500 font-bold" : "text-black hover:text-red-500");

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/">
          <img src={logo} alt="Orient Appliances" className="h-10" />
        </Link>

        <div className="space-x-6">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/shop" className={isActive("/shop")}>Products</Link>
          <Link to="/about" className={isActive("/about")}>Who We Are</Link>
          <Link to="/contact" className={isActive("/contact")}>Contact</Link>
        </div>

        <div className="flex space-x-4 items-center">
          <input type="text" placeholder="Search..." className="border rounded-lg px-4 py-2 focus:ring focus:ring-red-300" />
          <button className="text-red-600 hover:text-red-800">
            <FaSearch />
          </button>

          {/* ✅ Clicking this opens the sidebar */}
          <button onClick={() => setIsCartOpen(true)} className="relative text-red-600 hover:text-red-800">
            <FaShoppingCart className="text-2xl" />
            {localCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {localCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
