import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./ProductTable.css"; // Reuse same styling

const ExchangeTable = ({ exchanges }) => {
  // PDF Export
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Exchange Records", 14, 10);

    const tableColumn = [
      "Product",
      "Category",
      "Quantity",
      "Exchange Type",
      "Exchanger",
      "Confirmed Entry",
      "Date of Exchange",
    ];
    const tableRows = exchanges.map((ex) => [
      ex.product_name,
      ex.category,
      ex.quantity,
      ex.exchange_type,
      ex.exchanger,
      ex.confirmed_entry ? "Yes" : "No",
      new Date(ex.date_of_exchange).toLocaleDateString("en-GB"),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("exchange_records.pdf");
  };

  return (
    <div className="product-table-container">
      <h2>🔄 Exchange Records</h2>
      <button onClick={downloadPDF} style={{ marginBottom: "10px" }}>
        📄 Download PDF
      </button>

      {/* Desktop Table View */}
      <div className="desktop-view">
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Exchange Type</th>
              <th>Exchanger</th>
              <th>Confirmed Entry</th>
              <th>Date of Exchange</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.length > 0 ? (
              exchanges.map((ex) => (
                <tr key={ex.id}>
                  <td>{ex.product_name}</td>
                  <td>{ex.category}</td>
                  <td>{ex.quantity}</td>
                  <td>{ex.exchange_type}</td>
                  <td>{ex.exchanger}</td>
                  <td>{ex.confirmed_entry ? "Yes" : "No"}</td>
                  <td>{new Date(ex.date_of_exchange).toLocaleDateString("en-GB")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No exchanges available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-view">
        {exchanges.map((ex) => (
          <div className="product-card" key={ex.id}>
            <p><strong>Product:</strong> {ex.product_name}</p>
            <p><strong>Category:</strong> {ex.category}</p>
            <p><strong>Quantity:</strong> {ex.quantity}</p>
            <p><strong>Exchange Type:</strong> {ex.exchange_type}</p>
            <p><strong>Exchanger:</strong> {ex.exchanger}</p>
            <p><strong>Confirmed Entry:</strong> {ex.confirmed_entry ? "Yes" : "No"}</p>
            <p><strong>Date of Exchange:</strong> {new Date(ex.date_of_exchange).toLocaleDateString("en-GB")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeTable;
