import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config Import
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orderList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Handle Status Update
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // ✅ Update UI Immediately
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

  if (loading) {
    return <h2 className="text-center text-gray-600 py-10">⏳ Loading Orders...</h2>;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-10">
      <h2 className="text-3xl font-bold text-center text-red-600">Admin Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          {/* ✅ Desktop View - Table Format (Only for screens larger than 1023px) */}
          <div className="hidden lg:block">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3">Product</th>
                  <th className="border border-gray-300 p-3">Order ID</th>
                  <th className="border border-gray-300 p-3">Customer</th>
                  <th className="border border-gray-300 p-3">Address</th>
                  <th className="border border-gray-300 p-3">Total (PKR)</th>
                  <th className="border border-gray-300 p-3">Status</th>
                  <th className="border border-gray-300 p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.items.map((item, index) => (
                    <tr key={`${order.id}-${index}`} className="border border-gray-300">
                      {/* ✅ Product Image & Name */}
                      <td className="border border-gray-300 p-3 flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <span className="text-sm font-semibold">{item.name}</span>
                      </td>
                      {/* ✅ Shortened Order ID */}
                      <td className="border border-gray-300 p-3">{order.id.slice(-6)}</td>
                      <td className="border border-gray-300 p-3">
                        <p><strong>{order.user.name}</strong></p>
                        <p className="text-sm text-gray-600">{order.user.phone}</p>
                      </td>
                      <td className="border border-gray-300 p-3">{order.user.address}, {order.user.city}</td>
                      <td className="border border-gray-300 p-3 font-bold text-red-600">{order.total}</td>
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

          {/* ✅ Mobile View - Card Format (Visible up to 1023px width) */}
          <div className="block lg:hidden flex flex-col space-y-4 mt-4">
            {orders.map((order) =>
              order.items.map((item, index) => (
                <div key={`${order.id}-${index}`} className="border p-4 rounded-lg shadow-md bg-white">
                  {/* ✅ Product Image & Name */}
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <span className="text-lg font-semibold">{item.name}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-700 mt-3">Order ID: {order.id.slice(-6)}</h3>
                  <p className="text-gray-600"><strong>Customer:</strong> {order.user.name} ({order.user.phone})</p>
                  <p className="text-gray-600"><strong>Address:</strong> {order.user.address}, {order.user.city}</p>
                  <p className="text-gray-700 font-semibold mt-2">Total: <span className="text-red-600">PKR {order.total}</span></p>

                  {/* ✅ Order Status Badge */}
                  <div className="flex items-center mt-2">
                    <span className={`px-3 py-1 rounded-md text-white ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* ✅ Order Status Dropdown */}
                  <div className="mt-3">
                    <label className="block text-gray-600 font-semibold mb-1">Update Status:</label>
                    <select
                      className="border p-2 rounded w-full"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Route">In Route</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Failed Delivery">Failed Delivery</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
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
