import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SidebarCart from "./components/SidebarCart";
import Footer from "./components/Footer"; // ✅ Import Footer
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail"; // ✅ Import Product Detail Page
import AdminDashboard from "./admin/AdminDashboard";
import Checkout from "./pages/Checkout"; // ✅ Import Checkout Page
import AdminOrders from "./admin/AdminOrders";
import About from "./pages/About"; // ✅ Import About Page
import Contact from "./pages/Contact"; // ✅ Import Contact Page
import AdminLogin from "./admin/AdminLogin";
import productsData from "./data/products"; // ✅ Import mock products
import { ToastContainer, toast } from "react-toastify";

// Categories Pages Components (Each category component filters products based on category)
import ShopCategoryPage from "./pages/ShopCategoryPage";
import AdminMembership from "./admin/AdminMembership";
import Membership from "./pages/Membership";
import DealerDashboard from "./pages/DealerDashboard";
import AdminActiveProducts from "./admin/AdminActiveProducts";
import EditProduct from "./admin/EditProduct";
import AdminDeals from "./admin/AdminDeals";
import AdminBoostingPage from "./admin/AdminBoostingPage";

const App = () => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Store search query
  const [products, setProducts] = useState([]);

  // ✅ Load Products (Mock + Admin Added) from Local Storage
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || productsData;
    setProducts(storedProducts);
  }, []);

  // ✅ Load Cart from Local Storage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setCartCount(storedCart.reduce((total, item) => total + item.quantity, 0));
  }, []);

  // ✅ Function to add item to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
  
    // ✅ Ensure valid price values to prevent NaN errors
    const oldPrice = product.oldPrice ? parseFloat(product.oldPrice) : 0;
    const discount = product.discount ? parseFloat(product.discount) : 0;
    const discountedPrice = oldPrice - (oldPrice * discount) / 100; // ✅ Calculate discounted price
  
    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
          oldPrice,
          discountedPrice: isNaN(discountedPrice) ? oldPrice : discountedPrice, // ✅ Prevent NaN
        },
      ];
    }
  
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    setIsCartOpen(true);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // ✅ Show toast message with product name
    if (!existingProduct) {
      toast.success(`${product.productName} added to cart!`);
    } else {
      toast.info(`${product.productName} quantity increased!`);
    }
  };
  

  // ✅ Function to remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Function to increase product quantity
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Function to decrease product quantity
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Protected Route Component (For Admin Pages)
  const ProtectedRoute = ({ element }) => {
    const isAdminAuthenticated = localStorage.getItem("adminAuth") === "true";
    return isAdminAuthenticated ? element : <Navigate to="/admin/login" />;
  };

  return (
    <>
      {/* ✅ ToastContainer for toast notifications */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ✅ Navbar with Search & Cart */}
      <Navbar
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        setSearchQuery={setSearchQuery} // ✅ Pass search query state
      />

      {/* ✅ Sidebar Cart */}
      <SidebarCart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
      />

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} searchQuery={searchQuery} />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              removeFromCart={removeFromCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />

        {/* ✅ Product Detail Page */}
        <Route path="/product/:productId" element={<ProductDetail addToCart={addToCart} />} />

        {/* ✅ Checkout Page */}
        <Route path="/checkout" element={<Checkout cartItems={cart} clearCart={() => setCart([])} />} />

        {/* ✅ About Page */}
        <Route path="/about" element={<About />} />

        {/* ✅ Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* ✅ Membership Page */}
        <Route path="/membership" element={<Membership />} />

        {/* ✅ Dealers Page */}
        <Route path="/dealer-dashboard" element={<DealerDashboard />} />

        {/* ✅ Admin Routes (Protected) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<AdminOrders />} />} />
        <Route path="/admin/memberships" element={<ProtectedRoute element={<AdminMembership />} />} />
        <Route path="/admin/deals" element={<ProtectedRoute element={<AdminDeals />} />} />
        <Route path="/admin/active-products" element={<AdminActiveProducts />} />
        <Route path="/admin/edit-product/:productId" element={<EditProduct />} />
        {/* ✅ Admin Route for Managing Top Selling Products */}
        <Route path="/admin/boosting" element={<AdminBoostingPage />} />

        {/* ✅ Category Routes */}
        <Route path="/shop/category/:category" element={<ShopCategoryPage products={products} addToCart={addToCart} />} />
      </Routes>

      {/* ✅ Footer */}
      <Footer />
    </>
  );
};

export default App;
