import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import for Navigation & Location

const Checkout = ({ cartItems, clearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
    note: "",
  });

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Free Shipping Applied
  const shippingCharge = 0; // ✅ Free shipping

  // ✅ Calculate Total Price
  useEffect(() => {
    if (location.state?.product) {
      setCheckoutItems([{ ...location.state.product, quantity: 1 }]); // ✅ Direct Buy Now
    } else if (cartItems.length > 0) {
      setCheckoutItems(cartItems); // ✅ Cart Checkout
    }
  }, [location.state, cartItems]);

  // ✅ Calculate Subtotal Using **Discounted Price**
  const subtotal = checkoutItems.reduce((total, item) => total + (item.discountedPrice || item.price) * item.quantity, 0);
  const totalPrice = subtotal + shippingCharge;

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

    setLoading(true);

    const orderData = {
      user: userInfo,
      items: checkoutItems,
      subtotal,
      shippingCharge,
      total: totalPrice,
      status: "Pending",
      timestamp: new Date(),
      note: userInfo.note,
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      toast.success("✅ Order placed successfully!");

      // ✅ Clear cart if the purchase was from the cart
      if (!location.state || !location.state.product) {
        clearCart();
      }

      // ✅ Redirect to Home after 2 seconds
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("❌ Failed to place order. Please try again!");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6 relative">
      <h2 className="text-3xl font-bold text-center text-red-600">Checkout</h2>

      {/* ✅ Order Summary */}
      <div className="bg-gray-100 p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {checkoutItems.map((item, index) => (
          <div key={index} className="flex justify-between border-b pb-2 mb-2">
            <p>{item.productName} (x{item.quantity})</p>
            <p>PKR {((item.discountedPrice || item.price) * item.quantity).toLocaleString()}</p>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold">
          <p>Subtotal:</p>
          <p>PKR {subtotal.toLocaleString()}</p>
        </div>
        <div className="flex justify-between text-green-600 font-bold">
          <p>Shipping:</p>
          <p>FREE</p>
        </div>
        <div className="flex justify-between text-xl font-bold text-red-600 mt-4">
          <p>Total:</p>
          <p>PKR {totalPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* ✅ User Info Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-bold mb-4">Billing Details</h3>
        <input type="text" name="name" placeholder="Full Name" value={userInfo.name} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="text" name="phone" placeholder="Phone Number" value={userInfo.phone} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="text" name="address" placeholder="Address" value={userInfo.address} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="text" name="city" placeholder="City" value={userInfo.city} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />

        {/* ✅ Note Section */}
        <div className="mt-4">
          <label className="font-bold">Additional Notes (Optional)</label>
          <textarea
            name="note"
            placeholder="Add any special instructions or notes..."
            value={userInfo.note}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-2"
            rows="3"
          />
        </div>

        {/* ✅ Payment Method */}
        <div className="mt-4">
          <label className="font-bold">Payment Method</label>
          <select name="paymentMethod" value={userInfo.paymentMethod} onChange={handleChange} className="w-full border p-2 rounded mt-2">
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        {/* ✅ Place Order Button */}
        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mt-4 flex justify-center items-center"
        >
          {loading ? (
            <img src="/images/LoadingGif.gif" alt="Loading..." className="w-6 h-6" />
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
