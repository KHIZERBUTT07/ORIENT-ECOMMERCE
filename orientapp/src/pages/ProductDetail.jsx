import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { FaShoppingCart } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          setProduct(null); // Product not found
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <h2 className="text-center text-gray-600 py-10">⏳ Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center text-red-600 py-10">❌ Product Not Found</h2>;
  }

  return (
    <div>
      {/* ✅ Product Banner */}
      <div className="relative w-full h-[300px] bg-black">
        <img src={product.banner} alt={product.name} className="w-full h-full object-cover opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-lg">Home · Shop · {product.name}</p>
        </div>
      </div>

      {/* ✅ Product Details Section */}
      <div className="container mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <img src={product.image} alt={product.name} className="w-full h-[400px] object-contain border shadow-lg" />

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-lg text-gray-600 mt-4">{product.description}</p>
            <p className="text-red-600 text-2xl font-bold mt-4">PKR {product.price.toLocaleString()}</p>
            <p className="text-gray-500 line-through">Old Price: PKR {product.oldPrice?.toLocaleString()}</p>
            {product.discount && <p className="text-green-600 font-semibold">💰 {product.discount} OFF</p>}

            <p className="mt-4 text-green-600 font-semibold">✅ In Stock</p>
            <p className="text-gray-500">📦 Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
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

            <Link
              to={`/checkout?product=${productId}`}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <MdPayment />
              Buy Now
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Features Section */}
      <div className="container mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">🔹 Features</h2>
        {product.features && product.features.length > 0 ? (
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
      <div className="container mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">🔸 Specifications</h2>
        {product.specs ? (
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
      <div className="container mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600">🔧 Warranty</h2>
        <p className="text-gray-600">{product.warranty ? `${product.warranty} Years Brand Warranty` : "No Warranty Provided"}</p>
      </div>

      {/* ✅ Video Section */}
      {product.video && (
        <div className="container mx-auto py-10 px-6">
          <h2 className="text-2xl font-bold mb-6 text-red-600">🎥 Product Video</h2>
          <iframe
            width="100%"
            height="400"
            src={product.video}
            title={product.name}
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
