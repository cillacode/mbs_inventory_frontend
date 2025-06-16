// src/components/DepositProduct.jsx
import React, { useState } from 'react';

const salesPersons = ['Gift Christopher', 'Beauty Titus', 'Mbams Admin'];

const DepositProduct = ({ products, onAddDeposit }) => {
  const [formData, setFormData] = useState({
    product: '',
    category: '',
    quantity: '',
    amountPaid: '',
    balanceLeft: '',
    salesPerson: '',
    customerName: '',
    depositDate: '',
    status: 'Not Supplied',
    deliveryDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'product') {
      const selectedProduct = products.find((p) => p.name === value);
      setFormData((prev) => ({
        ...prev,
        product: value,
        category: selectedProduct ? selectedProduct.category : '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.product || !formData.category || !formData.quantity || !formData.amountPaid || !formData.customerName || !formData.salesPerson || !formData.depositDate) {
      alert('Please fill all required fields');
      return;
    }

    const deposit = {
      ...formData,
      id: Date.now().toString(),
    };

    onAddDeposit(deposit);

    // Clear form
    setFormData({
      product: '',
      category: '',
      quantity: '',
      amountPaid: '',
      balanceLeft: '',
      salesPerson: '',
      customerName: '',
      depositDate: '',
      status: 'Not Supplied',
      deliveryDate: '',
    });
  };

  return (
    <div className='stock-container'>
      <h2>➕ Make a Deposit</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product:
          <select name="product" value={formData.product} onChange={handleChange}>
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange} >
            <option value="">{formData.category || '-- Select Category --'}</option>
          </select>
        </label>

        <label>
          Quantity:
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </label>

        <label>
          Amount Paid:
          <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} />
        </label>

        <label>
          Balance Left:
          <input type="number" name="balanceLeft" value={formData.balanceLeft} onChange={handleChange} />
        </label>

        <label>
          Sales Person:
          <select name="salesPerson" value={formData.salesPerson} onChange={handleChange}>
            <option value="">-- Select Sales Person --</option>
            {salesPersons.map((person, index) => (
              <option key={index} value={person}>
                {person}
              </option>
            ))}
          </select>
        </label>

        <label>
          Customer Name:
          <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
        </label>

        <label>
          Date of Deposit:
          <input type="date" name="depositDate" value={formData.depositDate} onChange={handleChange} />
        </label>

        <button type="submit">Submit Deposit</button>
      </form>
    </div>
  );
};

export default DepositProduct;
