import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import logo from "/images/logo.png";
import products from "../data/products"; // ✅ Import product data

const Navbar = ({ cartCount, setIsCartOpen, setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Check if Admin is Logged In
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminAuthenticated = localStorage.getItem("adminAuth") === "true";

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  // ✅ Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm);
      navigate("/");
      setMenuOpen(false);
    }
  };

  // ✅ Handle live search suggestions
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      setSearchQuery(""); // ✅ Reset search when cleared
    }

    if (query.length > 1) {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredProducts.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  // ✅ Hide search input on Admin, About, Contact, and Shop pages (but keep space on large screens)
  const hideSearchInput =
    isAdminPage ||
    location.pathname === "/about" ||
    location.pathname === "/contact" ||
    location.pathname === "/shop";

  // ✅ Active Link Styling
  const isActive = (path) =>
    location.pathname === path ? "text-red-500 font-bold" : "text-black hover:text-red-500";

  return (
    <nav className="bg-white shadow-md py-4 relative z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* ✅ Logo */}
        <Link to="/">
          <img src={logo} alt="Orient Appliances" className="h-10" />
        </Link>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/shop" className={isActive("/shop")}>Products</Link>
          <Link to="/about" className={isActive("/about")}>Who We Are</Link>
          <Link to="/contact" className={isActive("/contact")}>Contact</Link>
        </div>

        {/* ✅ Search Input - Hidden on Admin, About, Contact, and Shop Pages but still occupies space */}
        <div className={`hidden md:flex relative ${hideSearchInput ? "invisible w-48" : "w-auto"}`}>
          {!hideSearchInput && (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 focus:ring focus:ring-red-300"
              />
              <button type="submit" className="absolute right-2 top-2 text-red-600 hover:text-red-800">
                <FaSearch />
              </button>

              {/* ✅ Search Suggestions */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-md mt-2 z-[9999] max-h-60 overflow-auto">
                  {suggestions.map((product) => (
                    <li
                      key={product.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(product.name);
                        setSuggestions([]);
                        setSearchQuery(product.name);
                        navigate("/");
                      }}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          )}
        </div>

        {/* ✅ Cart, Logout & Hamburger Button */}
        <div className="flex space-x-4 items-center">
          {/* ✅ Show Cart Button only if NOT on Admin Pages */}
          {!isAdminPage && (
            <button onClick={() => setIsCartOpen((prev) => !prev)} className="relative text-red-600 hover:text-red-800">
              <FaShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* ✅ Show Logout Button ONLY on Admin Pages */}
          {isAdminAuthenticated && isAdminPage && (
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
              <FaSignOutAlt className="text-2xl" title="Logout" />
            </button>
          )}

          {/* ✅ Hamburger Menu for Mobile */}
          <button className="md:hidden text-2xl text-red-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 md:hidden">
          <Link to="/" className="py-2 text-lg text-gray-700 hover:text-red-600" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="py-2 text-lg text-gray-700 hover:text-red-600" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" className="py-2 text-lg text-gray-700 hover:text-red-600" onClick={() => setMenuOpen(false)}>Who We Are</Link>
          <Link to="/contact" className="py-2 text-lg text-gray-700 hover:text-red-600" onClick={() => setMenuOpen(false)}>Contact</Link>

          {/* ✅ Search Bar in Mobile Menu */}
          {!hideSearchInput && (
            <form onSubmit={handleSearch} className="relative w-3/4 mt-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:ring focus:ring-red-300"
              />
              <button type="submit" className="absolute right-3 top-3 text-red-600 hover:text-red-800">
                <FaSearch />
              </button>
            </form>
          )}
          
          {/* ✅ Logout Button in Mobile Menu if Admin is Logged In */}
          {isAdminAuthenticated && isAdminPage && (
            <button onClick={handleLogout} className="mt-4 text-lg text-red-600 hover:text-red-800">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
