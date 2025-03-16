import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import logo from "/images/logo.png";
import products from "../data/products"; // ✅ Import product data
import { db } from "../firebaseConfig"; // ✅ Import Firebase
import { collection, getDocs } from "firebase/firestore"; // ✅ Import Firestore methods

const Navbar = ({ cartCount, setIsCartOpen, setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]); // ✅ Store categories & subcategories
  const [hoveredCategory, setHoveredCategory] = useState(null); // ✅ Track hovered category
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ✅ Toggle dropdown
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null); // ✅ Track open mobile category
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(true); // ✅ Always show categories on mobile

  // ✅ Fetch Categories & Subcategories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const categoryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group products by category and subcategory
        const groupedCategories = {};
        categoryData.forEach((product) => {
          const { category, subcategory } = product;
          if (!groupedCategories[category]) {
            groupedCategories[category] = new Set();
          }
          if (subcategory) {
            groupedCategories[category].add(subcategory);
          }
        });

        // Convert to array format
        const formattedCategories = Object.keys(groupedCategories).map((category) => ({
          category,
          subcategories: Array.from(groupedCategories[category]),
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  // ✅ Handle Category Click → Redirect to Shop Page with Filter
  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
    setIsDropdownOpen(false); // Close dropdown after click
    setMenuOpen(false); // Close mobile menu after click
  };

  // ✅ Handle Subcategory Click → Redirect to Shop Page with Filter
  const handleSubcategoryClick = (category, subcategory) => {
    navigate(`/shop?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
    setIsDropdownOpen(false); // Close dropdown after click
    setMenuOpen(false); // Close mobile menu after click
  };

  // ✅ Hide search input on Admin, About, Contact, Shop, and Membership pages
  const hideSearchInput =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/about" ||
    location.pathname === "/contact" ||
    location.pathname === "/shop" ||
    location.pathname === "/membership";

  // ✅ Function to check if a link is active
  const isActive = (path) => {
    if (path === "/") {
      // For the "Home" link, check for an exact match
      return location.pathname === path;
    } else {
      // For other links, check if the current path starts with the given path
      return location.pathname.startsWith(path);
    }
  };

  // ✅ Toggle mobile category dropdown
  const toggleMobileCategory = (category) => {
    if (mobileCategoryOpen === category) {
      setMobileCategoryOpen(null); // Close if already open
    } else {
      setMobileCategoryOpen(category); // Open the clicked category
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 relative z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* ✅ Logo */}
        <Link to="/">
          <img src={logo} alt="Orient Appliances" className="h-10" />
        </Link>

        {/* ✅ Desktop & Tablet Menu (Hidden below 1024px) */}
        <div className="hidden lg:flex space-x-6">
          {localStorage.getItem("adminAuth") === "true" && location.pathname.startsWith("/admin") ? (
            <>
              <Link
                to="/admin"
                className={`hover:text-red-600 ${isActive("/admin") ? "text-red-600" : "text-gray-700"}`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/orders"
                className={`hover:text-red-600 ${isActive("/admin/orders") ? "text-red-600" : "text-gray-700"}`}
              >
                Orders
              </Link>
              <Link
                to="/admin/memberships"
                className={`hover:text-red-600 ${isActive("/admin/memberships") ? "text-red-600" : "text-gray-700"}`}
              >
                Dealerships
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`hover:text-red-600 ${isActive("/") ? "text-red-600" : "text-gray-700"}`}
              >
                Home
              </Link>

              {/* ✅ Products Dropdown */}
              <div
                className="relative hover:text-red-600 text-gray-700 cursor-pointer"
                onMouseEnter={() => setIsDropdownOpen(true)} // Open dropdown on hover
                onMouseLeave={() => setIsDropdownOpen(false)} // Close dropdown on leave
              >
                <Link
                  to="/shop"
                  className={`${isActive("/shop") ? "text-red-600" : "text-gray-700"}`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Products
                </Link>

                {/* ✅ Dropdown for Categories */}
                {isDropdownOpen && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg border rounded-lg w-56 z-50"
                    onMouseEnter={() => setIsDropdownOpen(true)} // Keep dropdown open when hovering over it
                    onMouseLeave={() => setIsDropdownOpen(false)} // Close dropdown when leaving it
                  >
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <div
                          key={category.category}
                          className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                          onMouseEnter={() => setHoveredCategory(category.category)} // Set hovered category
                          onMouseLeave={() => setHoveredCategory(null)} // Reset hovered category
                        >
                          <span onClick={() => handleCategoryClick(category.category)}>
                            {category.category}
                          </span>
                          {category.subcategories.length > 0 && <FaChevronRight className="text-gray-400" />}

                          {/* ✅ Subcategory Dropdown */}
                          {hoveredCategory === category.category && category.subcategories.length > 0 && (
                            <div
                              className="absolute left-full top-0 ml-2 bg-white shadow-lg border rounded-lg w-56 z-50"
                              onMouseEnter={() => setHoveredCategory(category.category)} // Keep subcategory dropdown open
                              onMouseLeave={() => setHoveredCategory(null)} // Close subcategory dropdown
                            >
                              {category.subcategories.map((subcategory) => (
                                <div
                                  key={subcategory}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleSubcategoryClick(category.category, subcategory)}
                                >
                                  {subcategory}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-gray-500">No categories available</p>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className={`hover:text-red-600 ${isActive("/about") ? "text-red-600" : "text-gray-700"}`}
              >
                Who We Are
              </Link>
              <Link
                to="/contact"
                className={`hover:text-red-600 ${isActive("/contact") ? "text-red-600" : "text-gray-700"}`}
              >
                Contact
              </Link>
              <Link
                to="/membership"
                className={`hover:text-red-600 ${isActive("/membership") ? "text-red-600" : "text-gray-700"}`}
              >
                Get Dealership
              </Link>
            </>
          )}
        </div>

        {/* ✅ Search Input - Visible on Desktop (Hidden on Membership, Admin, and Other Pages) */}
        <div className={`hidden lg:flex relative ${hideSearchInput ? "invisible w-48" : "w-auto"}`}>
          {!hideSearchInput && (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 focus:ring focus:ring-red-300"
              />
              <button type="submit" className="mt-1.5 absolute right-2 top-2 text-red-600 hover:text-red-800">
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
          {!location.pathname.startsWith("/admin") && (
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
          {localStorage.getItem("adminAuth") === "true" && location.pathname.startsWith("/admin") && (
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
              <FaSignOutAlt className="text-2xl" title="Logout" />
            </button>
          )}

          {/* ✅ Hamburger Menu for Mobile & Tablet (Visible up to 1023px) */}
          <button className="lg:hidden text-2xl text-red-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu (Dropdown, Visible up to 1023px) */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 lg:hidden">
          {localStorage.getItem("adminAuth") === "true" && location.pathname.startsWith("/admin") ? (
            <>
              <Link
                to="/admin"
                className={`py-2 text-lg ${isActive("/admin") ? "text-red-600" : "text-gray-700"} hover:text-red-600`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/orders"
                className={`py-2 text-lg ${isActive("/admin/orders") ? "text-red-600" : "text-gray-700"} hover:text-red-600`}
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/admin/memberships"
                className={`py-2 text-lg ${isActive("/admin/memberships") ? "text-red-600" : "text-gray-700"} hover:text-red-600`}
                onClick={() => setMenuOpen(false)}
              >
                Dealerships
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className={`py-2 text-lg ${isActive("/") ? "text-red-600" : "text-gray-700"} hover:text-red-600`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>

              {/* ✅ Mobile Products Dropdown */}
              <div className="relative w-full text-center py-2 text-lg hover:text-red-600">
                <Link
                  to="/shop"
                  className={`w-full flex justify-between items-center ${
                    isActive("/shop") ? "text-red-600" : "text-gray-700"
                  }`}
                  onClick={() => {
                    navigate("/shop"); // Redirect to /shop
                    setMenuOpen(false); // Close mobile menu
                  }}
                >
                  <span>Products</span>
                </Link>

                {/* ✅ Show Categories and Subcategories */}
                <div className="w-full bg-white border-t mt-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div key={category.category} className="py-2">
                        <button
                          className="text-left w-full px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                          onClick={() => toggleMobileCategory(category.category)}
                        >
                          <span>{category.category}</span>
                          {category.subcategories.length > 0 && (
                            <FaChevronRight
                              className={`text-gray-400 transition-transform ${
                                mobileCategoryOpen === category.category ? "rotate-90" : ""
                              }`}
                            />
                          )}
                        </button>

                        {/* ✅ Show Subcategories */}
                        {mobileCategoryOpen === category.category && category.subcategories.length > 0 && (
                          <div className="pl-6">
                            {category.subcategories.map((subcategory) => (
                              <button
                                key={subcategory}
                                className="block w-full px-4 py-1 text-sm hover:bg-gray-200"
                                onClick={() => handleSubcategoryClick(category.category, subcategory)}
                              >
                                {subcategory}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-500">No categories available</p>
                  )}
                </div>
              </div>

              <Link
                to="/about"
                className={`py-2 text-lg ${isActive("/about") ? "text-red-600" : "text-gray-700"} hover:text-red-600`}
                onClick={() => setMenuOpen(false)}
              >
                Who We Are
              </Link>
              <Link
                to="/contact"
                className={`py-2 text-lg ${isActive("/contact") ? "text-red-600" : "text-gray-700"} hover:text-red-600`}
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/membership"
                className={`py-2 text-lg ${isActive("/membership") ? "text-red-600" : "text-gray-700"} hover:text-red-600`}
                onClick={() => setMenuOpen(false)}
              >
                Get Dealership
              </Link>
            </>
          )}

          {/* ✅ Mobile Search - Visible ONLY on Home Page */}
          {location.pathname === "/" && (
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