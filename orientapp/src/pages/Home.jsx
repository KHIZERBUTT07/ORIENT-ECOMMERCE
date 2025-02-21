import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import TopSellingProducts from "../components/TopSellingProducts";
import products from "../data/products"; // ✅ Import all products

const categories = [
  { name: "Geysers", image: "/images/geyser1.jpg", link: "/shop?category=geysers" },
  { name: "Irons", image: "/images/iron1.jpeg", link: "/shop?category=irons" },
  { name: "Fans", image: "/images/fan1.jpg", link: "/shop?category=fans" },
  { name: "Hob", image: "/images/hob1.jpg", link: "/shop?category=hob" },
  { name: "Range Hoods", image: "/images/rangehood1.jpeg", link: "/shop?category=range-hoods" },
];

const Home = ({ addToCart, searchQuery }) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery || "");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      setFilteredProducts(products); // ✅ Reset to full product list
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    setSearchTerm(searchQuery || ""); // ✅ Ensure search term updates correctly
  }, [searchQuery]);

  return (
    <div>
      {/* ✅ Hero Section */}
      <HeroCarousel />

      {/* ✅ Display Search Results Only If Search Term Exists */}
      {searchTerm.trim() ? (
        <div className="container mx-auto py-10 px-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Search Results for "{searchTerm}"
          </h2>

          {/* ✅ Display Search Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative flex flex-col p-4"
                >
                  {/* ✅ Product Image */}
                  <Link to={`/product/${product.id}`} className="flex-grow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[200px] object-contain"
                    />
                  </Link>

                  {/* ✅ Product Details */}
                  <div className="pt-4 pb-6 text-center flex flex-col justify-between flex-grow">
                    <h3 className="font-medium text-lg min-h-[3rem]">{product.name}</h3>
                    <p className="text-gray-500 line-through text-sm">
                      PKR {product.oldPrice.toLocaleString()}
                    </p>
                    <p className="text-red-600 text-xl font-bold">
                      PKR {product.price.toLocaleString()}
                    </p>

                    {/* ✅ Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition w-12 h-12 flex items-center justify-center mx-auto"
                    >
                      🛒
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">No products found.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ✅ Top Selling Products Section */}
          <TopSellingProducts addToCart={addToCart} />

          {/* ✅ Categories Section */}
          <div className="container mx-auto py-10 px-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Top Product Categories</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <Link
                  to={category.link}
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-auto object-contain"
                  />
                  <h3 className="text-center text-xl font-semibold py-4 bg-white">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>

            {/* View All Products Button */}
            <div className="text-center mt-8">
              <Link
                to="/shop"
                className="inline-block px-6 py-3 text-black bg-gray-200 rounded-full transition duration-300 hover:bg-black hover:text-white"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
