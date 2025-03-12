import React from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";

const SidebarCart = ({ isCartOpen, setIsCartOpen, cart, removeFromCart, increaseQuantity, decreaseQuantity }) => {
  return (
    <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 z-50`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <button onClick={() => setIsCartOpen(false)} className="text-red-600">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[70vh]">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        ) : (
          cart.map((product) => (
            <div key={product.id} className="flex justify-between items-center border p-3 rounded-md shadow-sm">
           <img
  src={product.image || product.productImage || "/images/default-product.jpg"} // ✅ Fix: Check both image properties
  alt={product.productName}
  className="w-16 h-16 object-contain"
/>


              <div className="flex-1 ml-4">
                <h3 className="text-sm font-semibold">{product.productName}</h3> {/* ✅ Use productName */}
                <p className="text-red-600 font-bold">
                  PKR {(product.discountedPrice * product.quantity).toFixed(2)} {/* ✅ Use discountedPrice */}
                </p>

                {/* ✅ Quantity Controls */}
                <div className="flex items-center mt-2">
                  <button onClick={() => decreaseQuantity(product.id)} className="text-red-600 p-1">
                    <FaMinus />
                  </button>
                  <span className="px-3">{product.quantity}</span>
                  <button onClick={() => increaseQuantity(product.id)} className="text-red-600 p-1">
                    <FaPlus />
                  </button>
                </div>
              </div>
              <button onClick={() => removeFromCart(product.id)} className="text-red-600 hover:text-red-800">
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4">
          <Link to="/cart">
            <button onClick={() => setIsCartOpen(false)} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
              View Cart
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SidebarCart; 