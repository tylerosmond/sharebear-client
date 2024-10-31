import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await fetch("http://localhost:8000/wishlist", {
          headers: {
            Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist items");
        }

        const data = await response.json();
        setWishlistItems(data);
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    };

    fetchWishlistItems();
  }, []);

  const removeFromWishlist = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/wishlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
        },
      });

      if (response.ok) {
        // Remove the item from the local state
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      } else {
        throw new Error("Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  if (wishlistItems.length === 0) {
    return <div className="p-4">No items in Wishlist</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-7xl text-center font-bold mb-5">Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow bg-white"
          >
            <Link to={`/products/${item.product.id}`}>
              <img
                src={
                  item.product.product_img || "https://via.placeholder.com/150"
                }
                alt="Product"
                className="w-full h-64 object-contain mb-6 rounded-lg bg-white"
              />
            </Link>
            <h2 className="text-3xl text-center font-semibold">
              {item.product.name}
            </h2>
            <p className="text-gray-600 text-center mb-4">
              {item.product.description}
            </p>
            <p className="text-center">
              <span className="font-semibold">Condition:</span>{" "}
              {item.product.condition.condition}
              {" - "}
              <span className="font-semibold">Owner:</span>{" "}
              {item.product.owner.username}
            </p>
            <div className="flex justify-center mt-2">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
