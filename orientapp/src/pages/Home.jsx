import React from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import TopSellingProducts from "../components/TopSellingProducts"; // ✅ Import Top Selling Products

const categories = [
  { name: "Geysers", image: "/images/geyser1.jpg", link: "/shop?category=geysers" },
  { name: "Irons", image: "/images/iron1.jpeg", link: "/shop?category=irons" },
  { name: "Fans", image: "/images/fan1.jpg", link: "/shop?category=fans" },
  { name: "Hob", image: "/images/hob1.jpg", link: "/shop?category=hob" },
  { name: "Range Hoods", image: "/images/rangehood1.jpeg", link: "/shop?category=range-hoods" },
];

const Home = ({ addToCart }) => {
  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Top Selling Products Section */}
      <TopSellingProducts  addToCart={addToCart}/>

      {/* Categories Section */}
      <div className="container mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Top Product Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <Link
              to={category.link}
              key={index}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <img src={category.image} alt={category.name} className="w-full h-auto object-contain" />
              <h3 className="text-center text-xl font-semibold py-4 bg-white">{category.name}</h3>
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
    </div>
  );
};

export default Home;
