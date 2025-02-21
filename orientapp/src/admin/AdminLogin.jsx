import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Handle Login
  const handleLogin = (e) => {
    e.preventDefault();

    const adminEmail = "Admin786@gmail.com";
    const adminPassword = "Admin123321";

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("adminAuth", "true"); // ✅ Store login session
      toast.success("✅ Login Successful!");

      setTimeout(() => {
        navigate("/admin"); // ✅ Redirect after success
      }, 1500);
    } else {
      toast.error("❌ Invalid Credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-red-600">Admin Login</h2>

        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label className="block font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
