// src/components/ExchangeForm.jsx
import React, { useState } from "react";

const exchangers = [" ","MBAMS", "SONOB"];
const exchangeTypes = [" ","Inflow", "Outflow"];

const ExchangeForm = ({ products, onAddExchange }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    quantity: "",
    exchange_type: "",
    exchanger: "",
    confirmed_entry: "",
    date_of_exchange: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product_name") {
      const selectedProduct = products.find((p) => p.name === value);
      setFormData((prev) => ({
        ...prev,
        product_name: value,
        category: selectedProduct ? selectedProduct.category : "",
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

    if (formData.confirmed_entry.toLowerCase() !== "no") {
      alert("Please enter this exchange in Sales or Add Stock before proceeding.");
      return;
    }

    if (!formData.product_name || !formData.category || !formData.quantity || !formData.date_of_exchange) {
      alert("Please fill all required fields.");
      return;
    }

    const exchange = {
      ...formData,
      id: Date.now().toString(),
      confirmed_entry: formData.confirmed_entry.toLowerCase() === "yes",
    };

    onAddExchange(exchange);

    // Reset form
    setFormData({
      product_name: "",
      category: "",
      quantity: "",
      exchange_type: "",
      exchanger: "",
      confirmed_entry: "",
      date_of_exchange: "",
    });
  };

  return (
    <div className="stock-container">
      <h2>📦 Record Exchange</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Product */}
        <label>
          Product:
          <select name="product_name" value={formData.product_name} onChange={handleChange}>
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        {/* Category (auto-filled) */}
        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">{formData.category || "-- Select Category --"}</option>
          </select>
        </label>

        {/* Quantity */}
        <label>
          Quantity:
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </label>

        {/* Exchange Type */}
        <label>
          Exchange Type:
          <select name="exchange_type" value={formData.exchange_type} onChange={handleChange}>
            {exchangeTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
          <small>Add this record to Sales or Add Stock as appropriate</small>
        </label>

        {/* Exchanger */}
        <label>
          Exchanger:
          <select name="exchanger" value={formData.exchanger} onChange={handleChange}>
            {exchangers.map((ex, idx) => (
              <option key={idx} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </label>

        {/* Confirmed Entry */}
<label>
  Have you entered this exchange in Sales or Add Stock?
  <select
    name="confirmed_entry"
    value={formData.confirmed_entry}
    onChange={handleChange}
    required
  >
    <option value="">-- Select Option --</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</label>


        {/* Date of Exchange */}
        <label>
          Date of Exchange:
          <input
            type="date"
            name="date_of_exchange"
            value={formData.date_of_exchange}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Save Exchange</button>
      </form>
    </div>
  );
};

export default ExchangeForm;
