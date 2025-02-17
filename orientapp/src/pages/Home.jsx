import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gray-200 py-20 text-center">
        <h1 className="text-4xl font-bold">ORIENT ELECTRIC WITH GAS GEYSER</h1>
        <p className="mt-4">Instant hot water, energy-efficient solutions for your home.</p>
        <Link to="/shop">
          <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg">Shop Now</button>
        </Link>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-6">Our Top Product Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Link to="/shop?category=geysers" className="bg-gray-100 p-6 text-center">Geysers</Link>
          <Link to="/shop?category=irons" className="bg-gray-100 p-6 text-center">Irons</Link>
          <Link to="/shop?category=room-coolers" className="bg-gray-100 p-6 text-center">Room Coolers</Link>
          <Link to="/shop?category=fan" className="bg-gray-100 p-6 text-center">Fans</Link>
          <Link to="/shop?category=hob" className="bg-gray-100 p-6 text-center">Hob</Link>
          <Link to="/shop?category=range-hoods" className="bg-gray-100 p-6 text-center">Range Hoods</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
