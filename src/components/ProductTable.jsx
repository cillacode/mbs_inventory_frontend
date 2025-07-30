import "./ProductTable.css";
import React, { useState, useEffect } from "react";
import AddProductForm from "./AddProductForm";
import { Modal, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import SalesForm from "./SalesForm";
 
const apiUrl = import.meta.env.VITE_API_URL;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSaleHistoryModal, setShowSaleHistoryModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [saleHistory, setSaleHistory] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
console.log("API URL:", apiUrl);

  const handleAddProduct = async (newProduct) => {
    const response = await fetch(`${apiUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error || "Failed to add product");
      error.status = response.status;
      throw error;
    }

    await fetchProducts();
    return await response.json();
  };

  const handleSaveClick = async (productId) => {
    if (newPrice && !isNaN(newPrice)) {
      try {
        const response = await fetch(`${apiUrl}/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: parseFloat(newPrice) }),
        });

        if (response.ok) {
          await fetchProducts();
          setEditingProductId(null);
          setNewPrice("");
        } else {
          console.error("Failed to update product");
        }
      } catch (error) {
        console.error("Error updating price:", error);
      }
    } else {
      alert("Please enter a valid price");
    }
  };

  const fetchSalesHistory = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/products/${productId}/sales`);
      if (response.ok) {
        const data = await response.json();
        setSaleHistory(data);
      } else {
        console.error("Failed to fetch sales history");
        setSaleHistory([]);
      }
    } catch (error) {
      console.error("Error fetching sales history:", error);
      setSaleHistory([]);
    }
  };

  const handleRecordSale = async (productId, quantity, salespersonName) => {
    try {
      await fetch(`${apiUrl}/products/${productId}/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, salesperson: salespersonName }),
      });
      await fetchProducts();
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };

  const openRestockModal = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const openSaleHistoryModal = async (product) => {
    setCurrentProduct(product);
    await fetchSalesHistory(product.id);
    setShowSaleHistoryModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };

  const closeSaleHistoryModal = () => {
    setShowSaleHistoryModal(false);
    setCurrentProduct(null);
    setSaleHistory([]);
  };

  const handleEditClick = (productId, currentPrice) => {
    setEditingProductId(productId);
    setNewPrice(currentPrice);
  };

  const downloadPDF = (type) => {
    const doc = new jsPDF();
    const title = `${type === "restock" ? "Restock" : "Sale"} History for ${currentProduct.name}`;
    const historyData = type === "restock" ? currentProduct.restock_history : saleHistory;

    doc.setFontSize(18);
    doc.text(title, 10, 10);
    doc.setFontSize(12);

    let y = 20;
    if (historyData.length > 0) {
      historyData.forEach((entry) => {
        const line =
          type === "restock"
            ? `+${entry.quantity} on ${new Date(entry.date).toLocaleString()}`
            : `-${entry.quantity} on ${new Date(entry.date).toLocaleString()} by ${entry.salesperson}`;
        doc.text(line, 10, y);
        y += 10;
      });
    } else {
      doc.text("No history available", 10, y);
    }

    doc.save(`${currentProduct.name}_${type}_history.pdf`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
      return (
        <div className="product-table-container">
           <h2>📦 Current Stock</h2>
    
    {/* Desktop Table View */}
    <div className="desktop-view">
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price (₦)</th>
            <th>Last Restock</th>
            <th>Restock History</th>
            <th>Sale History</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="price-input"
                    />
                  ) : (
                    Math.floor(product.price).toLocaleString()
                  )}
                </td>
                <td>
                  {product.last_restock_quantity && product.last_restock_date ? (
                    `+${product.last_restock_quantity} on ${new Date(
                      product.last_restock_date
                    ).toLocaleDateString()}`
                  ) : (
                    "No restock yet"
                  )}
                </td>
                <td>
                  <button onClick={() => openRestockModal(product)}>View Restock</button>
                </td>
                <td>
                  <button onClick={() => openSaleHistoryModal(product)}>View Sale</button>
                </td>
                <td>
                  {editingProductId === product.id ? (
                    <button onClick={() => handleSaveClick(product.id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(product.id, product.price)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
    <div className="mobile-view">
      {products.length > 0 ? (
        products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="card-header">
              <h3>{product.name}</h3>
              <span className={`stock-badge ${product.stock < 5 ? 'low-stock' : ''}`}>
                {product.stock} in stock
              </span>
            </div>

            <div className="card-body">
              <div className="card-row">
                <span>Category:</span>
                <span>{product.category}</span>
              </div>
              <div className="card-row">
                <span>Price:</span>
                <span>
    {editingProductId === product.id ? (
      <input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
        className="price-input"
      />
    ) : (
      `₦${Math.floor(product.price).toLocaleString()}`
    )}
  </span>

              </div>
              <div className="card-row">
                <span>Last Restock:</span>
                <span>
                  {product.last_restock_quantity && product.last_restock_date ? (
                    `+${product.last_restock_quantity} on ${new Date(
                      product.last_restock_date
                    ).toLocaleDateString()}`
                  ) : (
                    "No restock yet"
                  )}
                </span>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="action-btn"
                onClick={() => openRestockModal(product)} >
                Restock
              </button>
              <button 
                className="action-btn"
                onClick={() => openSaleHistoryModal(product)}>
                Sales
              </button>
                 {editingProductId === product.id ? (
                    <button onClick={() => handleSaveClick(product.id)}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(product.id, product.price)}>Edit</button>
                  )} 
            </div>
          </div>
        ))
      ) : (
        <div className="no-products">No products available.</div>
      )}
    </div>

      {currentProduct && (
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Restock History for {currentProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Last Restock</h5>
            {currentProduct.last_restock_date && (
              <p>
                +{currentProduct.last_restock_quantity} on{" "}
                {new Date(currentProduct.last_restock_date).toLocaleDateString()}
              </p>
            )}
            <h5>Full Restock History</h5>
            {currentProduct.restock_history?.length > 0 ? (
              <ul>
                {currentProduct.restock_history.map((entry, index) => (
                  <li key={index}>
                    +{entry.quantity} on {new Date(entry.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No restock history available</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Close</Button>
            <Button variant="primary" onClick={() => downloadPDF("restock")}>Download PDF</Button>
          </Modal.Footer>
        </Modal>
      )}

      {currentProduct && showSaleHistoryModal && (
        <Modal show={showSaleHistoryModal} onHide={closeSaleHistoryModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sale History for {currentProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {saleHistory.length > 0 ? (
              <ul>
                {saleHistory.map((sale, index) => (
                  <li key={index}>
                    -{sale.quantity} sold on {new Date(sale.created_at).toLocaleString()} by {sale.salesperson}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sale history available</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeSaleHistoryModal}>Close</Button>
            <Button variant="primary" onClick={() => downloadPDF("sale")}>Download PDF</Button>
          </Modal.Footer>
        </Modal>
      )}
  </div>
     );

     
    
};

export default ProductTable;
