import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig"; // ✅ Firebase
import { collection, getDocs } from "firebase/firestore";
import { FaShoppingCart } from "react-icons/fa";
import { MdPayment } from "react-icons/md"; // ✅ Buy Now Icon

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams();
  const navigate = useNavigate(); // ✅ For redirecting on "Buy Now"
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ Fetch all products from Firebase
        const querySnapshot = await getDocs(collection(db, "products"));
        const firebaseProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ Find Product by ID
        const foundProduct = firebaseProducts.find((p) => p.id === productId);

        if (foundProduct) {
          setProduct(foundProduct);

          // ✅ Fetch Related Products (Same Category)
          const related = firebaseProducts
            .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 2); // Show only 2 related products
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <h2 className="text-center text-gray-600 py-10">⏳ Loading Product...</h2>;
  }

  if (!product) {
    return <h2 className="text-center text-red-600 py-10">❌ Product Not Found</h2>;
  }

  return (
    <div className="container mx-auto py-10 px-6">
      {/* ✅ Product Banner */}
      <div className="relative w-full h-[300px] bg-black">
        <img
          src={product.bannerImage || "/images/default-banner.jpg"}
          alt={product.productName}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold">{product.productName}</h1>
          <p className="mt-2 text-lg">Home · Shop · {product.productName}</p>
        </div>
      </div>

      {/* ✅ Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* Product Image */}
        <img
          src={product.productImage || "/images/default-product.jpg"}
          alt={product.productName}
          className="w-full h-[400px] object-contain border shadow-lg"
        />

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold">{product.productName}</h2>
            <p className="text-lg text-gray-600 mt-4">{product.description}</p>
            <p className="text-red-600 text-2xl font-bold mt-4">PKR {product.discountedPrice?.toLocaleString()}</p>
            <p className="text-gray-500 line-through">Old Price: PKR {product.oldPrice?.toLocaleString()}</p>
            <p className="mt-4 text-green-600 font-semibold">✅ In Stock: {product.stock}</p>
            <p className="text-gray-500">
              📦 Category: {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "N/A"}
            </p>
          </div>

          {/* ✅ Buttons: Add to Cart & Buy Now */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <FaShoppingCart />
              Add to Cart
            </button>

            {/* ✅ FIXED: "Buy Now" Button Passes Product Data to Checkout */}
            <button
              onClick={() => navigate("/checkout", { state: { product } })}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <MdPayment />
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Features Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-red-600">🔹 Features</h2>
        {Array.isArray(product.features) && product.features.length > 0 ? (
          <ul className="text-gray-600 list-disc list-inside">
            {product.features.map((feature, index) => (
              <li key={index} className="mt-2">✔️ {feature}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No features listed.</p>
        )}
      </div>

      {/* ✅ Specifications Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-red-600">🔸 Specifications</h2>
        {product.specs && typeof product.specs === "object" && Object.keys(product.specs).length > 0 ? (
          <ul className="text-gray-600 list-disc list-inside">
            {Object.entries(product.specs).map(([key, value]) => (
              <li key={key} className="capitalize">
                <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {value}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No specifications available.</p>
        )}
      </div>

      {/* ✅ Warranty Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-red-600">🔧 Warranty</h2>
        <p className="text-gray-600">{product.warranty ? `${product.warranty} Years Brand Warranty` : "No Warranty Provided"}</p>
      </div>

      {/* ✅ YouTube Video Section */}
      {product.youtubeVideoURL && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-red-600">🎥 Product Video</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${product.youtubeVideoURL.split("v=")[1]}`}
              title="YouTube Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      )}

      {/* ✅ Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-red-600">🛍️ Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition relative flex flex-col p-4">
                {relatedProduct.discount && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                    {relatedProduct.discount} % OFF
                  </div>
                )}

                <Link to={`/product/${relatedProduct.id}`} className="flex-grow">
                  <img
                    src={relatedProduct.productImage || "/images/default-product.jpg"}
                    alt={relatedProduct.productName}
                    className="w-full h-[200px] object-contain"
                  />
                </Link>

                <div className="pt-4 pb-6 text-center flex flex-col justify-between flex-grow">
                  <h3 className="font-medium text-lg min-h-[3rem]">{relatedProduct.productName}</h3>
                  <p className="text-gray-500 line-through text-sm">PKR {relatedProduct.oldPrice?.toLocaleString()}</p>
                  <p className="text-red-600 text-xl font-bold">PKR {relatedProduct.discountedPrice?.toLocaleString()}</p>

                  {/* ✅ Add to Cart Button */}
                  <button
                    onClick={() => addToCart(relatedProduct)}
                    className="mt-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition w-12 h-12 flex items-center justify-center mx-auto"
                  >
                    <FaShoppingCart className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;