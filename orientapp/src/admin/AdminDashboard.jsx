import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig"; // ✅ Firebase Config Import
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaPlus, FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "",
    image: "",
    discount: "",
    banner: "",
    description: "",
    specs: {
      size: "",
      blades: "",
      motorType: "",
      material: "",
      wire: "",
      speedSettings: "",
      powerConsumption: "",
    },
    features: [],
    featureInput: "",
    warranty: "",
  });

  // ✅ Load Products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Specs Changes
  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [name]: value,
      },
    }));
  };

  // ✅ Handle Image Upload to Firebase Storage
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const storageRef = ref(storage, `products/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        setNewProduct((prev) => ({ ...prev, [type]: imageUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // ✅ Handle Adding Features (Fixed)
  const handleAddFeature = () => {
    if (newProduct.featureInput.trim() !== "") {
      setNewProduct((prev) => ({
        ...prev,
        features: [...prev.features, prev.featureInput.trim()],
        featureInput: "", // ✅ Clear input field after adding
      }));
    }
  };

  // ✅ Handle Removing Features
  const handleRemoveFeature = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // ✅ Handle Add Product to Firebase
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image || !newProduct.banner) {
      alert("Please fill in all required fields.");
      return;
    }

    const productData = { ...newProduct };
    delete productData.featureInput;

    try {
      const docRef = await addDoc(collection(db, "products"), productData);
      setProducts([...products, { id: docRef.id, ...productData }]);
      alert("Product Added Successfully!");

      setNewProduct({
        name: "",
        price: "",
        oldPrice: "",
        category: "",
        image: "",
        discount: "",
        banner: "",
        description: "",
        specs: {
          size: "",
          blades: "",
          motorType: "",
          material: "",
          wire: "",
          speedSettings: "",
          powerConsumption: "",
        },
        features: [],
        featureInput: "",
        warranty: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // ✅ Handle Delete Product from Firebase
  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
      alert("Product Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-4xl font-bold text-center text-red-600 mb-8">Admin Dashboard - Manage Products</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ✅ Left: Form to Add New Product */}
        <div className="border p-6 rounded-lg shadow-lg bg-white">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">Add Product</h3>

          <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleInputChange} className="w-full border p-2 rounded mb-2" />
          <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} className="w-full border p-2 rounded mb-2" />
          <input type="number" name="oldPrice" placeholder="Old Price" value={newProduct.oldPrice} onChange={handleInputChange} className="w-full border p-2 rounded mb-2" />
          <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} className="w-full border p-2 rounded mb-2" />
          <input type="text" name="discount" placeholder="Discount %" value={newProduct.discount} onChange={handleInputChange} className="w-full border p-2 rounded mb-2" />
          <textarea name="description" placeholder="Product Description" value={newProduct.description} onChange={handleInputChange} className="w-full border p-2 rounded mb-2"></textarea>

          {/* ✅ Image Upload */}
          <label className="block font-bold">Product Image:</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} className="mb-2" />

          {/* ✅ Banner Upload */}
          <label className="block font-bold">Product Banner:</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "banner")} className="mb-2" />
              
               {/* ✅ Specs */}
          <h4 className="font-bold mt-4">Specifications</h4>
          {Object.keys(newProduct.specs).map((key) => (
            <input key={key} type="text" name={key} placeholder={key} value={newProduct.specs[key]} onChange={handleSpecsChange} className="w-full border p-2 rounded mb-2" />
          ))}

          {/* ✅ Features */}
          <h4 className="font-bold mt-4">Features</h4>
          <div className="flex">
            <input type="text" placeholder="Enter Feature" value={newProduct.featureInput} onChange={(e) => setNewProduct({ ...newProduct, featureInput: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <button onClick={handleAddFeature} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded mb-2">
              <FaPlus />
            </button>
          </div>
          <ul className="list-disc pl-6">
            {newProduct.features.map((feature, index) => (
              <li key={index} className="flex justify-between">
                {feature}
                <button onClick={() => handleRemoveFeature(index)} className="text-red-500"><FaTrash /></button>
              </li>
            ))}
          </ul>
                       {/* ✅ Warranty Input */}
          <h4 className="font-bold mt-4">Warranty (Years)</h4>
          <input type="text" name="warranty" placeholder="Warranty Period" value={newProduct.warranty} onChange={handleInputChange} className="w-full border p-2 rounded mb-2" />

          {/* ✅ Submit Button */}
          <button onClick={handleAddProduct} className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 mt-4">
            Add Product
          </button>
        </div>

        {/* ✅ Right: List of Existing Products */}
        <div className="border p-6 rounded-lg shadow-lg bg-gray-100">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">Existing Products</h3>
          <ul>
            {products.map((product) => (
              <li key={product.id} className="border p-4 rounded shadow-md flex justify-between">
                <span>{product.name}</span>
                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500"><FaTrash /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
