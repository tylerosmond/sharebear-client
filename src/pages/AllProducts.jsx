import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

export const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/products", {
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  // Filter to show only available products
  const availableProducts = products.filter(
    (product) => product.status === "available"
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <h1 className="text-3xl font-bold mb-5">All Products</h1>
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
