import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [ownedProducts, setOwnedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      fetchOwnedProducts(profileData.id);
    }
  }, [profileData]);

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
    } catch (error) {
      console.error("Error fetching owned products:", error);
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="profile-header bg-white p-6 rounded-lg shadow-sm mb-10">
        <h1 className="text-4xl font-bold text-center mb-4">
          {profileData.username}&apos;s Profile
        </h1>
        <div className="flex flex-col items-center">
          <img
            src={profileData.profile_picture || "default_profile_picture.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover"
          />
          <p className="text-lg text-gray-700 mb-2">
            ShareBear Member Since:{" "}
            {profileData.date_joined
              ? new Date(profileData.date_joined).toLocaleDateString()
              : "Date not available"}
          </p>
          <button
            onClick={() => navigate("/profile/edit")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-semibold text-center mb-6">Your Products</h2>
      <div className="flex justify-center mb-4">
        <Link to="/addProduct">
          <button className="bg-blue-500 text-white py-2 px-4">
            Add New Product
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownedProducts.length > 0 ? (
          ownedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <img
                src={product.product_img || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded-lg bg-gray-100"
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
