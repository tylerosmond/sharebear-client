import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // Stores the selected category ID
  const [condition, setCondition] = useState("");
  const [ageOptions, setAgeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [weightOptions, setWeightOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Selected option based on category
  const [conditions, setConditions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); // New state for image URL
  const [error, setError] = useState(""); // State for error messages

  // Mapping for category IDs
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

  useEffect(() => {
    fetchData("http://localhost:8000/categories", setCategories);
    fetchData("http://localhost:8000/conditions", setConditions);
    fetchData("http://localhost:8000/ages", setAgeOptions);
    fetchData("http://localhost:8000/sizes", setSizeOptions);
    fetchData("http://localhost:8000/weights", setWeightOptions);
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryPk = e.target.value; // Get the pk of selected category
    setCategory(selectedCategoryPk);
    setSelectedOption(""); // Reset selected option when category changes
  };

  const handleSelectedOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const defaultImageUrl = "https://via.placeholder.com/150"; // Default image URL
    const productData = {
      name,
      description,
      category: parseInt(category), // Send the category ID
      condition: parseInt(condition), // Send the condition ID
      ...(parseInt(category) === categoryIds.Toys && {
        min_age: selectedOption,
      }), // Send the age ID directly
      ...(parseInt(category) === categoryIds.Clothing && {
        size: selectedOption,
      }), // Send the size ID directly
      ...(parseInt(category) === categoryIds.Accessories && {
        max_weight: selectedOption,
      }), // Send the weight ID directly
      product_img: imageUrl || defaultImageUrl, // Use the default if imgUrl is empty
    };

    fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("sharebear_token")}`,
      },
      body: JSON.stringify(productData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create product");
        }
        return response.json();
      })
      .then(() => {
        navigate("/allProducts");
      })
      .catch((error) => {
        setError("Error creating product. Please try again."); // Set error message
        console.error("Error creating product:", error);
      });
  };

  const getDynamicDropdownTitle = () => {
    switch (
      parseInt(category) // Ensure category is parsed as an integer
    ) {
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
      <h1 className="text-2xl font-bold">Create Product</h1>
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
              {cat.name} {/* Display category name */}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span>{getDynamicDropdownTitle()}</span>
        <select
          value={selectedOption}
          onChange={handleSelectedOptionChange} // Use the new handler
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
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Product
      </button>
    </form>
  );
};

export default CreateProduct;
