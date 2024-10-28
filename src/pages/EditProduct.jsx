import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [ageOptions, setAgeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [weightOptions, setWeightOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [conditions, setConditions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const categoryIds = {
    Toys: 1, // Replace with actual ID for Toys
    Clothing: 2, // Replace with actual ID for Clothing
    Accessories: 3, // Replace with actual ID for Accessories
  };

  const fetchData = (url, setter) => {
    fetch(url, {
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => response.json())
      .then(setter)
      .catch((error) => console.error(`Error fetching ${url}:`, error));
  };

  // Fetching categories, conditions, and options when the component mounts
  useEffect(() => {
    fetchData("http://localhost:8000/categories", setCategories);
    fetchData("http://localhost:8000/conditions", setConditions);
    fetchData("http://localhost:8000/ages", setAgeOptions);
    fetchData("http://localhost:8000/sizes", setSizeOptions);
    fetchData("http://localhost:8000/weights", setWeightOptions);

    // Fetch product details for editing
    fetch(`http://localhost:8000/products/${id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category.id);
        setCondition(data.condition.id);
        setImageUrl(data.product_img);
        // Set the selected option based on the category type
        if (data.category.id === categoryIds.Toys) {
          setSelectedOption(data.min_age);
        } else if (data.category.id === categoryIds.Clothing) {
          setSelectedOption(data.size);
        } else if (data.category.id === categoryIds.Accessories) {
          setSelectedOption(data.max_weight);
        }
      });
  }, [id]); // Dependency array includes id to fetch data when it changes

  const handleCategoryChange = (e) => {
    const selectedCategoryPk = e.target.value;
    setCategory(selectedCategoryPk);
    setSelectedOption(""); // Reset selected option when category changes

    // Reset specific fields based on the new category
    if (parseInt(selectedCategoryPk) === categoryIds.Toys) {
      setImageUrl(imageUrl); // Keep imageUrl as it is
      setCondition(condition); // Keep condition as it is
      setDescription(description); // Keep description as it is
      setName(name); // Keep name as it is
      setSelectedOption(""); // Clear selected option for Toys
    } else if (parseInt(selectedCategoryPk) === categoryIds.Clothing) {
      setSelectedOption(""); // Clear selected option for Clothing
      setAgeOptions(null); // Set min_age to null
    } else if (parseInt(selectedCategoryPk) === categoryIds.Accessories) {
      setSelectedOption(""); // Clear selected option for Accessories
      setSizeOptions(null); // Set size to null
    }
  };

  const handleSelectedOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const defaultImageUrl = "https://via.placeholder.com/150";
    const productData = {
      name,
      description,
      category: parseInt(category),
      condition: parseInt(condition),
      ...(parseInt(category) === categoryIds.Toys
        ? {
            min_age: selectedOption,
            size: null, // Explicitly set to null
            max_weight: null, // Explicitly set to null
          }
        : parseInt(category) === categoryIds.Clothing
        ? {
            min_age: null, // Explicitly set to null
            size: selectedOption,
            max_weight: null, // Explicitly set to null
          }
        : parseInt(category) === categoryIds.Accessories
        ? {
            min_age: null, // Explicitly set to null
            size: null, // Explicitly set to null
            max_weight: selectedOption,
          }
        : {}),
      product_img: imageUrl || defaultImageUrl,
    };

    fetch(`http://localhost:8000/products/${id}`, {
      method: "PUT", // Use PUT for updating the product
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
      body: JSON.stringify(productData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update product");
        }
        return response.json();
      })
      .then(() => {
        navigate(`/products/${id}`);
      })
      .catch((error) => {
        setError("Error updating product. Please try again.");
        console.error("Error updating product:", error);
      });
  };

  const handleCancel = () => {
    navigate(`/products/${id}`); // Redirect to product details page
  };

  const getDynamicDropdownTitle = () => {
    switch (parseInt(category)) {
      case categoryIds.Toys:
        return "Minimum Age";
      case categoryIds.Clothing:
        return "Size";
      case categoryIds.Accessories:
        return "Weight Limit (lbs)";
      default:
        return "Select Option";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <label className="block">
        <span>Product Name</span>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full mt-1"
        />
      </label>
      <label className="block">
        <span>Description</span>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full mt-1"
        />
      </label>
      <label className="block">
        <span>Condition</span>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          required
          className="border p-2 w-full mt-1"
        >
          <option value="">Select Condition</option>
          {conditions.map((cond) => (
            <option key={cond.id} value={cond.id}>
              {cond.condition}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span>Category</span>
        <select
          value={category}
          onChange={handleCategoryChange}
          required
          className="border p-2 w-full mt-1"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span>{getDynamicDropdownTitle()}</span>
        <select
          value={selectedOption}
          onChange={handleSelectedOptionChange}
          required
          className="border p-2 w-full mt-1"
        >
          <option value="">Select Option</option>
          {parseInt(category) === categoryIds.Toys &&
            ageOptions.map((age) => (
              <option key={age.id} value={age.id}>
                {age.age}
              </option>
            ))}
          {parseInt(category) === categoryIds.Clothing &&
            sizeOptions.map((size) => (
              <option key={size.id} value={size.id}>
                {size.size}
              </option>
            ))}
          {parseInt(category) === categoryIds.Accessories &&
            weightOptions.map((weight) => (
              <option key={weight.id} value={weight.id}>
                {weight.weight}
              </option>
            ))}
        </select>
      </label>
      <label className="block">
        <span>Product Image URL</span>
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 w-full mt-1"
        />
      </label>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Product
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProduct;
