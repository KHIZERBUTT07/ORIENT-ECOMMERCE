import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom navigation arrow components
const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 bg-gray-800 text-white p-3 md:p-4 rounded-full cursor-pointer z-10 opacity-80 hover:opacity-100 transition"
    onClick={onClick}
  >
    🢂
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 left-4 md:left-10 transform -translate-y-1/2 bg-gray-800 text-white p-3 md:p-4 rounded-full cursor-pointer z-10 opacity-80 hover:opacity-100 transition"
    onClick={onClick}
  >
    🢀
  </div>
);

const banners = [
  "/images/1726693259.JPG",
  "/images/1732779625.jpeg",
  "/images/1732780294.jpeg",
  "/images/1732781052.jpeg",
  "/images/1732781247.jpeg",
  "/images/1732781338.jpeg",
  "/images/1732781583.jpeg",
  "/images/1732781932.jpeg",
  "/images/1732782150.jpeg",
  "/images/1732782244.jpeg",
  "/images/1732782397.jpeg",
  "/images/1732782527.jpeg",
  "/images/1732782709.jpeg",
  "/images/1732782835.jpeg",
  "/images/1732782917.jpeg",
  "/images/1732783011.jpeg",
  "/images/1732783217.jpeg",
  "/images/1732783313.jpeg",
  "/images/1732783438.jpeg",
  "/images/1732783532.jpeg",
  "/images/1732783687.jpeg",
  "/images/1732876776.jpeg",
  "/images/1733126252.jpeg",
];

const HeroCarousel = () => {
  const settings = {
    dots: true, // ✅ Enable dots
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // ✅ Change slides every 2 seconds
    arrows: true,
    nextArrow: <NextArrow />, // ✅ Custom next arrow
    prevArrow: <PrevArrow />, // ✅ Custom prev arrow
    pauseOnHover: false,
  };

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {banners.map((image, index) => (
          <div key={index} className="flex justify-center items-center">
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              className={`w-full object-cover max-w-full mb-8 ${
                index === 0 ? "lg:h-[335px] sm:h-auto": "h-auto"
              }`} 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
