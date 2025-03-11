import React, { useState } from "react";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const AdminDeals = () => {
  const [productForm, setProductForm] = useState({
    productName: "",
    normalPrice: "",
    dealerPrice: "",
    discount: "",
    minOrder: "",
    image: null,
  });

  const [dealForm, setDealForm] = useState({
    dealName: "",
    products: "",
    totalPrice: "",
    discount: "",
    finalPrice: "",
    minOrder: "", // ✅ Added minOrder field
    dealImages: [], // ✅ Fixed initial state
  });

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingDeal, setLoadingDeal] = useState(false);

  // ✅ Handle Input Changes for Product Form
  const handleProductChange = (e) => {
    if (e.target.type === "file") {
      setProductForm({ ...productForm, [e.target.name]: e.target.files[0] });
    } else if (e.target.name === "discount") {
      const discount = e.target.value;
      const dealerPrice =
        productForm.normalPrice && discount
          ? (productForm.normalPrice - (productForm.normalPrice * discount) / 100).toFixed(2)
          : "";
      setProductForm({ ...productForm, discount, dealerPrice });
    } else {
      setProductForm({ ...productForm, [e.target.name]: e.target.value });
    }
  };

  // ✅ Handle Input Changes for Deal Form
  const handleDealChange = (e) => {
    if (e.target.name === "discount") {
      const discount = e.target.value;
      const finalPrice =
        dealForm.totalPrice && discount
          ? (dealForm.totalPrice - (dealForm.totalPrice * discount) / 100).toFixed(2)
          : "";
      setDealForm({ ...dealForm, discount, finalPrice });
    } else {
      setDealForm({ ...dealForm, [e.target.name]: e.target.value });
    }
  };

  // ✅ Upload Image to Firebase Storage
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `dealImages/${file.name}`);
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

  // ✅ Remove Preview Image
  const handleRemoveImage = (index) => {
    setDealForm((prevForm) => ({
      ...prevForm,
      dealImages: prevForm.dealImages.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit New Product for Dealers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.productName || !productForm.normalPrice || !productForm.dealerPrice || !productForm.image) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    try {
      setLoadingProduct(true);
      const imageURL = await uploadImage(productForm.image);

      await addDoc(collection(db, "dealerProducts"), {
        productName: productForm.productName,
        normalPrice: parseFloat(productForm.normalPrice),
        dealerPrice: parseFloat(productForm.dealerPrice),
        discount: parseFloat(productForm.discount),
        minOrder: parseInt(productForm.minOrder),
        image: imageURL,
        timestamp: new Date(),
      });

      toast.success("✅ Product Added Successfully!");
      setProductForm({
        productName: "",
        normalPrice: "",
        dealerPrice: "",
        discount: "",
        minOrder: "",
        image: null,
      });
    } catch (error) {
      toast.error("❌ Failed to add product!");
    } finally {
      setLoadingProduct(false);
    }
  };

  // ✅ Handle Multiple Image Upload for Deals
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];

    setLoadingDeal(true);
    for (const file of files) {
      const storageRef = ref(storage, `dealImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedImages.push(downloadURL);
            resolve();
          }
        );
      });
    }

    setDealForm((prevForm) => ({
      ...prevForm,
      dealImages: [...(prevForm.dealImages || []), ...uploadedImages], // ✅ Ensure array exists
    }));

    setLoadingDeal(false);
  };

  // ✅ Submit New Deal for Dealers
  const handleDealSubmit = async (e) => {
    e.preventDefault();
    if (!dealForm.dealName || !dealForm.totalPrice || !dealForm.finalPrice || dealForm.products.length === 0) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    try {
      setLoadingDeal(true);
      await addDoc(collection(db, "dealerDeals"), {
        dealName: dealForm.dealName,
        products: dealForm.products.split(",").map((p) => p.trim()),
        totalPrice: parseFloat(dealForm.totalPrice),
        discount: parseFloat(dealForm.discount),
        finalPrice: parseFloat(dealForm.finalPrice),
        minOrder: parseInt(dealForm.minOrder), // ✅ Added minOrder
        images: dealForm.dealImages, // ✅ Store images as an array
        timestamp: new Date(),
      });

      toast.success("✅ Deal Added Successfully!");
      setDealForm({
        dealName: "",
        products: "",
        totalPrice: "",
        discount: "",
        finalPrice: "",
        minOrder: "", // ✅ Reset minOrder
        dealImages: [],
      });
    } catch (error) {
      toast.error("❌ Failed to add deal!");
    } finally {
      setLoadingDeal(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ✅ Left Section: Add Product for Dealers */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 text-center">Add Product for Dealers</h2>
        <form onSubmit={handleProductSubmit} className="mt-4">
          <input type="text" name="productName" placeholder="Product Name" value={productForm.productName} onChange={handleProductChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="normalPrice" placeholder="Normal Price" value={productForm.normalPrice} onChange={handleProductChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="discount" placeholder="Discount (%)" value={productForm.discount} onChange={handleProductChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="dealerPrice" placeholder="Dealer Price" value={productForm.dealerPrice} readOnly className="w-full border p-2 rounded mb-2 bg-gray-200" />
          <input type="number" name="minOrder" placeholder="Minimum Order Quantity" value={productForm.minOrder} onChange={handleProductChange} className="w-full border p-2 rounded mb-2" required />
          <input type="file" name="image" accept="image/*" onChange={handleProductChange} className="w-full border p-2 rounded mb-2" required />
          <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg">{loadingProduct ? "Saving..." : "Add Product"}</button>
        </form>
      </div>

      {/* ✅ Right Section: Add Dealer Deals */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 text-center">Add Dealer Deals</h2>
        <form onSubmit={handleDealSubmit} className="mt-4">
          <input type="text" name="dealName" placeholder="Deal Name" value={dealForm.dealName} onChange={handleDealChange} className="w-full border p-2 rounded mb-2" required />
          <textarea name="products" placeholder="Products in Deal (Comma Separated)" value={dealForm.products} onChange={handleDealChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="totalPrice" placeholder="Total Price" value={dealForm.totalPrice} onChange={handleDealChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="discount" placeholder="Discount (%)" value={dealForm.discount} onChange={handleDealChange} className="w-full border p-2 rounded mb-2" required />
          <input type="number" name="finalPrice" placeholder="Final Price After Discount" value={dealForm.finalPrice} readOnly className="w-full border p-2 rounded mb-2 bg-gray-200" />
          <input type="number" name="minOrder" placeholder="Minimum Order Quantity" value={dealForm.minOrder} onChange={handleDealChange} className="w-full border p-2 rounded mb-2" required /> {/* ✅ Added minOrder field */}
          <label className="block font-bold mb-1">Upload Deal Images</label>
          <input type="file" name="dealImages" accept="image/*" multiple onChange={handleImageUpload} className="w-full border p-2 rounded mb-2" />
          <div className="flex gap-2 mt-2 flex-wrap">
            {dealForm.dealImages &&
              dealForm.dealImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Deal Image ${index + 1}`} className="w-16 h-16 object-cover border rounded" />
                  <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ))}
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg">{loadingDeal ? "Saving..." : "Add Deal"}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDeals;