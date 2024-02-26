"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { PDFViewer } from "@react-pdf/renderer";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
    fontSize: "12px",
  },
  invoicehead: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  invoiceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionContent: {
    marginBottom: 20,
    fontSize: 12,
  },
  servicesTable: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    padding: 5,
  },
  tableCell: {
    padding: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
  },
  totalPriceRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#000",
    paddingTop: 5,
  },
  sectionFooter: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

const InvoiceDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>City Healthcare</Text>
        <View style={styles.invoicehead}>
          <Text>Invoice No: {order.id}</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Bill To */}
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text>
          Name: {order.basicInfo.firstName} {order.basicInfo.lastName}
        </Text>
        <Text>
          Address: {order.basicInfo.address} , {order.basicInfo.city}
        </Text>
      </View>

      {/* Services */}
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 3 }]}>Service Name</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Price</Text>
          </View>
          {order.services.map((service, index) => (
            <View key={index} style={{ flexDirection: "row" }}>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                {service.serviceName}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                ${service.price}
              </Text>
            </View>
          ))}
          <View style={styles.totalPriceRow}>
            <Text>Total Price: ${order.totalPrice}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}

      <View style={styles.sectionFooter}>
        <Text>Payment Mode: Cash on Sample Collection</Text>
      </View>
    </Page>
  </Document>
);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusOptions, setStatusOptions] = useState([
    "Processing",
    "Agent Assigned",
    "Sample Collected",
  ]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewOrder, setPreviewOrder] = useState(null);

  console.log(orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get the current date
        const today = new Date();
        const startOfDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        // Query orders collection for orders created today
        const q = query(
          collection(db, "orders"),
          where("createdAt", ">=", startOfDay)
        );
        const querySnapshot = await getDocs(q);

        // Extract and format order data
        const ordersData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            billNumber: data.billNumber,
            basicInfo: data.basicInfo,
            services: data.services,
            totalPrice: data.totalBillAmount,
            status: data.status, // Get the latest status
          };
        });

        // Update state with fetched orders
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update the status in the order document
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Add status update to subcollection
      const statusUpdateData = {
        status: newStatus,
        updatedBy: "admin", // Update with admin's ID or name
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(orderRef, "statuses"), statusUpdateData);

      // Update order status in state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const generateInvoicePDF = (order) => {
    setPreviewOrder(order);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewOrder(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Orders</h1>
      <table className="w-full mt-4 border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Services</th>
            <th className="px-4 py-2">Bill Amount</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-2 border border-gray-300">
                {order.billNumber}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {order.basicInfo.firstName}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {order.services
                  .map((service) => service.serviceName)
                  .join(", ")}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {order.totalPrice}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {order.status}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => generateInvoicePDF(order)}
                  className="px-3 py-1 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Generate Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {previewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-3/4 max-w-2xl p-8 bg-white rounded-lg">
            <PDFViewer width="100%" height="600">
              <InvoiceDocument order={previewOrder} />
            </PDFViewer>
            <button
              onClick={handleClosePreview}
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
