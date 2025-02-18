import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

// Sample Top Selling Products Data (15 products)
const topSellingProducts = [
  { id: 1, name: "A/C D/C Mega Bracket Fan 24' [6 Blades] | Orient Appliances", price: 14500, oldPrice: 16477, discount: "12%", image: "/images/top1.jpeg", link: "/product/1" },
  { id: 2, name: "Glass Exhoust Fan 8' | Orient Appliances", price: 3600, oldPrice: 4100, discount: "12%", image: "/images/top2.jpeg", link: "/product/2" },
  { id: 3, name: "Semi Electric Geyser 12.5 Littre/ | Orient Appliances", price: 19700, oldPrice: 22400, discount: "12%", image: "/images/top3.png", link: "/product/3" },
  { id: 4, name: "Grand Pedestal Fan 4 Blades 24 | Orient Appliances", price: 12500, oldPrice: 14205, discount: "12%", image: "/images/top4.jpg", link: "/product/4" },
  { id: 5, name: "Hybrid Fan with Lithium Battery | Portable & Efficient Cooling", price: 21000, oldPrice: 23340, discount: "10%", image: "/images/top5.jpeg", link: "/product/5" },
  { id: 6, name: "Megnum Black green  4 blade | Orient Appliances", price: 10000, oldPrice: 11364, discount: "12%", image: "/images/top6.jpg", link: "/product/6" },
  { id: 7, name: "OR-875B012 - 87Cm 8MM Glass Copper Burner Sabaf with Safety Device", price: 39900, oldPrice: 47000, discount: "15%", image: "/images/top7.jpg", link: "/product/7" },
  { id: 8, name: "Orient Range Hood S03 [60 CM] Orient Appliances", price: 28000, oldPrice: 31850, discount: "12%", image: "/images/top8.jpeg", link: "/product/8" },
  { id: 9, name: "Orient Dry Iron - OR 555 - black & Silver", price: 2610, oldPrice: 2900, discount: "10%", image: "/images/top9.jpeg", link: "/product/9" },
  { id: 10, name: "Orient Electric Geyser 36 Littre | Orient Appliances", price: 25000, oldPrice: 28410, discount: "12%", image: "/images/top10.jpeg", link: "/product/10" },
  { id: 11, name: "Orient Electric + Gas Geyser 40 Littre | Orient Appliances", price: 34000, oldPrice: 45000, discount: "22%", image: "/images/top11.jpg", link: "/product/11" },
  { id: 12, name: "Pearl 30 Watts fan dual option Orient Appliances", price: 10000, oldPrice: 11370, discount: "12%", image: "/images/top12.jpeg", link: "/product/12" },
];

// Custom navigation arrow components
const NextArrow = ({ onClick }) => (
  <div className="absolute top-[12%] right-0 bg-red-600 text-white px-4 py-2 cursor-pointer z-10 hover:bg-red-700 transition" onClick={onClick}>
    ❯
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="absolute top-[12%] left-0 bg-red-600 text-white px-4 py-2 cursor-pointer z-10 hover:bg-red-700 transition" onClick={onClick}>
    ❮
  </div>
);

const TopSellingProducts = () => {
  const [cart, setCart] = useState([]);

  // Function to add product to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4, // ✅ Show 4 products at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: { slidesToShow: 2 }, // ✅ Show 2 products on tablets
      },
      {
        breakpoint: 768, // For mobile screens
        settings: { slidesToShow: 1 }, // ✅ Show 1 product on small screens
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 px-6 relative">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Top Selling Products</h2>
      <Slider {...settings}>
        {topSellingProducts.map((product) => (
          <div key={product.id} className="p-4">
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition relative flex flex-col h-[450px]">
              
              {/* Discount Badge */}
              <div className="absolute top-2 left-2 bg-red-600 text-white text-sm px-3 py-1 rounded-md">
                {product.discount} Off
              </div>

              {/* Product Image */}
              <Link to={product.link} className="flex-grow p-4">
                <img src={product.image} alt={product.name} className="w-full h-[200px] object-contain" />
              </Link>

              {/* Product Details */}
              <div className="p-4 text-center flex flex-col justify-between flex-grow">
                <h3 className="font-medium text-lg min-h-[3rem]">{product.name}</h3>
                <p className="text-gray-500 line-through text-sm">PKR {product.oldPrice.toLocaleString()}</p>
                <p className="text-red-600 text-xl font-bold">PKR {product.price.toLocaleString()}</p>

                {/* Cart Icon */}
                <button
                  onClick={() => addToCart(product)}
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
  );
};

export default TopSellingProducts;
