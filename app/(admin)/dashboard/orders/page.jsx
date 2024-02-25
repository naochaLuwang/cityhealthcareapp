"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Query orders collection and order by createdTime in descending order
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      // Update order status and add status update to Firestore
      await setDoc(
        doc(db, "orders", orderId),
        { status: newStatus },
        { merge: true }
      );
      await setDoc(doc(db, "orders", orderId, "statusUpdates"), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      // Update orders state after changing status
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Orders</h1>
      <div className="flex flex-col">
        {orders.map((order) => (
          <div key={order.id} className="p-4 mb-4 bg-gray-100 rounded-lg">
            <p className="mb-2 text-lg font-semibold">Order ID: {order.id}</p>
            <p className="mb-2">User Name: {order.userName}</p>
            <p className="mb-2">
              Created Time: {order.createdAt.toDate().toLocaleString()}
            </p>
            <p className="mb-2">Total Bill Amount: {order.totalBillAmount}</p>
            <p className="mb-2">Status: {order.status}</p>
            <div className="flex items-center">
              <select
                className="p-2 mr-2 bg-white border border-gray-300 rounded"
                value={order.status}
                onChange={(e) => handleChangeStatus(order.id, e.target.value)}
              >
                <option value="processing">Processing</option>
                <option value="sample collected">Sample Collected</option>
                <option value="completed">Completed</option>
                {/* Add more status options here */}
              </select>
              <button className="px-4 py-2 text-white bg-blue-500 rounded">
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
