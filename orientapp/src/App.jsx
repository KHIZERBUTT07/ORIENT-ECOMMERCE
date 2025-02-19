import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SidebarCart from "./components/SidebarCart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";

const App = () => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    alert(`${product.name} has been added to your cart!`);

    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    setCartCount(updatedCart.length);
    setIsCartOpen(true); // ✅ Open Sidebar Cart after adding

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <>
      <Navbar cartCount={cartCount} setIsCartOpen={setIsCartOpen} />
      <SidebarCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} cart={cart} setCart={setCart} />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
      </Routes>
    </>
  );
};

export default App;
