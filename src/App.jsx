// src/App.jsx
import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import ProductTable from './components/ProductTable';
import AddStockForm from './components/AddStockForm';
import SalesForm from './components/SalesForm';
import AddProductForm from './components/AddProductForm';
import DepositProduct from './components/DepositProduct';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import { Modal, Button, Form } from 'react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // ✅ Using env variable

const App = () => {
  const [products, setProducts] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepositId, setCurrentDepositId] = useState(null);
  const [modalStatus, setModalStatus] = useState('Not Supplied');
  const [modalSupplyDate, setModalSupplyDate] = useState('');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/products`);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products/deposits`);
      setDeposits(response.data);
    } catch (err) {
      console.error('Error fetching deposits:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDeposits();
  }, []);

  const handleAddProduct = async (product) => {
    try {
      const response = await axios.post(`${apiUrl}/products`, product);
      if (response.status === 200 || response.status === 201) {
        const addedProduct = response.data;
        setProducts((prev) => [...prev, { ...addedProduct, restockHistory: [], salesHistory: [] }]);
      } else {
        console.error('Failed to add product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleRecordSale = (productId, quantity) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              stock: Math.max(Number(product.stock) - quantity, 0),
              salesHistory: [...(product.salesHistory || []), { quantity, date: new Date().toISOString() }],
            }
          : product
      )
    );
  };

  const handleUpdatePrice = (productId, newPrice) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, price: newPrice }
          : product
      )
    );
  };

  const handleAddDeposit = async (deposit) => {
    try {
      const response = await axios.post(`${apiUrl}/products/deposits`, deposit);
      if (response.status === 201) {
        setDeposits((prev) => [...prev, response.data]);
      }
    } catch (err) {
      console.error('Error adding deposit:', err);
    }
  };

  const handleUpdateDepositStatus = async (depositId, newStatus, supplyDate) => {
    try {
      const response = await axios.put(`${apiUrl}/api/products/deposits/${depositId}`, {
        status: newStatus,
        deliveryDate: newStatus === 'Supplied' ? supplyDate : ''
      });

      if (response.status === 200) {
        setDeposits((prevDeposits) =>
          prevDeposits.map((deposit) =>
            deposit.id === depositId
              ? { ...deposit, status: newStatus, deliveryDate: newStatus === 'Supplied' ? supplyDate : '' }
              : deposit
          )
        );
      } else {
        console.error('Failed to update deposit status:', response.statusText);
      }
    } catch (err) {
      console.error('Error updating deposit status:', err);
    }

    setIsModalOpen(false);
  };

  const handleEditStatus = (depositId) => {
    const deposit = deposits.find((d) => d.id === depositId);
    setCurrentDepositId(depositId);
    setModalStatus(deposit.status);
    setModalSupplyDate(deposit.deliveryDate || '');
    setIsModalOpen(true);
  };

  const submitStatusUpdate = () => {
    handleUpdateDepositStatus(currentDepositId, modalStatus, modalSupplyDate);
  };

  return (
    <div className="App p-3">
      {!user ? (
        <LoginPage onLogin={setUser} />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center p-2">
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <Dashboard user={user} />

          <div className={`tabs-container ${window.innerWidth < 768 ? "tabs-top" : "tabs-top"}`}>
            <Tabs defaultActiveKey="productTable" id="inventory-tabs" className="mb-3" justify>
              <Tab eventKey="productTable" title="Stock Table">
                <ProductTable products={products} setProducts={setProducts} />
              </Tab>

              <Tab eventKey="addProduct" title=" Add Product">
                <AddProductForm onAddProduct={handleAddProduct} />
              </Tab>

              <Tab eventKey="addStock" title=" Add Stock">
                <AddStockForm products={products} setProducts={setProducts} />
              </Tab>

              <Tab eventKey="sales" title=" Sales">
                <SalesForm products={products} onRecordSale={handleRecordSale} />
              </Tab>

              <Tab eventKey="deposit" title=" Deposits">
                <DepositProduct
                  products={products}
                  onAddDeposit={handleAddDeposit}
                  onUpdateDepositStatus={handleUpdateDepositStatus}
                />
                <h2> Deposit Records</h2>
                <table border="1" cellPadding="10" className="product-table-container">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Amount Paid</th>
                      <th>Balance Left</th>
                      <th>Status</th>
                      <th>Sales Person</th>
                      <th>Customer Name</th>
                      <th>Date of Deposit</th>
                      <th>Supply Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.map((deposit) => (
                      <tr key={deposit.id}>
                        <td>{deposit.product}</td>
                        <td>{deposit.category}</td>
                        <td>{deposit.quantity}</td>
                        <td>{deposit.amount_paid}</td>
                        <td>{deposit.balance_left}</td>
                        <td>{deposit.status}</td>
                        <td>{deposit.sales_person}</td>
                        <td>{deposit.customer_name}</td>
                        <td>{new Date(deposit.deposit_date).toLocaleDateString("en-GB")}</td>
                        <td>
                          {deposit.delivery_date
                            ? new Date(deposit.delivery_date).toLocaleDateString("en-GB")
                            : "Not Supplied"}
                        </td>
                        <td>
                          <button onClick={() => handleEditStatus(deposit.id)}>Edit Status</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Tab>
            </Tabs>
          </div>

          <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Deposit Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                  >
                    <option value="Not Supplied">Not Supplied</option>
                    <option value="Supplied">Supplied</option>
                  </Form.Control>
                </Form.Group>

                {modalStatus === "Supplied" && (
                  <Form.Group className="mt-3">
                    <Form.Label>Supply Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={modalSupplyDate}
                      onChange={(e) => setModalSupplyDate(e.target.value)}
                    />
                  </Form.Group>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={submitStatusUpdate}>
                Update
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default App;
