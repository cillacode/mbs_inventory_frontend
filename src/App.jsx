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
import DepositTable from './components/DepositTable';
import ExchangeForm from './components/ExchangeForm';
import ExchangeTable from './components/ExchangeTable';
import { Modal, Button, Form, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // ✅ Using env variable

const App = () => {
  const [products, setProducts] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepositId, setCurrentDepositId] = useState(null);
  const [modalStatus, setModalStatus] = useState('Not Supplied');
  const [modalSupplyDate, setModalSupplyDate] = useState('');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ===== Logout =====
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // ===== Fetch Data =====
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
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

  const fetchExchanges = async () => {
    try {
      const response = await axios.get(`${apiUrl}/exchanges`);
      setExchanges(response.data);
    } catch (err) {
      console.error('Error fetching exchanges:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchDeposits();
    fetchExchanges();
  }, []);

  // ===== Handle Add Functions =====
  const handleAddProduct = async (product) => {
    try {
      const response = await axios.post(`${apiUrl}/products`, product);
      if ([200, 201].includes(response.status)) {
        const addedProduct = response.data;
        setProducts((prev) => [...prev, { ...addedProduct, restockHistory: [], salesHistory: [] }]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
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

  const handleAddExchange = async (exchange) => {
    try {
      const response = await axios.post(`${apiUrl}/exchanges`, exchange);
      if (response.status === 201) {
        setExchanges((prev) => [...prev, response.data]);
      }
    } catch (err) {
      console.error('Error adding exchange:', err);
    }
  };

  // ===== Sales & Price Updates =====
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

  // ===== Deposit Status Update =====
  const handleUpdateDepositStatus = async (depositId, newStatus, supplyDate) => {
    try {
      const response = await axios.put(`${apiUrl}/products/deposits/${depositId}`, {
        status: newStatus,
        deliveryDate: newStatus === 'Supplied' ? supplyDate : ''
      });

      if (response.status === 200) {
        setDeposits((prev) =>
          prev.map((deposit) =>
            deposit.id === depositId
              ? { ...deposit, status: newStatus, deliveryDate: newStatus === 'Supplied' ? supplyDate : '' }
              : deposit
          )
        );
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

          <div className="tabs-container tabs-top">
            <Tabs defaultActiveKey="productTable" id="inventory-tabs" className="mb-3" justify>
              <Tab eventKey="productTable" title="Stock Table">
                <ProductTable products={products} setProducts={setProducts} />
              </Tab>

              <Tab eventKey="addProduct" title="Add Product">
                <AddProductForm onAddProduct={handleAddProduct} />
              </Tab>

              <Tab eventKey="addStock" title="Add Stock">
                <AddStockForm products={products} setProducts={setProducts} />
              </Tab>

              <Tab eventKey="sales" title="Sales">
                <SalesForm products={products} onRecordSale={handleRecordSale} />
              </Tab>

              <Tab eventKey="deposit" title="Deposits">
                <DepositProduct products={products} onAddDeposit={handleAddDeposit} />
                <DepositTable deposits={deposits} onUpdateDepositStatus={handleUpdateDepositStatus} />
              </Tab>

              <Tab eventKey="exchange" title="Exchange">
                <ExchangeForm products={products} onAddExchange={handleAddExchange} />
                <ExchangeTable exchanges={exchanges} />
              </Tab>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
