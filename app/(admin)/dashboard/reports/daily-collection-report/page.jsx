"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { pdf } from "@react-pdf/renderer";
import PDFReport from "../../../../../components/admin/PDFReport"; // Path to your PDFReport component
import { db } from "@/config/firebase"; // Assuming this is your Firebase Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";

const DailyCollectionReports = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (orders.length > 0) {
      exportToExcel();
    }
  }, [orders]);

  const handleGenerateReport = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates");
      return;
    }

    const fetchedOrders = await fetchOrders(fromDate, toDate);

    if (fetchedOrders.length === 0) {
      alert("No orders found for the selected date range");
      return;
    }

    setOrders(fetchedOrders);

    const pdfBlob = await generatePDF(fetchedOrders);
    setPdfBlob(pdfBlob);

    // Open PDF in a new tab
    window.open(URL.createObjectURL(pdfBlob), "_blank");
  };

  const fetchOrders = async (fromDate, toDate) => {
    const orders = [];
    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "orders"),
      where("createdAt", ">=", fromDate),
      where("createdAt", "<=", endOfDay)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });

    console.log("Fetched orders:", orders);

    return orders;
  };

  const generatePDF = async (orders) => {
    return pdf(<PDFReport orders={orders} />).toBlob();
  };

  const handleExportToExcel = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates");
      return;
    }

    const fetchedOrders = await fetchOrders(fromDate, toDate);

    if (fetchedOrders.length === 0) {
      alert("No orders found for the selected date range");
      return;
    }

    const data = transformDataForExcel(fetchedOrders);
    exportToExcel(data);
  };

  const transformDataForExcel = (orders) => {
    const data = [];

    orders.forEach((order, index) => {
      const center = order.services[0].centerName;
      const services = order.services
        .map((service) => service.serviceName)
        .join(", ");

      data.push({
        "SL. No": index + 1,
        "Bill No": order.billNumber,
        "Patient Name": order.basicInfo.firstName,
        Services: services,
        Centre: center,
        "Bill Amount": order.totalBillAmount,
        "Discount Amount": 0, // Assuming default discount amount is 0
        "Net Amount": order.totalBillAmount,
      });

      // Add an empty row for the same bill if it has multiple services
      for (let i = 1; i < order.services.length; i++) {
        data.push({
          "SL. No": "",
          "Bill No": "",
          "Patient Name": "",
          Services: "",
          Centre: "",
          "Bill Amount": "",
          "Discount Amount": "",
          "Net Amount": "",
        });
      }
    });

    return data;
  };

  const exportToExcel = (data) => {
    if (!data || data.length === 0) {
      console.error("No data to export");
      return;
    }

    const headers = Object.keys(data[0]); // Get the headers from the first row
    const wsData = [headers, ...data.map(Object.values)];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "daily-collection-report.xlsx");
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Daily Collection Reports</h1>
      <div className="flex items-center mb-4">
        <label className="mr-2">From Date:</label>
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          className="px-2 py-1 border border-gray-300 rounded"
        />
      </div>
      <div className="flex items-center mb-4">
        <label className="mr-2">To Date:</label>
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          className="px-2 py-1 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={handleGenerateReport}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Generate Report
      </button>
      <button
        onClick={handleExportToExcel}
        className="px-4 py-2 ml-4 text-white bg-green-500 rounded hover:bg-green-600"
      >
        Export to Excel
      </button>
      {pdfBlob && (
        <div className="mt-6">
          <embed
            src={URL.createObjectURL(pdfBlob)}
            type="application/pdf"
            width="100%"
            height="600"
          />
        </div>
      )}
    </div>
  );
};

export default DailyCollectionReports;
