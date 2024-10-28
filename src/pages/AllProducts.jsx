import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

export const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

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

  const availableProducts = filteredProducts.filter(
    (product) => product.status === "available"
  );

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      const filtered = products.filter(
        (product) => product.category.id === parseInt(categoryId)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-5">All Products</h1>
      <Link to="/addProduct">
        <button className="bg-blue-500 text-white py-2 px-4 mb-4">
          Add New Product
        </button>
      </Link>
      <label className="block mb-4">
        <span>Filter by Category</span>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 w-full mt-1"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableProducts.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <div className="border rounded-lg shadow-lg p-4">
              {/* Placeholder image */}
              <img
                src="https://via.placeholder.com/150"
                alt="Product"
                className="w-full h-40 object-cover mb-4"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p>Category: {product.category.name}</p>
              <p>Condition: {product.condition.condition}</p>
              <p>Owner: {product.owner.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
