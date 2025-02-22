import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import products from "../data/products"; // ✅ Import all products

const ShopCategoryPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  // Extract the category from the URL
  const category = location.pathname.split("/")[2]; // Get category from URL

  useEffect(() => {
    console.log(category); // Debugging category
    const filtered = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
    console.log(filtered); // Debugging filtered products
    setFilteredProducts(filtered);
  }, [category]);

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {category} Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative flex flex-col p-4"
            >
              {/* ✅ Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[200px] object-contain"
              />
              <div className="pt-4 pb-6 text-center flex flex-col justify-between flex-grow">
                <h3 className="font-medium text-lg min-h-[3rem]">{product.name}</h3>
                <p className="text-gray-500 line-through text-sm">
                  PKR {product.oldPrice}
                </p>
                <p className="text-red-600 text-xl font-bold">
                  PKR {product.price}
                </p>

                {/* ✅ Add to Cart Button */}
                <button
                  onClick={() => alert(`${product.name} added to cart!`)}
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
  );
};

export default ShopCategoryPage;
