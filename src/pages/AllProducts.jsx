import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/products", {
          headers: {
            Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
          },
        });
        const data = await response.json();
        const sortedProducts = data.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/categories", {
          headers: {
            Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filteredByCategory = selectedCategory
      ? products.filter(
          (product) => product.category.id === parseInt(selectedCategory)
        )
      : products;

    const searchResults = filteredByCategory.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.condition &&
          product.condition.condition &&
          product.condition.condition
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        product.owner.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(searchResults);
  }, [searchQuery, selectedCategory, products]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
  };

  if (loading) return <div>Loading...</div>;

  const availableProducts = filteredProducts.filter(
    (product) => product.status === "available"
  );

  return (
    <div className="p-4">
      <h1 className="text-7xl font-bold mb-5 text-center">All Products</h1>
      <div className="flex justify-center mb-4">
        <Link to="/addProduct">
          <button className="bg-blue-500 text-white py-2 px-4">
            Add New Product
          </button>
        </Link>
      </div>
      <div className="flex justify-between mb-4">
        <label className="block">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border rounded p-2 w-full"
          />
        </label>
        <label className="block ml-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border p-2 w-40"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableProducts.length > 0 ? (
          availableProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <div className="border rounded-lg shadow-lg p-4 transition-transform duration-100 ease-in-out transform hover:shadow-xl hover:scale-105 bg-white">
                <img
                  src={product.product_img || "placeholder-image-url"}
                  alt="Product"
                  className="w-full h-64 object-contain mb-6 rounded-lg bg-white"
                />
                <h2 className="text-3xl font-semibold text-center">
                  {product.name}
                </h2>
                <p className="text-center">
                  <span className="font-semibold">Condition:</span>{" "}
                  {product.condition.condition}
                  {" - "}
                  <span className="font-semibold">Owner:</span>{" "}
                  {product.owner.username}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No available products found.</p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
