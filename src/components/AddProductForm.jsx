import React, { useState } from 'react';


const AddProductForm = ({ onAddProduct }) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stock = parseInt(product.stock, 10);
    const price = parseFloat(product.price);

    // Extra safety checks
    if (
      product.name.trim() === '' ||
      product.category.trim() === '' ||
      isNaN(price) ||
      isNaN(stock)
    ) {
      alert('Please enter valid product details.');
      return;
    }

    const newProduct = {
      name: product.name.trim(),
      category: product.category.trim(),
      price,
      stock,
    };

    try {
      // Await the backend-confirmed product from onAddProduct
      await onAddProduct(newProduct);

      // Clear form only after successful addition
      setProduct({
        name: '',
        category: '',
        price: '',
        stock: '',
      });
    } catch (err) {
        console.error("Error in form submit:", err); // Check this first in browser console
        if (err.status === 409){
          alert('Product already exists!');
        } else {
        //   console.error('Failed to add product:', err);
          alert(err.message ||'An error occurred while adding the product.');
        }
      }
  };

  return (
    <div className='stock-container'>
      <h2>➕ Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price (₦)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
