import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const AdminMembership = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Membership Requests
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "membershipRequests"));
        const membershipList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMemberships(membershipList);
      } catch (error) {
        console.error("Error fetching membership requests:", error);
        toast.error("❌ Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  // ✅ Accept Membership
  const acceptMembership = async (id) => {
    try {
      const membershipRef = doc(db, "membershipRequests", id);
      await updateDoc(membershipRef, { status: "Accepted" });

      setMemberships((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, status: "Accepted" } : member
        )
      );

      toast.success("✅ Membership Accepted!");
    } catch (error) {
      console.error("Error accepting membership:", error);
      toast.error("❌ Failed to accept membership.");
    }
  };

  // ✅ Reject Membership (Delete)
  const rejectMembership = async (id) => {
    try {
      await deleteDoc(doc(db, "membershipRequests", id));

      setMemberships((prev) => prev.filter((member) => member.id !== id));

      toast.success("✅ Membership Rejected & Deleted!");
    } catch (error) {
      console.error("Error rejecting membership:", error);
      toast.error("❌ Failed to reject membership.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Admin Membership Panel</h2>

      {loading ? (
        <p className="text-center text-gray-500 mt-6">⏳ Loading memberships...</p>
      ) : memberships.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No membership requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Pending Membership Requests</h3>

          {/* ✅ Table for Big Screens */}
          <div className="hidden sm:block">
            <table className="w-full border border-gray-300 bg-white text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="border p-3">Dealer Name</th>
                  <th className="border p-3">Phone</th>
                  <th className="border p-3 hidden sm:table-cell">Email</th>
                  <th className="border p-3">Shop Pic</th>
                  <th className="border p-3">Shop Card</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships
                  .filter((member) => member.status === "Pending")
                  .map((member) => (
                    <tr key={member.id} className="border text-center">
                      <td className="p-3">{member.dealerName}</td>
                      <td className="p-3">{member.phone}</td>
                      <td className="p-3 hidden sm:table-cell">{member.email}</td>
                      <td className="p-3">
                        <a href={member.shopPic} target="_blank" rel="noopener noreferrer">
                          <img
                            src={member.shopPic}
                            alt="Shop Pic"
                            className="w-16 h-16 sm:w-24 sm:h-24 object-contain rounded-md mx-auto shadow-md"
                          />
                        </a>
                      </td>
                      <td className="p-3">
                        <a href={member.shopCard} target="_blank" rel="noopener noreferrer">
                          <img
                            src={member.shopCard}
                            alt="Shop Card"
                            className="w-16 h-16 sm:w-24 sm:h-24 object-contain rounded-md mx-auto shadow-md"
                          />
                        </a>
                      </td>
                      <td className="p-3 font-bold">{member.status}</td>
                      <td className="p-3 flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          onClick={() => acceptMembership(member.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition w-full sm:w-auto"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectMembership(member.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition w-full sm:w-auto"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile View */}
          <div className="sm:hidden">
            {memberships
              .filter((member) => member.status === "Pending")
              .map((member) => (
                <div key={member.id} className="border p-4 rounded-lg shadow-md bg-white mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="font-bold">Dealer Name:</p>
                      <p>{member.dealerName}</p>
                    </div>
                    <div>
                      <p className="font-bold">Phone:</p>
                      <p>{member.phone}</p>
                    </div>
                    <div>
                      <p className="font-bold">Status:</p>
                      <p className="font-bold">{member.status}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold">Shop Pic:</p>
                      <a href={member.shopPic} target="_blank" rel="noopener noreferrer">
                        <img
                          src={member.shopPic}
                          alt="Shop Pic"
                          className="w-full max-h-48 object-contain rounded-md shadow-md"
                        />
                      </a>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold">Shop Card:</p>
                      <a href={member.shopCard} target="_blank" rel="noopener noreferrer">
                        <img
                          src={member.shopCard}
                          alt="Shop Card"
                          className="w-full max-h-48 object-contain rounded-md shadow-md"
                        />
                      </a>
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <button
                        onClick={() => acceptMembership(member.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition w-full"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectMembership(member.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition w-full"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* ✅ Accepted Members Section */}
          <h3 className="text-xl font-bold text-green-700 mt-8 text-center">Accepted Members</h3>

          <div className="hidden sm:block">
            <table className="w-full border border-gray-300 bg-white text-sm sm:text-base mt-4">
              <thead>
                <tr className="bg-green-200 text-gray-800">
                  <th className="border p-3">Dealer Name</th>
                  <th className="border p-3">Phone</th>
                  <th className="border p-3 hidden sm:table-cell">Email</th>
                </tr>
              </thead>
              <tbody>
                {memberships
                  .filter((member) => member.status === "Accepted")
                  .map((member) => (
                    <tr key={member.id} className="border text-center">
                      <td className="p-3">{member.dealerName}</td>
                      <td className="p-3">{member.phone}</td>
                      <td className="p-3 hidden sm:table-cell">{member.email}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile View for Accepted Members */}
          <div className="sm:hidden">
            {memberships
              .filter((member) => member.status === "Accepted")
              .map((member) => (
                <div key={member.id} className="border p-4 rounded-lg shadow-md bg-white mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold">Dealer Name:</p>
                      <p>{member.dealerName}</p>
                    </div>
                    <div>
                      <p className="font-bold">Phone:</p>
                      <p>{member.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembership;