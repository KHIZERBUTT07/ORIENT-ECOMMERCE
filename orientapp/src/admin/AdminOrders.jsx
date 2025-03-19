import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config Import
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersByStaff, setOrdersByStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const customerOrders = orderList.filter((order) => order.createdBy !== "staff");
      const staffOrders = orderList.filter((order) => order.createdBy === "staff");

      setOrders(customerOrders);
      setOrdersByStaff(staffOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated!");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await deleteDoc(orderRef);
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

  if (loading) {
    return <h2 className="text-center text-gray-600 py-10">⏳ Loading Orders...</h2>;
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-red-600">Admin Orders</h2>

      {/* ✅ Orders by Staff Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center text-blue-600">Orders by Staff</h3>
        {ordersByStaff.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No orders found.</p>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 p-3">Product</th>
                  <th className="border border-gray-300 p-3">Order ID</th>
                  <th className="border border-gray-300 p-3">Customer</th>
                  <th className="border border-gray-300 p-3">Address</th>
                  <th className="border border-gray-300 p-3">Quantity</th>
                  <th className="border border-gray-300 p-3">Total (PKR)</th>
                  <th className="border border-gray-300 p-3">Payment</th>
                  <th className="border border-gray-300 p-3">Note</th>
                  <th className="border border-gray-300 p-3">Date</th>
                  <th className="border border-gray-300 p-3">Status</th>
                  <th className="border border-gray-300 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersByStaff.map((order) => (
                  <tr key={order.id} className="border border-gray-300 text-center">
                    {/* ✅ Product Name & Image */}
                    <td className="border border-gray-300 p-3 flex items-center space-x-3">
                      <img src={order.productImage || "/default-product.jpg"} alt="Product" className="w-12 h-12 object-cover rounded" />
                      <span className="text-sm font-semibold">{order.productName || "Unknown Product"}</span>
                    </td>

                    {/* ✅ Order ID */}
                    <td className="border border-gray-300 p-3 font-mono">{order.id.slice(-6)}</td>

                    {/* ✅ Customer Details */}
                    <td className="border border-gray-300 p-3">
                      <p><strong>{order.customerName}</strong></p>
                      <p className="text-sm text-gray-600">{order.customerContact}</p>
                    </td>

                    {/* ✅ Address */}
                    <td className="border border-gray-300 p-3">{order.address}, {order.customerCity}</td>

                    {/* ✅ Quantity */}
                    <td className="border border-gray-300 p-3">{order.quantity}</td>

                    {/* ✅ Total Price */}
                    <td className="border border-gray-300 p-3 font-bold text-red-600">PKR {order.total}</td>

                    {/* ✅ Payment Method */}
                    <td className="border border-gray-300 p-3">{order.paymentMethod}</td>

                    {/* ✅ Note */}
                    <td className="border border-gray-300 p-3">{order.note || "No note"}</td>

                    {/* ✅ Date */}
                    <td className="border border-gray-300 p-3">{new Date(order.date).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>

                    {/* ✅ Order Status */}
                    <td className="border border-gray-300 p-3">
                      <span className={`px-3 py-1 rounded-md text-white ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* ✅ Delete and Status Update */}
                    <td className="border border-gray-300 p-3 flex items-center space-x-3">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                      <select
                        className="border p-2 rounded"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="In Route">In Route</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Failed Delivery">Failed Delivery</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Customer Orders Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center text-green-600">Customer Orders</h3>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No orders found.</p>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 p-3">Product</th>
                  <th className="border border-gray-300 p-3">Order ID</th>
                  <th className="border border-gray-300 p-3">Customer</th>
                  <th className="border border-gray-300 p-3">Address</th>
                  <th className="border border-gray-300 p-3">Total (PKR)</th>
                  <th className="border border-gray-300 p-3">Note</th>
                  <th className="border border-gray-300 p-3">Status</th>
                  <th className="border border-gray-300 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.items?.map((item, index) => (
                    <tr key={`${order.id}-${index}`} className="border border-gray-300 text-center">
                      {/* Product Image & Name */}
                      <td className="border border-gray-300 p-3 flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <span className="text-sm font-semibold">{item.name}</span>
                      </td>
                      {/* Shortened Order ID */}
                      <td className="border border-gray-300 p-3">{order.id.slice(-6)}</td>
                      <td className="border border-gray-300 p-3">
                        <p><strong>{order.user.name}</strong></p>
                        <p className="text-sm text-gray-600">{order.user.phone}</p>
                      </td>
                      <td className="border border-gray-300 p-3">{order.user.address}, {order.user.city}</td>
                      <td className="border border-gray-300 p-3 font-bold text-red-600">{order.total}</td>
                      <td className="border border-gray-300 p-3">{order.note || "No note"}</td>
                      <td className="border border-gray-300 p-3">
                        <span className={`px-3 py-1 rounded-md text-white ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3">
                        <select
                          className="border p-2 rounded"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="In Route">In Route</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Failed Delivery">Failed Delivery</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Function to Set Color Based on Status
const getStatusColor = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-500";
    case "Shipped": return "bg-blue-500";
    case "In Route": return "bg-purple-500";
    case "Delivered": return "bg-green-500";
    case "Failed Delivery": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export default AdminOrders;
