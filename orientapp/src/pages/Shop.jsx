import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productsData from "../data/products.json"; // Mock data

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, []);

  // Handle category filter
  const filterByCategory = (category) => {
    setCategory(category);
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  // Handle sorting
  const handleSort = (e) => {
    setSort(e.target.value);
    let sortedProducts = [...filteredProducts];

    if (e.target.value === "price-low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (e.target.value === "price-high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sortedProducts);
  };

  return (
    <div className="container mx-auto py-10 px-6 flex">
      {/* Sidebar Filters */}
      <div className="w-1/4 pr-6">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div>
          <h3 className="font-semibold">Category</h3>
          <ul className="mt-2 space-y-2">
            <li className={`cursor-pointer ${category === "all" ? "text-red-500 font-bold" : ""}`} onClick={() => filterByCategory("all")}>All Products</li>
            <li className={`cursor-pointer ${category === "geysers" ? "text-red-500 font-bold" : ""}`} onClick={() => filterByCategory("geysers")}>Geysers</li>
            <li className={`cursor-pointer ${category === "irons" ? "text-red-500 font-bold" : ""}`} onClick={() => filterByCategory("irons")}>Irons</li>
            <li className={`cursor-pointer ${category === "room-coolers" ? "text-red-500 font-bold" : ""}`} onClick={() => filterByCategory("room-coolers")}>Room Coolers</li>
            <li className={`cursor-pointer ${category === "fans" ? "text-red-500 font-bold" : ""}`} onClick={() => filterByCategory("fans")}>Fans</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Sort By</h3>
          <select className="w-full mt-2 p-2 border" value={sort} onChange={handleSort}>
            <option value="default">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-3/4">
        <h2 className="text-2xl font-bold mb-6">Shop</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="border p-4 rounded-md">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="mt-2 font-bold">{product.name}</h3>
                  <p className="text-red-500 font-semibold">PKR {product.price}</p>
                </Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
