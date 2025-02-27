import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // ✅ Firebase Config
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const AdminMembership = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dealerId, setDealerId] = useState("");
  const [dealerPassword, setDealerPassword] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(null);

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

  // ✅ Accept Membership (With Dealer ID & Password)
  const acceptMembership = async (id) => {
    if (!dealerId || !dealerPassword) {
      toast.error("⚠️ Please enter a Dealer ID and Password!");
      return;
    }

    try {
      const membershipRef = doc(db, "membershipRequests", id);
      await updateDoc(membershipRef, {
        status: "Accepted",
        dealerId,
        dealerPassword,
      });

      setMemberships((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, status: "Accepted", dealerId, dealerPassword } : member
        )
      );

      toast.success("✅ Membership Accepted with Dealer ID & Password!");
      setDealerId("");
      setDealerPassword("");
      setSelectedMemberId(null);
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

          {/* ✅ Table for Pending Requests */}
          <table className="w-full border border-gray-300 bg-white text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border p-3">Dealer Name</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3">Email</th>
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
                    <td className="p-3">{member.email}</td>
                    <td className="p-3 font-bold">{member.status}</td>
                    <td className="p-3 flex flex-col sm:flex-row justify-center gap-2">
                      <button
                        onClick={() => setSelectedMemberId(member.id)}
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

          {/* ✅ Accept Membership Modal */}
          {selectedMemberId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold text-center text-red-600 mb-4">Assign Dealer Credentials</h3>
                <input
                  type="text"
                  placeholder="Enter Dealer ID"
                  value={dealerId}
                  onChange={(e) => setDealerId(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Enter Dealer Password"
                  value={dealerPassword}
                  onChange={(e) => setDealerPassword(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => acceptMembership(selectedMemberId)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Confirm Accept
                  </button>
                  <button
                    onClick={() => setSelectedMemberId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Accepted Members Section */}
          <h3 className="text-xl font-bold text-green-700 mt-8 text-center">Accepted Members</h3>
          <table className="w-full border border-gray-300 bg-white text-sm sm:text-base mt-4">
            <thead>
              <tr className="bg-green-200 text-gray-800">
                <th className="border p-3">Dealer Name</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Dealer ID</th>
                <th className="border p-3">Password</th>
              </tr>
            </thead>
            <tbody>
              {memberships
                .filter((member) => member.status === "Accepted")
                .map((member) => (
                  <tr key={member.id} className="border text-center">
                    <td className="p-3">{member.dealerName}</td>
                    <td className="p-3">{member.phone}</td>
                    <td className="p-3">{member.email}</td>
                    <td className="p-3 font-bold">{member.dealerId}</td>
                    <td className="p-3 font-bold">{member.dealerPassword}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMembership;
