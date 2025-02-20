import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

// ✅ Custom Navigation Arrows (Now at the Top of Carousel)
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
  if (!addToCart) {
    console.error("❌ addToCart function is missing in TopSellingProducts.jsx");
  }

  const topSellingProducts = [
    { id: 1, name: "A/C D/C Mega Bracket Fan 24' [6 Blades] | Orient Appliances", price: 14500, oldPrice: 16477, discount: "12%", image: "/images/top1.jpeg", link: "/product/1" },
    { id: 2, name: "Glass Exhaust Fan 8' | Orient Appliances", price: 3600, oldPrice: 4100, discount: "12%", image: "/images/top2.jpeg", link: "/product/2" },
    { id: 3, name: "Semi Electric Geyser 12.5 Litre | Orient Appliances", price: 19700, oldPrice: 22400, discount: "12%", image: "/images/top3.png", link: "/product/3" },
    { id: 4, name: "Grand Pedestal Fan 4 Blades 24 | Orient Appliances", price: 12500, oldPrice: 14205, discount: "12%", image: "/images/top4.jpg", link: "/product/4" },
    { id: 5, name: "Hybrid Fan with Lithium Battery | Portable & Efficient Cooling", price: 21000, oldPrice: 23340, discount: "10%", image: "/images/top5.jpeg", link: "/product/5" },
    { id: 6, name: "Megnum Black Green 4 Blade | Orient Appliances", price: 10000, oldPrice: 11364, discount: "12%", image: "/images/top6.jpg", link: "/product/6" },
    { id: 7, name: "OR-875B012 - 87Cm 8MM Glass Copper Burner Sabaf with Safety Device", price: 39900, oldPrice: 47000, discount: "15%", image: "/images/top7.jpg", link: "/product/7" },
    { id: 8, name: "Orient Range Hood S03 [60 CM] | Orient Appliances", price: 28000, oldPrice: 31850, discount: "12%", image: "/images/top8.jpeg", link: "/product/8" },
    { id: 9, name: "Orient Dry Iron - OR 555 - Black & Silver", price: 2610, oldPrice: 2900, discount: "10%", image: "/images/top9.jpeg", link: "/product/9" },
    { id: 10, name: "Orient Electric Geyser 36 Litre | Orient Appliances", price: 25000, oldPrice: 28410, discount: "12%", image: "/images/top10.jpeg", link: "/product/10" },
    { id: 11, name: "Orient Electric + Gas Geyser 40 Litre | Orient Appliances", price: 34000, oldPrice: 45000, discount: "22%", image: "/images/top11.jpg", link: "/product/11" },
    { id: 12, name: "Pearl 30 Watts Fan Dual Option | Orient Appliances", price: 10000, oldPrice: 11370, discount: "12%", image: "/images/top12.jpeg", link: "/product/12" },
  ];

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
      <h2 className="text-2xl font-bold mb-6 text-center">Our Top Selling Products</h2>

      {/* ✅ Wrapper for Arrows to Position on Top */}
      <div className="relative">
        <Slider {...settings}>
          {topSellingProducts.map((product) => (
            <div key={product.id} className="p-4">
              <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition relative flex flex-col h-[450px]">
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 bg-red-600 text-white text-sm px-3 py-1 rounded-md">
                  {product.discount} Off
                </div>

                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="flex-grow p-4">
                  <img src={product.image} alt={product.name} className="w-full h-[200px] object-contain" />
                </Link>

                {/* Product Details */}
                <div className="p-4 text-center flex flex-col justify-between flex-grow">
                  <h3 className="font-medium text-lg min-h-[3rem]">{product.name}</h3>
                  <p className="text-gray-500 line-through text-sm">PKR {product.oldPrice.toLocaleString()}</p>
                  <p className="text-red-600 text-xl font-bold">PKR {product.price.toLocaleString()}</p>

                  {/* ✅ Add to Cart Button */}
                  <button
                    onClick={() => {
                      alert(`${product.name} added to cart!`);
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
