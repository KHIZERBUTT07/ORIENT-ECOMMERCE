import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const DealerDashboard = () => {
  const [deals, setDeals] = useState([]);
  const [dealerProducts, setDealerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ Carousel Index

  // ✅ Fetch Dealer Products & Exclusive Deals from Firebase
  useEffect(() => {
    const fetchDealerData = async () => {
      try {
        const dealSnapshot = await getDocs(collection(db, "dealerDeals"));
        const productSnapshot = await getDocs(collection(db, "dealerProducts"));

        const dealList = dealSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDeals(dealList);
        setDealerProducts(productList);
      } catch (error) {
        console.error("Error fetching dealer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDealerData();
  }, []);

  return (
    <div className="container mx-auto py-10 px-6">
      {/* 🎉 Hero Section */}
      <div className="relative w-full h-[400px] bg-black">
        <img
          src="/images/banners/banner1.jpeg"
          alt="Dealership Banner"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold">Welcome to Orient Appliances Dealership</h1>
          <p className="mt-3 text-xl">Exclusive Deals, Discounts, and Bulk Offers for Our Valued Dealers</p>
        </div>
      </div>

      {/* 🚀 Exclusive Products for Dealers */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold text-red-600">🎯 Exclusive Dealer Products</h2>
        <p className="text-gray-600 mt-2">Get the best prices available only for our registered dealers.</p>
      </div>

      {/* ✅ Dealer Products Section */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-center text-gray-500 w-full">Loading Products...</p>
        ) : dealerProducts.length > 0 ? (
          dealerProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative p-4 bg-white">
              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                  {product.discount}% OFF
                </div>
              )}

              {/* Product Image */}
              <img
                src={product.image || "/images/default-product.jpg"}
                alt={product.productName}
                className="w-full h-[200px] object-contain"
              />

              {/* Product Info */}
              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold">{product.productName}</h3>
                <p className="text-gray-500">Min Order: {product.minOrder} pcs</p>
                <p className="text-gray-500 line-through text-sm">Normal Price: PKR {product.normalPrice}</p>
                <p className="text-green-600 text-2xl font-bold mt-2">Dealer Price: PKR {product.dealerPrice}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">No exclusive products available at the moment.</p>
        )}
      </div>

      {/* ✅ Featured Deals Carousel */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold text-green-600">🎡 Featured Dealer Deals</h2>
        <p className="text-gray-600 mt-2">Explore our latest bulk deals & exclusive offers.</p>

        {deals.length > 0 ? (
          <div className="relative mt-6">
            <div className="overflow-hidden w-full h-[300px]">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }} // ✅ FIXED ERROR HERE
              >
                {deals.map((deal, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-4 bg-white shadow-lg text-center">
                    <h3 className="text-xl font-bold">{deal.dealName}</h3>
                    <p className="text-gray-500">
                      {Array.isArray(deal.products) ? deal.products.join(", ") : "No products listed"}
                    </p>
                    <p className="text-gray-500 line-through">Total Price: PKR {deal.totalPrice}</p>
                    <p className="text-red-600 text-2xl font-bold">Final Price: PKR {deal.finalPrice}</p>
                    <p className="text-gray-500">Min Order: {deal.minOrder} pcs</p>

                    {/* ✅ Fix: Check if images exist before accessing */}
                    <img
                      src={deal.dealImages && deal.dealImages.length > 0 ? deal.dealImages[0] : "/images/default-product.jpg"}
                      alt="Deal Image"
                      className="w-full h-[200px] object-contain mx-auto mt-4"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Carousel Controls */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : deals.length - 1))}
                className="bg-gray-300 px-4 py-2 rounded-full"
              >
                ◀ Prev
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev < deals.length - 1 ? prev + 1 : 0))}
                className="bg-gray-300 px-4 py-2 rounded-full"
              >
                Next ▶
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 w-full mt-4">No special offers available at the moment.</p>
        )}
      </div>
      <div className="mt-10 text-center bg-gray-100 p-6 rounded-lg">
        <h2 className="text-3xl font-bold text-blue-600">🎁 Exclusive Dealer Benefits</h2>
        <p className="text-gray-600 mt-2">Maximize your profits with our dealership offers.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">💰 Bulk Purchase Discounts</h3>
            <p className="text-gray-500 mt-2">Enjoy higher discounts when you order in bulk.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">🚛 Fast & Free Shipping</h3>
            <p className="text-gray-500 mt-2">We deliver quickly with zero shipping costs on large orders.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">📈 Priority Support</h3>
            <p className="text-gray-500 mt-2">Get dedicated dealer support and priority assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
