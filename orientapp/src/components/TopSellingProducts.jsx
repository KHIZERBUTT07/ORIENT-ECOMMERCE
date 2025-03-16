import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

// ✅ Custom Navigation Arrows
const CustomPrevArrow = ({ onClick }) => (
  <button
    className="absolute -top-12 left-2 bg-red-600 text-white px-5 py-3 text-2xl font-bold shadow-lg hover:bg-red-700 transition"
    onClick={onClick}
  >
    🢀
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    className="absolute -top-12 right-2 bg-red-600 text-white px-5 py-3 text-2xl font-bold shadow-lg hover:bg-red-700 transition"
    onClick={onClick}
  >
    🢂
  </button>
);

const TopSellingProducts = ({ addToCart }) => {
  // ✅ Step 1: Set Initial State to Manually Added Products (Instant Load)
  const manuallyAddedProducts = [
    { id: "static-1", productName: "A/C D/C Mega Bracket Fan 24' [6 Blades]", price: 14500, oldPrice: 16477, discount: "12%", image: "/images/top1.jpeg" },
    { id: "static-2", productName: "Glass Exhaust Fan 8' | Orient Appliances", price: 3600, oldPrice: 4100, discount: "12%", image: "/images/top2.jpeg" },
    { id: "static-3", productName: "Semi Electric Geyser 12.5 Litre | Orient Appliances", price: 19700, oldPrice: 22400, discount: "12%", image: "/images/top3.png" },
    { id: "static-4", productName: "Grand Pedestal Fan 4 Blades 24 | Orient Appliances", price: 12500, oldPrice: 14205, discount: "12%", image: "/images/top4.jpg" },
    { id: "static-5", productName: "Hybrid Fan with Lithium Battery", price: 21000, oldPrice: 23340, discount: "10%", image: "/images/top5.jpeg" },
  ];

  const [topSellingProducts, setTopSellingProducts] = useState(manuallyAddedProducts); // ✅ Set manually added products initially

  // ✅ Step 2: Fetch Top Selling Products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "topSellingProducts"));
        const firebaseProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // ✅ Merge with manually added products (without delay)
        setTopSellingProducts((prevProducts) => [...prevProducts, ...firebaseProducts]);
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
        toast.error("❌ Failed to load top-selling products.");
      }
    };
  
    // ✅ Fetch Firebase products in the background without UI delay
    setTimeout(fetchProducts, 50); // Small delay to ensure UI renders first
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, arrows: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false } },
    ],
  };

  return (
    <div className="container mx-auto py-10 px-6 relative">
      <h2 className="text-2xl font-bold mb-6 text-center"> Our Top Selling Products</h2>

      {/* ✅ Directly Show Products Without "Loading..." */}
      <div className="relative">
        <Slider {...settings}>
          {topSellingProducts.map((product) => (
            <div key={product.id} className="p-4">
              <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition relative flex flex-col h-[450px]">
                {/* ✅ Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-sm px-3 py-1 rounded-md">
                    {product.discount} Off
                  </div>
                )}

                {/* ✅ Product Image (Redirects to Shop Page) */}
                <Link to="/shop" className="flex-grow p-4">
                  <img
                    src={product.image || "/images/default-product.jpg"}
                    alt={product.productName}
                    className="w-full h-[200px] object-contain"
                  />
                </Link>

                {/* ✅ Product Details */}
                <div className="p-4 text-center flex flex-col justify-between flex-grow">
                  <h3 className="font-medium text-lg min-h-[3rem]">{product.productName}</h3>
                  <p className="text-gray-500 line-through text-sm">
                    PKR {product.oldPrice ? product.oldPrice.toLocaleString() : "N/A"}
                  </p>
                  <p className="text-red-600 text-xl font-bold">
                    PKR {product.price ? product.price.toLocaleString() : "N/A"}
                  </p>

                  {/* ✅ Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-4 right-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
                  >
                    <FaShoppingCart className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TopSellingProducts;
