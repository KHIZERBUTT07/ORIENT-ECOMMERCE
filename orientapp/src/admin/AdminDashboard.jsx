import React, { useState } from "react";
import { db, storage } from "../firebaseConfig"; // Firebase Config
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    metaKeywords: "",
    description: "",
    features: "",
    specs: "",
    warranty: "",
    youtubeURL: "",
    stock: "",
    productImages: [], // ✅ Store multiple images
    bannerImage: null, // ✅ Single banner image
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    if (e.target.type === "file") {
      if (e.target.name === "productImages") {
        const files = Array.from(e.target.files); // ✅ Convert FileList to Array
        setFormData((prev) => ({
          ...prev,
          productImages: files, // ✅ Store files in state
        }));
      } else if (e.target.name === "bannerImage") {
        setFormData((prev) => ({
          ...prev,
          bannerImage: e.target.files[0], // ✅ Store single banner image
        }));
      }
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

  // ✅ Upload Images to Firebase Storage
  const uploadImages = async (files, folder) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });
    return Promise.all(uploadPromises); // ✅ Return array of image URLs
  };

  // ✅ Handle Product Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate Required Fields
    const requiredFields = [
      "productName",
      "category",
      "oldPrice",
      "discount",
      "stock",
      "description",
      "features",
      "specs",
      "warranty",
      "youtubeURL",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`⚠️ Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    try {
      setLoading(true);

      // ✅ Upload Product Images
      const productImageURLs = await uploadImages(formData.productImages, "productImages");

      // ✅ Upload Banner Image
      let bannerImageURL = "";
      if (formData.bannerImage) {
        const bannerStorageRef = ref(storage, `bannerImages/${formData.bannerImage.name}`);
        await uploadBytes(bannerStorageRef, formData.bannerImage);
        bannerImageURL = await getDownloadURL(bannerStorageRef);
      }

      // ✅ Parse Specs (if provided)
      let parsedSpecs = {};
      try {
        parsedSpecs = formData.specs ? JSON.parse(formData.specs) : {};
      } catch (error) {
        toast.error("❌ Invalid JSON in Specifications!");
        return;
      }

      // ✅ Add Product to Firestore
      const productRef = collection(db, "products");
      await addDoc(productRef, {
        productName: formData.productName,
        category: formData.category,
        subcategory: formData.subcategory || "",
        oldPrice: parseFloat(formData.oldPrice),
        discount: parseFloat(formData.discount),
        discountedPrice: parseFloat(formData.discountedPrice),
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: Array.isArray(formData.metaKeywords)
          ? formData.metaKeywords
          : formData.metaKeywords.split(",").map((keyword) => keyword.trim()),
        description: formData.description,
        features: formData.features.split("\n"), // ✅ Convert Features to Array
        specs: parsedSpecs,
        warranty: formData.warranty,
        youtubeURL: formData.youtubeURL,
        stock: parseInt(formData.stock),
        productImages: productImageURLs, // ✅ Store array of product image URLs
        bannerImage: bannerImageURL, // ✅ Store banner image URL
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
        metaKeywords: "",
        description: "",
        features: "",
        specs: "",
        warranty: "",
        youtubeURL: "",
        stock: "",
        productImages: [], // ✅ Reset product images
        bannerImage: null, // ✅ Reset banner image
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
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          >
            <option value="">Select Category</option>
            <option value="Fans">Fans</option>
            <option value="Geysers">Geysers</option>
            <option value="Irons">Irons</option>
            <option value="Hob">Hob</option>
            <option value="Range Hoods">Range Hoods</option>
          </select>
          <input
            type="text"
            name="subcategory"
            placeholder="Enter Subcategory (Optional)"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            name="oldPrice"
            placeholder="Old Price"
            value={formData.oldPrice}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={formData.discount}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            step="1"
            required
          />
          <input
            type="number"
            name="discountedPrice"
            placeholder="Discounted Price"
            value={formData.discountedPrice}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2 bg-gray-200"
          />
        </div>

        {/* ✅ SEO Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Product SEO</h3>
          <input
            type="text"
            name="metaTitle"
            placeholder="Meta Title"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="metaKeywords"
            placeholder="Meta Keywords (comma-separated)"
            value={formData.metaKeywords}
            onChange={handleKeywordsChange}
            className="w-full border p-2 rounded mb-2"
          />
        </div>

        {/* ✅ Product Details Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Product Details</h3>
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <textarea
            name="features"
            placeholder="Product Features (Each line will be a bullet point)"
            value={formData.features}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <textarea
            name="specs"
            placeholder="Product Specifications (JSON format)"
            value={formData.specs}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="text"
            name="warranty"
            placeholder="Warranty (e.g., 1 Year Brand Warranty)"
            value={formData.warranty}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="text"
            name="youtubeURL"
            placeholder="YouTube Video URL (Optional)"
            value={formData.youtubeURL}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Available"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
        </div>

        {/* ✅ Product Images Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Product Images</h3>
          <label className="block font-bold mb-1">Choose Product Images</label>
          <input
            type="file"
            name="productImages"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            multiple // ✅ Allow multiple file selection
            required
          />
          <label className="block font-bold mb-1">Choose Banner Image</label>
          <input
            type="file"
            name="bannerImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;