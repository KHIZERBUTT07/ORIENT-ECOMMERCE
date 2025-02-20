import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import logo from "/images/logo.png";
import products from "../data/products"; // ✅ Import product data

const Navbar = ({ cartCount, setIsCartOpen, setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ✅ Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm); // ✅ Update search query in App.jsx
      navigate("/"); // ✅ Redirect to Home page to show results
    }
  };

  // ✅ Handle live search suggestions
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 1) {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredProducts.slice(0, 5)); // ✅ Limit suggestions to 5
    } else {
      setSuggestions([]);
    }
  };

  // ✅ Hide search input on Shop page
  const isShopPage = location.pathname === "/shop";

  const isActive = (path) =>
    location.pathname === path ? "text-red-500 font-bold" : "text-black hover:text-red-500";

  return (
    <nav className="bg-white shadow-md py-4 relative z-50">
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

        <div className="flex space-x-4 items-center relative">
          {/* ✅ Show search input only if NOT on the Shop page */}
          {!isShopPage && (
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
                        setSearchQuery(product.name); // ✅ Update search query
                        navigate("/"); // ✅ Redirect to Home page
                      }}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          )}

          <button onClick={() => setIsCartOpen((prev) => !prev)} className="relative text-red-600 hover:text-red-800">
            <FaShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
