import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Change here

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Change here
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    // Add other fields as necessary
  });

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description,
          category: data.category.id,
          condition: data.condition.id,
          // Initialize other fields
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
      body: JSON.stringify(formData),
    }).then(() => {
      navigate(`/products/${id}`); // Redirect to product details after edit
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Render input fields for each product attribute */}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      {/* Add other input fields */}
      <button type="submit">Update Product</button>
    </form>
  );
};

export default EditProduct;
