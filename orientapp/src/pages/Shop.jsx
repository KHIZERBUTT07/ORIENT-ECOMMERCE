import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

// ✅ Shop Page Mock Products
const products = [
  
  {
      "id": 1,
      "name": "A/C D/C Mega Bracket Fan 24' [4 Blades] | Orient Appliances",
      "price": 14000,
      "oldPrice": 16000,
      "category": "geysers",
      "image": "/images/prod1.jpeg",
      "discount": "12%"
  },
  {
      "id": 2,
      "name": "A/C D/C Mega Bracket Fan 24' [6 Blades] | Orient Appliances",
      "price": 14500,
      "oldPrice": 16500,
      "category": "fans",
      "image": "/images/prod2.jpeg",
      "discount": "12%"
  },
  {
      "id": 3,
      "name": "Energy Saver Dubai Model 56' Ceiling Fan 55 Watts",
      "price": 9500,
      "oldPrice": 10300,
      "category": "fans",
      "image": "/images/prod3.jpeg",
      "discount": "8%"
  },
  {
      "id": 4,
      "name": "Energy Saver Kingi Model 56' Ceiling Fan 55 Watts",
      "price": 9500,
      "oldPrice": 10100,
      "category": "fans",
      "image": "/images/prod4.jpeg",
      "discount": "6%"
  },
  {
      "id": 5,
      "name": "Energy Saver Pride Model 56' Ceiling Fan 55 Watts",
      "price": 9500,
      "oldPrice": 10000,
      "category": "fans",
      "image": "/images/prod5.jpeg",
      "discount": "5%"
  },
  {
      "id": 6,
      "name": "Energy Saver Unique Model 56' Ceiling Fan 55 Watts",
      "price": 9500,
      "oldPrice": 10450,
      "category": "fans",
      "image": "/images/prod6.jpeg",
      "discount": "9%"
  },
  {
      "id": 7,
      "name": "Glass Exhaust Fan 6' | Orient Appliances",
      "price": 3300,
      "oldPrice": 3750,
      "category": "fans",
      "image": "/images/prod7.jpeg",
      "discount": "12%"
  },
  {
      "id": 8,
      "name": "Glass Exhaust Fan 8' | Orient Appliances",
      "price": 3600,
      "oldPrice": 3870,
      "category": "fans",
      "image": "/images/prod8.jpeg",
      "discount": "7%"
  },
  {
      "id": 9,
      "name": "GULF 30W Inverter Ceiling Fan | Orient Appliances",
      "price": 11200,
      "oldPrice": 13150,
      "category": "fans",
      "image": "/images/prod9.jpeg",
      "discount": "15%"
  },
  {
      "id": 10,
      "name": "Super Fast Dual Option 30-Watt Fan | Orient Appliances",
      "price": 10200,
      "oldPrice": 11350,
      "category": "fans",
      "image": "/images/prod10.jpeg",
      "discount": "10%"
  },
  {
      "id": 11,
      "name": "Orient Dry Iron - OR 666 - White & Silver",
      "price": 3510,
      "oldPrice": 4000,
      "category": "Irons",
      "image": "/images/prod11.jpg",
      "discount": "13%"
  },
  {
      "id": 12,
      "name": "Megnum Black green  4 blade | Orient Appliances",
      "price": 10000,
      "oldPrice": 11350,
      "category": "fans",
      "image": "/images/prod12.jpg",
      "discount": "12%"
  },
  {
      "id": 13,
      "name": "Magnum 3 Blade 56-Inch Ceiling Fan | Orient Appliances",
      "price": 9710,
      "oldPrice": 11480,
      "category": "fans",
      "image": "/images/prod13.jpg",
      "discount": "17%"
  },
  {
      "id": 14,
      "name": "Orient Glass Hob OR-SG-201 3 Burner Orient Appliances",
      "price": 12000,
      "oldPrice": 13500,
      "category": "Stoves",
      "image": "/images/prod14.jpeg",
      "discount": "10%"
  },
  {
      "id": 15,
      "name": "Orient Glass Hob OR-SG-202 3 Burner Orient Appliances",
      "price": 12000,
      "oldPrice": 14000,
      "category": "Stoves",
      "image": "/images/prod15.jpg",
      "discount": "15%"
  },
  {
      "id": 16,
      "name": "OR-733B02 - 73CM Cast Iron Copper Burner - Black Steel Panel | Orient Appliances",
      "price": 21600,
      "oldPrice": 23200,
      "category": "Stoves",
      "image": "/images/prod16.jpg",
      "discount": "7%"
  },
  {
      "id": 17,
      "name": "ORIENT OR-733B03 CAST IRON COPPER BURNER 2 - 73 CM",
      "price": 20300,
      "oldPrice": 23500,
      "category": "Stoves",
      "image": "/images/prod17.jpg",
      "discount": "14%"
  },
  {
      "id": 18,
      "name": "ORIENT OR-733B03 CAST IRON COPPER BURNER 2 - 73 CM",
      "price": 25900,
      "oldPrice": 31500,
      "category": "Stoves",
      "image": "/images/prod18.jpg",
      "discount": "18%"
  },
  {
      "id": 19,
      "name": "ORIENT OR-733B03 CAST IRON COPPER BURNER 2 - 73 CM",
      "price": 32000,
      "oldPrice": 35500,
      "category": "Stoves",
      "image": "/images/prod19.jpg",
      "discount": "10%"
  },
  {
      "id": 20,
      "name": "Orient Hob OR-763B08 | Orient Appliances",
      "price": 21250,
      "oldPrice": 22500,
      "category": "Stoves",
      "image": "/images/prod20.jpg",
      "discount": "7%"
  },
{
  "id": 21,
  "name": "Orient Hob OR-763B08 | Orient Appliances",
  "price": 21250,
  "oldPrice":23000,
  "category": "Stoves",
  "image": "/images/prod21.jpg"
},
{
  "id": 22,
  "name": "OR-783B09 - 78CM Cast Iron Burners with Safety Device | 10MM Glass Panel | Orient Appliances",
  "price": 33200,
  "oldPrice":35000,
  "category": "Stoves",
  "image": "/images/prod22.jpg"
},
{
  "id": 23,
  "name": "OR-865B013 - Aluminum - 5 Burners - 86CM - 0.7MM Steel Cast Iron with Safety Device",
  "price": 31300,
  "oldPrice":34000,
  "category": "Stoves",
  "image": "/images/prod23.jpg"
},
{
  "id": 24,
  "name": "OR-875B012 - 87Cm 8MM Glass Copper Burner Sabaf with Safety Device",
  "price": 39900,
  "oldPrice":41000,
  "category": "Stoves",
  "image": "/images/prod24.jpg"
},
{
  "id": 25,
  "name": "Deluxe Plus 56 Ceiling Fan | Orient Appliances",
  "price": 8840,
  "oldPrice":11000,
  "category": "fans",
  "image": "/images/prod25.jpeg"
},
{
  "id": 39,
  "name": "OR-S04 - Orient 2 Burners Black Glass Hob",
  "price": 40500,
  "oldPrice":43000,
  "category": "Stoves",
  "image": "/images/prod26.jpg"
},
{
  "id": 40,
  "name": "Orient Ceiling Fan Crown 56 - Dark Wood | 220V | Energy Saver",
  "price": 9300,
  "oldPrice":12000,
  "category": "fans",
  "image": "/images/prod27.jpeg"
},
{
  "id": 26,
  "name": "Orient Electric Geyser 48 Littre | Orient Appliances",
  "price": 28000,
  "oldPrice":31000,
  "category": "geysers",
  "image": "/images/prod28.jpeg"
},
{
  "id": 27,
  "name": "Orient Electric Geyser 42 Littre | Orient Appliances",
  "price": 26500,
  "oldPrice":35000,
  "category": "geysers",
  "image": "/images/prod28.jpeg"
},
{
  "id": 28,
  "name": "Orient Electric Geyser 60 Littre | Orient Appliances",
  "price": 30000,
  "oldPrice":33000,
  "category": "geysers",
  "image": "/images/prod28.jpeg"
},
{
  "id": 29,
  "name": "Orient Electric + Gas Geyser 30 Gallon | Orient Appliances",
  "price": 50000,
  "oldPrice":53000,
  "category": "geysers",
  "image": "/images/prod29.jpeg"
},
{
  "id": 30,
  "name": "Orient Glass Hob OR-SG-302 3 Burner Orient Appliances",
  "price": 12000,
  "oldPrice":14000,
  "category": "Stoves",
  "image": "/images/prod30.jpeg"
},
{
  "id": 31,
  "name": "Orient Hob OR-ST04 | Orient Appliances",
  "price": 10000,
  "oldPrice":12500,
  "category": "Stoves",
  "image": "/images/prod31.jpeg"
},
{
  "id": 32,
  "name": "ORIENT Room Cooler OR-4500 Plus",
  "price": 32000,
  "oldPrice":35000,
  "category": "room-coolers",
  "image": "/images/prod32.jpg"
},
{
  "id": 33,
  "name": "Platinum Cream 56 Ceiling Fan - 220V | Orient Appliances",
  "price": 9030,
  "oldPrice":11000,
  "category": "fans",
  "image": "/images/prod34.jpg"
},
{
  "id": 34,
  "name": "Plasma Cream Oak 56",
  "price": 8200,
  "oldPrice":10500,
  "category": "fans",
  "image": "/images/prod35.jpeg"
},
{
  "id": 35,
  "name": "Plasma Cream Oak 56",
  "price": 7975,
  "oldPrice":9999,
  "category": "fans",
  "image": "/images/prod36.jpg"
},
{
  "id": 36,
  "name": "Stone Cream Golden 56 | Orient Appliances",
  "price": 8237,
  "oldPrice":10000,
  "category": "fans",
  "image": "/images/prod37.jpeg"
},
{
  "id": 37,
  "name": "Super Fast Dual Option 30-Watt Fan| Orient Appliances",
  "price": 10200,
  "oldPrice":12000,
  "category": "fans",
  "image": "/images/prod38.jpeg"
},  
{
  "id": 38,
  "name": "Wall Bracket Fan 18 White",
  "price": 8000,
  "oldPrice":10200,
  "category": "fans",
  "image": "/images/prod39.jpg"
}
];

