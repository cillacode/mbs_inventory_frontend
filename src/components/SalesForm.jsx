import React, { useState, useEffect } from 'react';

const SalesForm = ({ products, onRecordSale }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [salespeople, setSalespeople] = useState([]);


 const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch salespeople data (this can be hardcoded or fetched from an API)
  useEffect(() => {
    // For now, using hardcoded salespeople
    setSalespeople([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Mark Johnson' },
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !category || !quantity || parseInt(quantity) <= 0 || !salesperson) {
      alert('Please select a valid product, category, quantity, and salesperson.');
      return;
    }

    try {
      const res = await fetch('${apiUrl}/products/record-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: parseInt(quantity),
          category,
          salesperson,
        }),
      });


      console.log('Response Status:', res.status);
      const data = await res.json();
      console.log('Response Data:', data);
      

      if (res.ok) {
        alert('Sale recorded successfully!');
        // Call onRecordSale function to update the ProductTable
        onRecordSale(productId, parseInt(quantity));
        setProductId('');
        setQuantity('');
        setCategory('');
        setSalesperson('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to record sale.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="stock-container">
      <h2>💰 Record Sale</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="product">Product</label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {Array.from(new Set(products.map((p) => p.category))).map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity">Quantity Sold</label>
          <input
            type="number"
            id="quantity"
            placeholder="Quantity Sold"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="salesperson">Salesperson</label>
          <select
            id="salesperson"
            value={salesperson}
            onChange={(e) => setSalesperson(e.target.value)}
          >
            <option value="">-- Select Salesperson --</option>
            {salespeople.map((person) => (
              <option key={person.id} value={person.name}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Record Sale</button>
      </form>
    </div>
  );
};

export default SalesForm;
