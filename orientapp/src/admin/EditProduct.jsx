import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    subcategory: "",
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
  });

  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState([]); // ✅ Store new images to be added
  const [removedImages, setRemovedImages] = useState([]); // ✅ Track removed images

  // ✅ Fetch Existing Product Data and Pre-Fill Form
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        toast.error("Product ID is missing");
        navigate("/admin/active-products");
        return;
      }

      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setFormData({
            ...productData,
            metaKeywords: productData.metaKeywords ? productData.metaKeywords.join(", ") : "",
            features: productData.features ? productData.features.join("\n") : "",
            specs: productData.specs ? JSON.stringify(productData.specs, null, 2) : "",
            productImages: productData.productImages || [], // ✅ Load existing images
          });
        } else {
          toast.error("Product not found");
          navigate("/admin/active-products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount") {
      const discount = value;
      const discountedPrice =
        formData.oldPrice && discount
          ? (formData.oldPrice - (formData.oldPrice * discount) / 100).toFixed(2)
          : "";
      setFormData({ ...formData, discount, discountedPrice });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Handle Image Selection (For Adding New Images)
 
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  // Create preview URLs for the new images
  const previewImages = files.map((file) => URL.createObjectURL(file));

  // Update the state to include both existing and new preview images
  setNewImages(files); // Store the actual files for later upload
  setFormData((prevFormData) => ({
    ...prevFormData,
    productImages: [...prevFormData.productImages, ...previewImages], // Add preview URLs
  }));
};
  // ✅ Handle Removing Existing Images
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.productImages];
    const removedImage = updatedImages.splice(index, 1);
    setRemovedImages([...removedImages, removedImage[0]]); // Store removed image URL
    setFormData({ ...formData, productImages: updatedImages });
  };

  // ✅ Upload New Images to Firebase Storage
  const uploadImages = async (images) => {
    const uploadedImageUrls = [];

    for (const image of images) {
      const storageRef = ref(storage, `productImages/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedImageUrls.push(downloadURL);
            resolve();
          }
        );
      });
    }

    return uploadedImageUrls;
  };

  // ✅ Handle Product Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.category || !formData.oldPrice || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    let parsedSpecs = {};
    try {
      parsedSpecs = JSON.parse(formData.specs || "{}");
    } catch (error) {
      toast.error("Invalid JSON format in Specifications");
      return;
    }

    try {
      setLoading(true);
      const productRef = doc(db, "products", productId);

      // ✅ Upload new images if any
      let updatedImages = [...formData.productImages];
      if (newImages.length > 0) {
        const newImageUrls = await uploadImages(newImages);
        updatedImages = [...updatedImages, ...newImageUrls]; // Append new images
      }

      await updateDoc(productRef, {
        productName: formData.productName,
        category: formData.category,
        subcategory: formData.subcategory || "",
        oldPrice: parseFloat(formData.oldPrice),
        discount: parseFloat(formData.discount),
        discountedPrice: parseFloat(formData.discountedPrice),
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords.split(",").map((kw) => kw.trim()),
        description: formData.description,
        features: formData.features.split("\n"),
        specs: parsedSpecs,
        warranty: formData.warranty,
        youtubeURL: formData.youtubeURL,
        stock: parseInt(formData.stock),
        productImages: updatedImages, // ✅ Update images
        timestamp: new Date(),
      });

      toast.success("✅ Product updated successfully!");
      navigate("/admin/active-products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("❌ Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-blue-600">Edit Product</h2>

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
            autoFocus
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
            placeholder="Subcategory"
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
            required
          />
          <input
            type="number"
            name="discountedPrice"
            placeholder="Discounted Price"
            value={formData.discountedPrice}
            readOnly
            className="w-full border p-2 rounded mb-2 bg-gray-200"
          />
        </div>

        {/* ✅ Product SEO Section */}
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
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
        </div>

        {/* ✅ Product Details Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Product Details</h3>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            name="features"
            placeholder="Features (Each line will be a bullet point)"
            value={formData.features}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            name="specs"
            placeholder="Specifications (JSON format)"
            value={formData.specs}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            name="warranty"
            placeholder="Warranty"
            value={formData.warranty}
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

        <div>
  <h3 className="text-xl font-bold mb-2">Product Images</h3>

  {/* ✅ Display Existing and New Preview Images */}
  <div className="flex flex-wrap gap-2">
    {formData.productImages.map((image, index) => (
      <div key={index} className="relative">
        <img
          src={image}
          alt={`Product ${index + 1}`}
          className="w-20 h-20 object-cover rounded border"
        />
        <button
          type="button"
          className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded"
          onClick={() => handleRemoveImage(index)}
        >
          ❌
        </button>
      </div>
    ))}
  </div>

  <label className="block font-bold mt-2">Add More Images</label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageChange}
    className="w-full border p-2 rounded"
  />
</div>;
        {/* ✅ Form Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/active-products")}
            className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;