import React, { useState, useMemo } from 'react';

const AddStockForm = ({ products, setProducts }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

   const apiUrl = import.meta.env.VITE_API_URL
   
  // Derive unique categories from products
  const categories = useMemo(() => {
    const allCategories = products.map((p) => p.category);
    return [...new Set(allCategories)].filter(Boolean);
  }, [products]);

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    setProductId(selectedId);

    const selectedProduct = products.find((p) => p.id.toString() === selectedId);
    if (selectedProduct) {
      setCategory(selectedProduct.category || '');
    } else {
      setCategory('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity || !category) return;
  
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/products/${productId}/add-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: parseInt(quantity), category }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        
        throw new Error(result?.error || 'Failed to add stock');
      }
  
      const updatedProduct = result.product;
  
      // // ✅ Replace only the updated product
      // const updatedProducts = products.map((product) =>
      //   product.id === updatedProduct.id ? updatedProduct : product
      // );
      // setProducts(updatedProducts);
  
       // ✅ Replace only the updated product in state, using full response
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
      setMessage('✅ Stock added successfully!');
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
      setProductId('');
      setQuantity('');
      setCategory('');
    }
  };
  

  return (
    <div className="stock-container">
      <h2>➕ Add Stock</h2>
      <form onSubmit={handleSubmit}>
        <select value={productId} onChange={handleProductChange}>
          <option value="">-- Select Product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- Select Category --</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Stock'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddStockForm;
