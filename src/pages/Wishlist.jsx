import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-2xl font-bold">Your Wishlist</h1>
      <ul className="mt-4">
        {wishlistItems.map((item) => (
          <li key={item.id} className="border-b py-2">
            {/* Placeholder image */}
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-40 object-cover mb-4"
            />
            <h2 className="text-lg">{item.product.name}</h2>
            <p>{item.product.description}</p>
            <button
              className="bg-red-500 text-white py-1 px-3 mt-2"
              onClick={() => removeFromWishlist(item.id)}
            >
              Remove from Wishlist
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
