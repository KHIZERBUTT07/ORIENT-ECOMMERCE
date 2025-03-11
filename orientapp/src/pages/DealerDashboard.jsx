import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, getDocs } from "firebase/firestore";

const DealerDashboard = () => {
  const [deals, setDeals] = useState([]);
  const [dealerProducts, setDealerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({}); // ✅ Image Carousel Index

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

        // ✅ Initialize Image Indexes for Each Deal
        const initialIndexes = dealList.reduce((acc, deal) => {
          acc[deal.id] = 0;
          return acc;
        }, {});
        setImageIndexes(initialIndexes);

      } catch (error) {
        console.error("Error fetching dealer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDealerData();
  }, []);

  // ✅ Automatically Cycle Images Every 3 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const updatedIndexes = {};
        deals.forEach((deal) => {
          if (deal.dealImages && deal.dealImages.length > 0) {
            updatedIndexes[deal.id] =
              (prevIndexes[deal.id] + 1) % deal.dealImages.length;
          }
        });
        return updatedIndexes;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [deals]);

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

{/* ✅ Featured Deals Section (Each Product Has Image Carousel) */}
<div className="mt-10 text-center">
  <h2 className="text-3xl font-bold text-green-600">🎡 Featured Dealer Deals</h2>
  <p className="text-gray-600 mt-2">Explore our latest bulk deals & exclusive offers.</p>
</div>

<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {loading ? (
    <p className="text-center text-gray-500 w-full">Loading Deals...</p>
  ) : deals.length > 0 ? (
    deals.map((deal) => {
      // Debugging: Log the deal data to ensure it's correct
      console.log("Deal Data:", deal);

      return (
        <div key={deal.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative p-4 bg-white">
          {/* Deal Info */}
          <h3 className="text-xl font-bold text-center">{deal.dealName}</h3>
          <p className="text-gray-500 text-center">
            {Array.isArray(deal.products) ? deal.products.join(", ") : "No products listed"}
          </p>
          <p className="text-gray-500 line-through text-center">Total Price: PKR {deal.totalPrice}</p>
          <p className="text-red-600 text-2xl font-bold text-center">Final Price: PKR {deal.finalPrice}</p>
          <p className="text-gray-500 text-center">Min Order: {deal.minOrder} pcs</p>

          {/* ✅ Image Carousel for Each Deal */}
          <div className="relative w-full flex justify-center mt-4">
            {deal.images && deal.images.length > 0 ? (
              <div className="w-[250px] h-[200px] overflow-hidden relative">
                {/* Carousel Images */}
                {deal.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Deal Image ${index + 1}`}
                    className={`w-full h-full object-cover rounded-lg shadow-md absolute top-0 left-0 transition-opacity duration-500 ${
                      index === 0 ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      animation: `carousel ${deal.images.length * 3}s infinite ${index * 3}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              // Fallback if no images are available
              <img
                src="/images/default-product.jpg"
                alt="Default Deal Image"
                className="w-[250px] h-[200px] object-cover rounded-lg shadow-md"
              />
            )}
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-center text-gray-500 w-full">No special offers available at the moment.</p>
  )}
</div>

{/* ✅ CSS for Auto Carousel */}
<style>
  {`
    @keyframes carousel {
      0% { opacity: 1; }
      33.33% { opacity: 1; }
      33.34% { opacity: 0; }
      66.66% { opacity: 0; }
      66.67% { opacity: 1; }
      100% { opacity: 1; }
    }
  `}
</style>

      {/* 🚀 Dealer Benefits Section */}
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
