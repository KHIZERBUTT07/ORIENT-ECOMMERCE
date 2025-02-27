import React, { useState } from "react";
import { db, storage } from "../firebaseConfig"; // ✅ Import Firebase
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    oldPrice: "",
    discount: "",
    discountedPrice: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    description: "",
    features: "",
    specs: "",
    warranty: "",
    youtubeURL: "",
    stock: "",
    productImage: null,
    bannerImage: null,
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else if (e.target.name === "discount") {
      const discount = e.target.value;
      const discountedPrice =
        formData.oldPrice && discount
          ? (formData.oldPrice - (formData.oldPrice * discount) / 100).toFixed(2)
          : "";
      setFormData({ ...formData, discount, discountedPrice });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Handle Meta Keywords
  const handleKeywordsChange = (e) => {
    setFormData({
      ...formData,
      metaKeywords: e.target.value.split(",").map((keyword) => keyword.trim()),
    });
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

  // ✅ Handle Product Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.category || !formData.oldPrice || !formData.discount || !formData.stock || !formData.productImage || !formData.bannerImage) {
      toast.error("⚠️ Please fill all required fields & upload images!");
      return;
    }

    try {
      setLoading(true);
      const productImageURL = await uploadImage(formData.productImage, "productImages");
      const bannerImageURL = await uploadImage(formData.bannerImage, "productBanners");

      const productRef = collection(db, "products");
      await addDoc(productRef, {
        productName: formData.productName,
        category: formData.category,
        oldPrice: parseFloat(formData.oldPrice),
        discount: parseFloat(formData.discount),
        discountedPrice: parseFloat(formData.discountedPrice),
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        description: formData.description,
        features: formData.features,
        specs: formData.specs,
        warranty: formData.warranty,
        youtubeURL: formData.youtubeURL,
        stock: parseInt(formData.stock),
        productImage: productImageURL,
        bannerImage: bannerImageURL,
        timestamp: new Date(),
      });

      toast.success("✅ Product added successfully!");
      setFormData({
        productName: "",
        category: "",
        oldPrice: "",
        discount: "",
        discountedPrice: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        description: "",
        features: "",
        specs: "",
        warranty: "",
        youtubeURL: "",
        stock: "",
        productImage: null,
        bannerImage: null,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("❌ Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-red-600">Add New Product</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6 space-y-6">
        {/* ✅ Product Info Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Product Info</h3>
          <input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded mb-2" required>
            <option value="">Select Category</option>
            <option value="Fans">Fans</option>
            <option value="Geysers">Geysers</option>
            <option value="Irons">Irons</option>
            <option value="Hob">Hob</option>
            <option value="Range Hoods">Range Hoods</option>
          </select>
          <input type="number" name="oldPrice" placeholder="Old Price" value={formData.oldPrice} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="discount" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="discountedPrice" placeholder="Discounted Price" value={formData.discountedPrice} readOnly className="w-full border p-2 rounded mb-2 bg-gray-200" />
        </div>

        {/* ✅ Product SEO Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Product SEO</h3>
          <input type="text" name="metaTitle" placeholder="Meta Title" value={formData.metaTitle} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
          <textarea name="metaDescription" placeholder="Meta Description" value={formData.metaDescription} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
          <input type="text" name="metaKeywords" placeholder="Meta Keywords (comma-separated)" value={formData.metaKeywords.join(", ")} onChange={handleKeywordsChange} className="w-full border p-2 rounded mb-2" />
        </div>

        {/* ✅ Product Details Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Product Details</h3>
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
          <textarea name="features" placeholder="Features" value={formData.features} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
          <textarea name="specs" placeholder="Specifications" value={formData.specs} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
          <input type="text" name="warranty" placeholder="Warranty" value={formData.warranty} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
          <input type="text" name="youtubeURL" placeholder="YouTube Video URL" value={formData.youtubeURL} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
          <input type="number" name="stock" placeholder="Stock Available" value={formData.stock} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
          <input type="file" name="productImage" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
          <input type="file" name="bannerImage" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        </div>

        {/* ✅ Submit Button */}
        <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700">
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
