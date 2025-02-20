import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import products from "../data/products"; // Import mock data

const addMockProductsToFirebase = async () => {
  try {
    for (const product of products) {
      await addDoc(collection(db, "products"), product);
    }
    console.log("Mock products added successfully!");
    alert("Mock products added to Firebase!");
  } catch (error) {
    console.error("Error adding mock products:", error);
  }
};

export default addMockProductsToFirebase;
