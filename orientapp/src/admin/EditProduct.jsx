import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    image: null, // File input for image
    imageUrl: "", // Display current image
  });

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
          setUpdatedData({
            name: docSnap.data().name,
            price: docSnap.data().price,
            discount: docSnap.data().discount,
            stock: docSnap.data().stock,
            category: docSnap.data().category,
            imageUrl: docSnap.data().image, // Load existing image URL
          });
        } else {
          toast.error("Product not found!");
          navigate("/admin/active-products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("❌ Error fetching product details!");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setUpdatedData({ ...updatedData, image: e.target.files[0] });
    }
  };

  // ✅ Upload Image to Firebase Storage
  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `productImages/${file.name}`);
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

  // ✅ Handle Product Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = updatedData.imageUrl;

      // ✅ Upload new image if changed
      if (updatedData.image) {
        imageUrl = await uploadImage(updatedData.image);
      }

      // ✅ Update Firestore Product Document
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        name: updatedData.name,
        price: parseFloat(updatedData.price),
        discount: parseFloat(updatedData.discount),
        stock: parseInt(updatedData.stock, 10),
        category: updatedData.category,
        image: imageUrl,
      });

      toast.success("✅ Product Updated Successfully!");
      navigate("/admin/active-products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("❌ Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <h2 className="text-center text-gray-600 py-10">⏳ Loading product details...</h2>;
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-red-600">Edit Product</h2>

      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-md mt-6">
        <label className="block font-bold">Product Name:</label>
        <input
          type="text"
          name="name"
          value={updatedData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          required
        />

        <label className="block font-bold">Price (PKR):</label>
        <input
          type="number"
          name="price"
          value={updatedData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          required
        />

        <label className="block font-bold">Discount (%):</label>
        <input
          type="number"
          name="discount"
          value={updatedData.discount}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
        />

        <label className="block font-bold">Stock Quantity:</label>
        <input
          type="number"
          name="stock"
          value={updatedData.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          required
        />

        <label className="block font-bold">Category:</label>
        <input
          type="text"
          name="category"
          value={updatedData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          required
        />

        <label className="block font-bold">Current Image:</label>
        <img src={updatedData.imageUrl} alt="Product" className="w-32 h-32 object-cover mb-2" />

        <label className="block font-bold">Upload New Image:</label>
        <input type="file" onChange={handleImageChange} className="w-full border p-2 rounded mb-2" />

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mt-4"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
