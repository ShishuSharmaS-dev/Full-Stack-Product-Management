import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  // Wrap fetchProducts with useCallback
  const fetchProducts = useCallback(async () => {
    try {
      let url = `http://localhost:5000/products?search=${search}&sort=${sort}`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async () => {
    await axios.post("http://localhost:5000/products", newProduct);
    setNewProduct({ name: "", price: "" });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Product Management</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="form-control mb-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select className="form-control mb-2" onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort by Price</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>

      {/* Add Product */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          className="form-control me-2"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button className="btn btn-success" onClick={addProduct}>
          Add
        </button>
      </div>

      {/* Product List */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product.id || index}>
                <td>{product?.name || "No Name"}</td>
                <td>₹{!isNaN(parseFloat(product?.price)) ? parseFloat(product?.price).toFixed(2) : "0.00"}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No products found.</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-center">
              Total Products: {products.length}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default App;