// ✅ Pagination Limit (12 Products per Page)
const itemsPerPage = 12;

const Shop = ({ addToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("");

  // ✅ Extract categories dynamically & remove undefined values
  const categories = ["all", ...new Set(products.map((product) => product.category).filter(Boolean))];

  // ✅ Filter Products by Category
  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  // ✅ Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    return 0;
  });

  // ✅ Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // ✅ Get products for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto py-10 px-6">
      {/* ✅ Hero Section */}
      <div className="relative w-full h-[300px] bg-black">
        <img src="/images/fan.png" alt="Shop Banner" className="w-full h-full opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold">Shop</h1>
          <p className="mt-2 text-lg">Shop Through Our Latest And Featured Electric & Gas Appliances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        {/* ✅ Sidebar (Filters & Sorting) */}
        <div className="col-span-1 border-r pr-6">
          <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    selectedCategory === category ? "bg-red-500 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-6 mb-4">Sort by Price</h2>
          <select className="w-full border rounded-lg px-4 py-2" onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Default</option>
            <option value="price-low">Lowest Price</option>
            <option value="price-high">Highest Price</option>
          </select>
        </div>

        {/* ✅ Product Grid */}
        <div className="col-span-3">
          <h2 className="text-2xl font-bold mb-6 text-center">Shop Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative flex flex-col p-4">
                {/* ✅ Discount Badge */}
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                    {product.discount} Off
                  </div>
                )}

                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="flex-grow">
                  <img src={product.image} alt={product.name} className="w-full h-[200px] object-contain" />
                </Link>

                {/* Product Details */}
                <div className="pt-4 pb-6 text-center flex flex-col justify-between flex-grow">
                  <h3 className="font-medium text-lg min-h-[3rem]">{product.name}</h3>
                  <p className="text-gray-500 line-through text-sm">PKR {product.oldPrice}</p>
                  <p className="text-red-600 text-xl font-bold">PKR {product.price}</p>

                  {/* ✅ Add to Cart Button */}
                  <button onClick={() => addToCart(product)} className="mt-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition w-12 h-12 flex items-center justify-center mx-auto">
                    <FaShoppingCart className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-300 rounded">
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-300 rounded">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
