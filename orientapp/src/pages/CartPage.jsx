import React from "react";

const CartPage = ({ cart, removeFromCart, updateQuantity }) => {
  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <p className="flex-1 ml-4">{item.name}</p>
              <p className="font-bold">PKR {item.price}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
