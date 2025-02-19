import React from "react";
import { FaTimes, FaTrash } from "react-icons/fa";

const SidebarCart = ({ isCartOpen, setIsCartOpen, cart, setCart }) => {
  // Function to remove product from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} z-50`}>
      {/* Cart Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Shopping Cart</h2>
        <button onClick={() => setIsCartOpen(false)}>
          <FaTimes className="text-gray-600 hover:text-red-600 text-xl" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[75vh]">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        ) : (
          cart.map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b pb-3">
              {/* Product Image */}
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />

              {/* Product Details */}
              <div className="flex-1 ml-3">
                <h3 className="text-sm font-semibold">{product.name}</h3>
                <p className="text-red-600 font-bold">PKR {product.price.toLocaleString()}</p>
              </div>

              {/* Delete Button (Removes Product from Cart) */}
              <button onClick={() => removeFromCart(product.id)} className="text-red-600 hover:text-red-800">
                <FaTrash className="text-lg" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* View Cart Button */}
      {cart.length > 0 && (
        <div className="p-4 border-t">
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-full bg-red-600 text-white py-2 rounded-lg text-center font-semibold hover:bg-red-700 transition"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarCart;
