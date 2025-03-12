import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const AdminBoostingPage = () => {
  const [productForm, setProductForm] = useState({
    productName: "",
    price: "",
    oldPrice: "",
    discount: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState([]);

  // ✅ Fetch Existing Top-Selling Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "topSellingProducts"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopProducts(productList);
      } catch (error) {
        console.error("Error fetching top products:", error);
        toast.error("❌ Failed to fetch top-selling products.");
      }
    };
    fetchProducts();
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setProductForm({ ...productForm, image: e.target.files[0] });
    } else {
      setProductForm({ ...productForm, [e.target.name]: e.target.value });
    }
  };

  // ✅ Upload Image to Firebase Storage
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `topSellingImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
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
    if (!productForm.productName || !productForm.price || !productForm.oldPrice || !productForm.image) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const imageURL = await uploadImage(productForm.image);

      await addDoc(collection(db, "topSellingProducts"), {
        productName: productForm.productName,
        price: parseFloat(productForm.price),
        oldPrice: parseFloat(productForm.oldPrice),
        discount: productForm.discount,
        image: imageURL,
        timestamp: new Date(),
      });

      toast.success("✅ Top-Selling Product Added Successfully!");
      setProductForm({ productName: "", price: "", oldPrice: "", discount: "", image: null });
    } catch (error) {
      toast.error("❌ Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "topSellingProducts", id));
      setTopProducts((prev) => prev.filter((product) => product.id !== id));
      toast.success("✅ Product Removed!");
    } catch (error) {
      toast.error("❌ Failed to remove product.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-red-600 text-center">🔥 Manage Top-Selling Products</h2>

      {/* ✅ Add Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mt-6">
        <input type="text" name="productName" placeholder="Product Name" value={productForm.productName} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="number" name="oldPrice" placeholder="Old Price" value={productForm.oldPrice} onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <input type="text" name="discount" placeholder="Discount (%)" value={productForm.discount} onChange={handleChange} className="w-full border p-2 rounded mb-2" />
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded mb-2" required />
        <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg">{loading ? "Saving..." : "Add Product"}</button>
      </form>

      {/* ✅ Display Existing Top-Selling Products */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topProducts.map((product) => (
          <div key={product.id} className="border p-4 shadow rounded-lg relative bg-white">
            <button
              onClick={() => handleDelete(product.id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
            >
              ❌
            </button>
            <img src={product.image} alt={product.productName} className="w-full h-[150px] object-contain" />
            <h3 className="text-lg font-bold">{product.productName}</h3>
            <p className="text-gray-500 line-through">PKR {product.oldPrice}</p>
            <p className="text-red-600 text-xl font-bold">PKR {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBoostingPage;
