import React, { useState } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // ✅ Import for Redirection

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
  });

  // ✅ Shipping Charges
  const shippingCharge = 200; // Set flat rate shipping charge

  // ✅ Calculate Total Price (Including Shipping)
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = subtotal + shippingCharge; // ✅ Add shipping charge

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Order Placement
  const placeOrder = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.address || !userInfo.city) {
      toast.error("⚠️ Please fill in all required fields!");
      return;
    }

    const orderData = {
      user: userInfo,
      items: cartItems,
      subtotal,
      shippingCharge,
      total: totalPrice,
      status: "Pending",
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      toast.success("✅ Order placed successfully!");

      // ✅ Clear cart after order placement
      clearCart();

      // ✅ Redirect to Home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("❌ Failed to place order. Please try again!");
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-red-600">Checkout</h2>

      {/* ✅ Order Summary */}
      <div className="bg-gray-100 p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between border-b pb-2 mb-2">
            <p>{item.name} (x{item.quantity})</p>
            <p>PKR {item.price * item.quantity}</p>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold">
          <p>Subtotal:</p>
          <p>PKR {subtotal}</p>
        </div>
        <div className="flex justify-between text-red-600 font-bold">
          <p>Shipping:</p>
          <p>PKR {shippingCharge}</p>
        </div>
        <div className="flex justify-between text-xl font-bold text-red-600 mt-4">
          <p>Total:</p>
          <p>PKR {totalPrice}</p>
        </div>
      </div>

      {/* ✅ User Info Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-bold mb-4">Billing Details</h3>
        <input type="text" name="name" placeholder="Full Name" value={userInfo.name} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
        <input type="text" name="phone" placeholder="Phone Number" value={userInfo.phone} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
        <input type="text" name="address" placeholder="Address" value={userInfo.address} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
        <input type="text" name="city" placeholder="City" value={userInfo.city} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
        
        {/* ✅ Payment Method */}
        <div className="mt-4">
          <label className="font-bold">Payment Method</label>
          <select name="paymentMethod" value={userInfo.paymentMethod} onChange={handleChange} className="w-full border p-2 rounded mt-2">
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        {/* ✅ Place Order Button */}
        <button onClick={placeOrder} className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mt-4">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
