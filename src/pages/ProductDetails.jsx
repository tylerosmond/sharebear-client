import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [wishlistItemId, setWishlistItemId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        checkIfInWishlist(data.id);
      });
  }, [id]);

  const checkIfInWishlist = (productId) => {
    fetch(`http://localhost:8000/wishlist`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => response.json())
      .then((wishlistItems) => {
        const wishlistItem = wishlistItems.find(
          (item) => item.product.id === productId
        );
        const isInWishlist = Boolean(wishlistItem);
        setIsInWishlist(isInWishlist);
        setWishlistItemId(wishlistItem ? wishlistItem.id : null);
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  };

  const handleWishlist = (action) => {
    const url =
      action === "add"
        ? `http://localhost:8000/wishlist`
        : `http://localhost:8000/wishlist/${wishlistItemId}`;
    const method = action === "add" ? "POST" : "DELETE";
    const body =
      action === "add" ? JSON.stringify({ product_id: product.id }) : undefined;

    // Update state before the fetch to immediately reflect the UI change
    const wasInWishlist = isInWishlist;
    const newIsInWishlist = action === "add";

    setIsInWishlist(newIsInWishlist);

    // Only update wishlistItemId for add action
    if (newIsInWishlist) {
      setWishlistItemId(null); // Reset the ID, we'll fetch it again after adding
    }

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
      body: body,
    })
      .then((response) => {
        if (response.ok) {
          if (action === "add") {
            // After adding, we should fetch the updated wishlist
            checkIfInWishlist(product.id);
          }
          setModalMessage(
            action === "add"
              ? `${product.name} added to Wishlist!`
              : `${product.name} removed from Wishlist`
          );
          setShowModal(true);
        } else {
          setIsInWishlist(wasInWishlist); // Revert to previous state
          return response.json().then((errorData) => {
            console.error("Error:", errorData.message);
            setModalMessage("Failed to update wishlist. Please try again.");
            setShowModal(true);
          });
        }
      })
      .catch((error) => {
        setIsInWishlist(wasInWishlist); // Revert to previous state
        console.error("Network error:", error);
        setModalMessage("Network error. Please try again.");
        setShowModal(true);
      });
  };

  const handleDeleteProduct = () => {
    fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate("/allProducts"); // Navigate back to all products after deletion
        } else {
          console.error("Failed to delete product.");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner =
    product.owner && loggedInUser && product.owner.id === loggedInUser.id;

  const renderAdditionalInfo = () => {
    switch (product.category.name) {
      case "Toys":
        return (
          <p>Minimum Age: {product.min_age ? product.min_age.age : "N/A"}+</p>
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
      <h1 className="text-3xl font-bold text-center mb-5">{product.name}</h1>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Product Image */}
        <img
          src={product.product_img || "https://via.placeholder.com/150"}
          alt={product.name}
          className="w-full h-64 object-contain mb-6 rounded-lg bg-gray-100"
        />

        {/* Product Description */}
        <p className="text-lg text-center mb-6">{product.description}</p>
        <p className="text-lg text-center mb-6">{renderAdditionalInfo()}</p>

        {/* Product Details (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center text-center mb-6">
          <div>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.category.name}
            </p>
            <p>
              <span className="font-semibold">Condition:</span>{" "}
              {product.condition.condition}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Owner:</span>{" "}
              {product.owner.username}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {product.status}
            </p>
          </div>

          {/* Date Created (centered below both columns) */}
          <div className="col-span-full mt-4">
            <p>
              <span className="font-semibold">Created On:</span>{" "}
              {new Date(product.created).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Buttons */}
        {isOwner && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => navigate(`/editProduct/${id}`)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        )}

        {!isOwner && (
          <div className="mt-4 flex justify-center">
            {isInWishlist ? (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => handleWishlist("remove")}
              >
                Remove from Wishlist
              </button>
            ) : (
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={() => handleWishlist("add")}
              >
                Add to Wishlist
              </button>
            )}
          </div>
        )}

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2>{modalMessage}</h2>
              <button
                className="bg-blue-500 text-white py-2 px-4 mt-4"
                onClick={handleCloseModal}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2>Are you sure you want to delete this product?</h2>
              <button
                className="bg-red-500 text-white py-2 px-4 mt-4"
                onClick={handleDeleteProduct}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 mt-4"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
