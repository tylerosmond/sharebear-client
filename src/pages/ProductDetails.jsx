import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      });
  }, [id]);

  const handleDelete = () => {
    fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    }).then(() => {
      navigate("/allProducts"); // Redirect to All Products after deletion
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Ensure that localStorage is available and contains user data
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner =
    product.owner && loggedInUser && product.owner.id === loggedInUser.id;

  // Function to render additional info based on category
  const renderAdditionalInfo = () => {
    switch (product.category.name) {
      case "Toys":
        return (
          <p>Minimum Age: {product.min_age ? product.min_age.age : "N/A"}</p>
        );
      case "Clothing":
        return <p>Size: {product.size.size || "N/A"}</p>;
      case "Accessories":
        return <p>Weight Limit: {product.max_weight.weight || "N/A"}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img
        src={product.product_img || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-full h-64 object-cover mb-4"
      />
      <p className="text-lg">{product.description}</p>
      <p>Category: {product.category.name}</p>
      {renderAdditionalInfo()}
      <p>Condition: {product.condition.condition}</p>
      <p>Owner: {product.owner.username}</p>
      <p>Status: {product.status}</p>
      <p>Created On: {new Date(product.created).toLocaleDateString()}</p>

      {isOwner && (
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 mr-2"
            onClick={() => navigate(`/editProduct/${id}`)} // Ensure route matches your Edit Product component
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4"
            onClick={() => setShowModal(true)}
          >
            Delete
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2>Are you sure you want to delete?</h2>
            <div className="mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 mr-2"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 py-2 px-4"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
