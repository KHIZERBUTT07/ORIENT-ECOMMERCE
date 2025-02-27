import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12; // ✅ Show only 12 products per page

  // ✅ Fetch Products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter & Sort Products
  useEffect(() => {
    let updatedProducts = [...products];

    // 🔍 Search Filtering
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 📂 Category Filtering
    if (selectedCategory !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // 🔼🔽 Sorting by Price
    if (sortOrder === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1); // ✅ Reset pagination when filters change
  }, [searchQuery, selectedCategory, sortOrder, products]);

  // ✅ Get Unique Categories
  const categories = ["all", ...new Set(products.map((product) => product.category))];

  // ✅ Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ✅ Handle Pagination Click
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  if (loading) {
    return <h2 className="text-center text-gray-600 py-10">⏳ Loading Products...</h2>;
  }

  return (
    <div className="container mx-auto">
      {/* ✅ Hero Section */}
      <div className="relative w-full h-[350px] bg-black">
        <img
          src="/images/fan.png"
          alt="Shop Banner"
          className="w-full h-full opacity-50"
          loading="lazy"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold">Shop</h1>
          <p className="mt-2 text-lg">Shop Through Our Latest & Featured Products</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-10 px-6">
        {/* ✅ Sidebar (Category Filters) */}
        <div className="w-full md:w-1/4 border-r-2 pr-6">
          <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={`cursor-pointer p-2 mb-2 rounded-lg font-medium ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Main Content */}
        <div className="w-full md:w-3/4 mb-2 lg:ml-2 sm:mt-1.5">
          {/* ✅ Search & Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            {/* 🔍 Search Input */}
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border p-2 pl-10 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <AiOutlineSearch className="absolute left-3 top-3 text-gray-500 text-lg" />
            </div>

            {/* 🔼🔽 Sorting */}
            <select
              className="border p-2 rounded-lg focus:ring-2 focus:ring-red-500 mt-2 md:mt-0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="" disabled hidden>
                Sort By
              </option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* ✅ Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative flex flex-col p-4">
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                      {product.discount} OFF
                    </div>
                  )}

                  <Link to={`/product/${product.id}`} className="flex-grow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[200px] object-contain"
                      loading="lazy"
                    />
                  </Link>

                  <div className="pt-4 pb-6 text-center flex flex-col justify-between flex-grow">
                    <h3 className="font-medium text-lg min-h-[3rem]">{product.name}</h3>
                    <p className="text-gray-500 line-through text-sm">PKR {product.oldPrice}</p>
                    <p className="text-red-600 text-xl font-bold">PKR {product.price}</p>

                    {/* ✅ Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition w-12 h-12 flex items-center justify-center mx-auto"
                    >
                      <FaShoppingCart className="text-xl" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">No products found.</p>
            )}
          </div>

          {/* ✅ Pagination Buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            <button onClick={prevPage} disabled={currentPage === 1} className="p-2 bg-gray-300 rounded">Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages} className="p-2 bg-gray-300 rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;