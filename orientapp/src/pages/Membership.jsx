import React, { useState } from "react";
import { db, storage } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const Membership = () => {
  const [formData, setFormData] = useState({
    dealerName: "",
    phone: "",
    email: "",
    shopPic: null, // ✅ File instead of URL
    shopCard: null, // ✅ File instead of URL
  });

  const [loading, setLoading] = useState(false); // ✅ Loading state

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

    // ✅ Validation to ensure all fields are filled
    if (!formData.dealerName || !formData.phone || !formData.email || !formData.shopPic || !formData.shopCard) {
      toast.error("⚠️ Please fill in all fields and upload images before submitting!");
      return;
    }

    try {
      setLoading(true); // ✅ Start loading animation

      // ✅ Upload Images to Firebase Storage
      const shopPicURL = await uploadImage(formData.shopPic, "shopPictures");
      const shopCardURL = await uploadImage(formData.shopCard, "shopCards");

      // ✅ Store Membership Data in Firestore
      const membershipRef = collection(db, "membershipRequests");
      await addDoc(membershipRef, {
        dealerName: formData.dealerName,
        phone: formData.phone,
        email: formData.email,
        shopPic: shopPicURL,
        shopCard: shopCardURL,
        status: "Pending", // Default status
        timestamp: new Date(),
      });

      toast.success("✅ Membership request submitted successfully!");

      // ✅ Refresh the page after submission
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting membership:", error);
      toast.error("❌ Failed to submit membership request!");
    } finally {
      setLoading(false); // ✅ Stop loading animation
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-red-600">Membership Registration</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6">
        <input type="text" name="dealerName" placeholder="Dealer Name" value={formData.dealerName} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />

        {/* ✅ Shop Picture Upload */}
        <div className="mb-2">
          <label className="block font-bold mb-1">Upload Shop Picture</label>
          <input type="file" name="shopPic" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        {/* ✅ Shop Card Upload */}
        <div className="mb-2">
          <label className="block font-bold mb-1">Upload Shop Card</label>
          <input type="file" name="shopCard" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        {/* ✅ Submit Button with Loading Indicator */}
        <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mt-4 flex items-center justify-center" disabled={loading}>
          {loading ? <img src="/images/LoaderGif.gif" alt="Loading..." className="w-6 h-6 mr-2" /> : null}
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default Membership;
