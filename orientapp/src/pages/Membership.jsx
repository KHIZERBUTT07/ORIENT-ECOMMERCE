import React, { useState } from "react";
import { db, storage } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Membership = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dealerName: "",
    phone: "",
    email: "",
    shopPic: null,
    shopCard: null,
  });

  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState(false); // ✅ Toggle for Dealer Login
  const [dealerId, setDealerId] = useState("");
  const [dealerPassword, setDealerPassword] = useState("");

  // ✅ Handle Input Change
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Upload Image to Firebase Storage
  const uploadImage = async (file, folder) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // ✅ Handle Membership Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dealerName || !formData.phone || !formData.email || !formData.shopPic || !formData.shopCard) {
      toast.error("⚠️ Please fill in all fields and upload images before submitting!");
      return;
    }

    try {
      setLoading(true);

      const shopPicURL = await uploadImage(formData.shopPic, "shopPictures");
      const shopCardURL = await uploadImage(formData.shopCard, "shopCards");

      const membershipRef = collection(db, "membershipRequests");
      await addDoc(membershipRef, {
        dealerName: formData.dealerName,
        phone: formData.phone,
        email: formData.email,
        shopPic: shopPicURL,
        shopCard: shopCardURL,
        status: "Pending",
        timestamp: new Date(),
      });

      toast.success("✅ Membership request submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting membership:", error);
      toast.error("❌ Failed to submit membership request!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Dealer Login
  const handleDealerLogin = async (e) => {
    e.preventDefault();

    try {
      const querySnapshot = await getDocs(collection(db, "membershipRequests"));
      const members = querySnapshot.docs.map((doc) => doc.data());

      const dealer = members.find(
        (m) => m.dealerId === dealerId && m.dealerPassword === dealerPassword && m.status === "Accepted"
      );

      if (dealer) {
        toast.success("✅ Login Successful! Redirecting...");
        setTimeout(() => {
          navigate("/dealer-dashboard"); // ✅ Redirect to Dealer Dashboard
        }, 2000);
      } else {
        toast.error("❌ Invalid Dealer ID or Password!");
      }
    } catch (error) {
      console.error("Error verifying dealer:", error);
      toast.error("❌ Failed to login. Try again!");
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-red-600">Dealership Registration</h2>

      {loginMode ? (
        /* ✅ Dealer Login Form */
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold text-center text-gray-700">Dealer Login</h3>
          <input
            type="text"
            placeholder="Enter Dealer ID"
            value={dealerId}
            onChange={(e) => setDealerId(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={dealerPassword}
            onChange={(e) => setDealerPassword(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleDealerLogin}
            className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mt-4"
          >
            Login
          </button>
          <button
            onClick={() => setLoginMode(false)}
            className="w-full text-red-600 p-3 mt-2"
          >
            Back to Registration
          </button>
        </div>
      ) : (
        /* ✅ Membership Registration Form */
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6">
          <input type="text" name="dealerName" placeholder="Dealer Name" value={formData.dealerName} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />

          <div className="mb-2">
            <label className="block font-bold mb-1">Upload Shop Picture</label>
            <input type="file" name="shopPic" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-2">
            <label className="block font-bold mb-1">Upload Shop Card</label>
            <input type="file" name="shopCard" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mt-4 flex items-center justify-center" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}

      {/* ✅ Already a Dealer Button */}
      {!loginMode && (
        <button
          onClick={() => setLoginMode(true)}
          className="w-full bg-gray-300 text-red-600 p-3 rounded-lg mt-4"
        >
          Already a Dealer? Login
        </button>
      )}
    </div>
  );
};

export default Membership;
