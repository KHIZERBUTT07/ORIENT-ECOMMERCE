import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartPage = ({ cart, removeFromCart, increaseQuantity, decreaseQuantity }) => {
  const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0);
  const shippingFee = cart.length > 0 ? 200 : 0; // ✅ Shipping Fee (200 PKR if cart is not empty)
  const overallTotal = totalPrice + shippingFee; // ✅ Overall Total

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ✅ Cart Items */}
          <div className="space-y-4">
            {cart.map((product) => (
              <div key={product.id} className="flex items-center border p-4 rounded-md shadow-sm">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-contain" />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-500">PKR {product.oldPrice}</p>
                  <p className="text-red-600 font-bold">PKR {product.price * product.quantity}</p>

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
            ))}
          </div>

          {/* ✅ Cart Summary with Shipping Fee */}
          <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <p className="text-lg">Subtotal:</p>
              <p className="text-lg font-semibold">PKR {totalPrice.toLocaleString()}</p>
            </div>

            <div className="flex justify-between mb-2">
              <p className="text-lg">Shipping Fee:</p>
              <p className="text-lg font-semibold">PKR {shippingFee.toLocaleString()}</p>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between text-xl font-bold text-red-600">
              <p>Overall Total:</p>
              <p>PKR {overallTotal.toLocaleString()}</p>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition mt-4">
              Proceed to Checkout
            </button>

            <Link to="/shop" className="block text-center text-red-500 mt-4 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
