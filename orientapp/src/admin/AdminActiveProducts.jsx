import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminActiveProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✅ Filters
    const [searchKeyword, setSearchKeyword] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [category, setCategory] = useState("all");
    const [minDiscount, setMinDiscount] = useState("");
    const [maxDiscount, setMaxDiscount] = useState("");

    // ✅ Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productList = querySnapshot.docs.map((doc) => ({
                    id: doc.id, // Ensure ID is a string
                    ...doc.data(),
                }));
                setProducts(productList);
                setFilteredProducts(productList);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("❌ Error fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // ✅ Apply Filters
    useEffect(() => {
        let updatedProducts = [...products];

        if (searchKeyword) {
            updatedProducts = updatedProducts.filter((product) =>
                product.productName.toLowerCase().includes(searchKeyword.toLowerCase()) // ✅ Use productName
            );
        }

        if (minPrice) {
            updatedProducts = updatedProducts.filter((product) => product.oldPrice >= parseFloat(minPrice)); // ✅ Use oldPrice
        }

        if (maxPrice) {
            updatedProducts = updatedProducts.filter((product) => product.oldPrice <= parseFloat(maxPrice)); // ✅ Use oldPrice
        }

        if (category !== "all") {
            updatedProducts = updatedProducts.filter((product) => product.category === category);
        }

        if (minDiscount) {
            updatedProducts = updatedProducts.filter((product) => product.discount >= parseFloat(minDiscount));
        }

        if (maxDiscount) {
            updatedProducts = updatedProducts.filter((product) => product.discount <= parseFloat(maxDiscount));
        }

        setFilteredProducts(updatedProducts);
    }, [searchKeyword, minPrice, maxPrice, category, minDiscount, maxDiscount, products]);

    // ✅ Handle Product Actions
    const deleteProduct = async (id) => {
        try {
            const productRef = doc(db, "products", id.toString()); // Ensure ID is a string
            await deleteDoc(productRef);
            setProducts((prev) => prev.filter((product) => product.id !== id));
            toast.success("✅ Product Deleted Successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("❌ Failed to delete product.");
        }
    };

    const deactivateProduct = async (id) => {
        try {
            const productRef = doc(db, "products", id.toString()); // Ensure ID is a string
            await updateDoc(productRef, { status: "Inactive" });
            setProducts((prev) =>
                prev.map((product) => (product.id === id ? { ...product, status: "Inactive" } : product))
            );
            toast.success("✅ Product Deactivated!");
        } catch (error) {
            console.error("Error deactivating product:", error);
            toast.error("❌ Failed to deactivate product.");
        }
    };

    // ✅ Navigate to Edit Product Page
    const handleEditProduct = (id) => {
        console.log("Editing product with ID:", id); // Debugging
        navigate(`/admin/edit-product/${id}`); // Ensure ID is passed correctly
    };

    return (
        <div className="container mx-auto py-10 px-6">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Active Products Management</h2>

            {/* ✅ Filter Section */}
            <div className="bg-white p-6 shadow-md rounded-lg mb-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by Keyword"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="border p-2 rounded-lg w-full sm:w-1/5"
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border p-2 rounded-lg w-full sm:w-1/5"
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border p-2 rounded-lg w-full sm:w-1/5"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border p-2 rounded-lg w-full sm:w-1/5"
                >
                    <option value="all">All Categories</option>
                    {[...new Set(products.map((product) => product.category))].map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Min Discount %"
                    value={minDiscount}
                    onChange={(e) => setMinDiscount(e.target.value)}
                    className="border p-2 rounded-lg w-full sm:w-1/5"
                />
                <input
                    type="number"
                    placeholder="Max Discount %"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="border p-2 rounded-lg w-full sm:w-1/5"
                />
            </div>

            {/* ✅ Products Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-3">Image</th>
                            <th className="border p-3">Product Name</th>
                            <th className="border p-3">Price</th>
                            <th className="border p-3">Discount</th>
                            <th className="border p-3">Discounted Price</th>
                            <th className="border p-3">Stock</th>
                            <th className="border p-3">Category</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="border text-center">
                                <td className="p-3">
                                    <img
                                        src={product.productImage} // ✅ Use productImage
                                        alt={product.productName} // ✅ Use productName
                                        className="w-16 h-16 object-contain mx-auto"
                                    />
                                </td>
                                <td className="p-3">{product.productName}</td> {/* ✅ Use productName */}
                                <td className="p-3">PKR {product.oldPrice}</td> {/* ✅ Use oldPrice */}
                                <td className="p-3">{product.discount}%</td>
                                <td className="p-3">
                                    PKR {(product.oldPrice - (product.oldPrice * product.discount) / 100).toFixed(2)} {/* ✅ Use oldPrice */}
                                </td>
                                <td className="p-3">{product.stock} pcs</td>
                                <td className="p-3">{product.category}</td>
                                <td className="p-3 flex flex-col sm:flex-row gap-2">
                                    <button
                                        onClick={() => handleEditProduct(product.id)} // ✅ Use handleEditProduct
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => deactivateProduct(product.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Deactivate</button>
                                    <button onClick={() => deleteProduct(product.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminActiveProducts;