import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (profileData) {
      fetchOwnedProducts(profileData.id);
    }
  }, [profileData]);

  useEffect(() => {
    const filteredByCategory = selectedCategory
      ? ownedProducts.filter(
          (product) => product.category.id === parseInt(selectedCategory)
        )
      : ownedProducts;

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
  }, [searchQuery, selectedCategory, ownedProducts]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
        },
      });
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchOwnedProducts = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/products/${userId}/owned-by-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
          },
        }
      );
      const data = await response.json();
      setOwnedProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching owned products:", error);
    }
  };

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="profile-header bg-white p-6 rounded-lg shadow-sm mb-5">
        <h1 className="text-7xl font-bold text-center mb-4">
          {/* {profileData.username}&apos;s Profile */}
          {profileData.username}
        </h1>
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-700">
            ShareBear Member Since:{" "}
            {profileData.date_joined
              ? new Date(profileData.date_joined).toLocaleDateString()
              : "Date not available"}
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-semibold text-center mb-1">Your Products</h2>

      {/* Search and Category Filter Section */}
      <div className="flex justify-between mb-4">
        <label className="block">
          <input
            type="text"
            placeholder="Search your products..."
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

      <div className="flex justify-center mb-4">
        <Link to="/addProduct">
          <button className="bg-blue-500 text-white py-2 px-4">
            Add New Product
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow bg-white"
            >
              <img
                src={product.product_img || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded-lg bg-white"
              />
              <h3 className="text-lg font-semibold text-center mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {product.description}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            You have not added any products yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
