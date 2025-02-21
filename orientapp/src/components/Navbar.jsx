import React, { useState } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import logo from "/images/logo.png";
import products from "../data/products"; // ✅ Import product data

const Navbar = ({ cartCount, setIsCartOpen, setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Pages where search should be hidden
  const hiddenSearchPages = ["/admin", "/about", "/contact" ,"/shop"];
  const isHiddenSearch = hiddenSearchPages.some((path) => location.pathname.startsWith(path));

  // ✅ Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm);
      navigate("/shop");
      setMenuOpen(false); // Close menu on search
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
      setSuggestions(filteredProducts.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const isActive = (path) =>
    location.pathname === path ? "text-red-500 font-bold" : "text-black hover:text-red-500";

  return (
    <nav className="bg-white shadow-md py-4 relative z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* ✅ Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Orient Appliances" className="h-10" />
        </Link>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={isActive("/")} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" className={isActive("/shop")} onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" className={isActive("/about")} onClick={() => setMenuOpen(false)}>Who We Are</Link>
          <Link to="/contact" className={isActive("/contact")} onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>

        {/* ✅ Search Input - Hidden on Certain Pages */}
        {!isHiddenSearch && (
          <div className="hidden md:flex relative">
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
                        navigate("/shop");
                      }}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        )}

        {/* ✅ Cart & Hamburger Button */}
        <div className="flex space-x-4 items-center">
          <button onClick={() => setIsCartOpen((prev) => !prev)} className="relative text-red-600 hover:text-red-800">
            <FaShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

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

          {/* ✅ Search Bar (Centered on Mobile & Hidden on Admin, About, Contact) */}
          {!isHiddenSearch && (
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
