import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const OrdersByStaff = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    productId: "",
    productName: "",
    productImage: "",
    customerName: "",
    customerContact: "",
    customerCity: "",
    address: "",
    paymentMethod: "",
    note: "",
    quantity: 1, // Default to 1 as a starting quantity
    total: "", // Empty initially, for manual entry of total
  });

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find((product) => product.id === selectedProductId);

    if (selectedProduct) {
      setOrderDetails({
        ...orderDetails,
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        productImage: selectedProduct.productImages && selectedProduct.productImages[0] || "/default-product.jpg", // Get the first image URL from the array or use default image
      });
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setOrderDetails({
        ...orderDetails,
        quantity: newQuantity,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderDetails.productId || !orderDetails.total || orderDetails.total <= 0) {
      toast.error("Please fill all the required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      // Add order to Firestore
      await addDoc(collection(db, "orders"), {
        ...orderDetails,
        date: new Date().toISOString(),
        status: "Pending", // Default order status is 'Pending'
        createdBy: "staff", // Mark the order as staff created
      });
      toast.success("Order added successfully!");

      // Reset order details after successful order submission
      setOrderDetails({
        productId: "",
        productName: "",
        productImage: "",
        customerName: "",
        customerContact: "",
        customerCity: "",
        address: "",
        paymentMethod: "",
        note: "",
        quantity: 1, // Reset quantity to 1
        total: "", // Reset total
      });
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to add order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Order By Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Selection */}
        <div>
          <label htmlFor="productId" className="block text-gray-700">Select Product</label>
          <select
            id="productId"
            name="productId"
            value={orderDetails.productId}
            onChange={handleProductChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.productName}</option>
            ))}
          </select>
        </div>

        {/* Show Product Image After Selection */}
        {orderDetails.productImage && (
          <div className="flex justify-center my-4">
            <img
              src={orderDetails.productImage}
              alt="Selected Product"
              className="w-24 h-24 object-cover rounded shadow-md"
            />
          </div>
        )}

        {/* Customer details */}
        <div>
          <label htmlFor="customerName" className="block text-gray-700">Customer Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={orderDetails.customerName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Customer contact */}
        <div>
          <label htmlFor="customerContact" className="block text-gray-700">Customer Contact</label>
          <input
            type="text"
            id="customerContact"
            name="customerContact"
            value={orderDetails.customerContact}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Address details */}
        <div>
          <label htmlFor="address" className="block text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={orderDetails.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-gray-700">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={orderDetails.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-gray-700">Note</label>
          <textarea
            id="note"
            name="note"
            value={orderDetails.note}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={orderDetails.quantity}
            onChange={handleQuantityChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="1"
            required
          />
        </div>

        {/* Total Price (Manually editable) */}
        <div>
          <label htmlFor="total" className="block text-gray-700">Total (PKR)</label>
          <input
            type="number"
            id="total"
            name="total"
            value={orderDetails.total}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md" disabled={loading}>
          {loading ? "Adding Order..." : "Add Order"}
        </button>
      </form>
    </div>
  );
};

export default OrdersByStaff;
