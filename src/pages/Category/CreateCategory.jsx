import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { REACT_APP_API_URL, REACT_APP_IMAGE_URL } from "../../config/ApiConfig";

const CreateCategory = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();

  const editData = location.state;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [status, setStatus] = useState("Y");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    let imageValue = String(imagePath).trim();

    console.log("Original Image:", imageValue);

    if (imageValue.startsWith("http://") || imageValue.startsWith("https://")) {
      return imageValue;
    }

    imageValue = imageValue.replace(/^\/+/, "");

    if (imageValue.startsWith("category/")) {
      return `${REACT_APP_IMAGE_URL}/${imageValue}`;
    }

    return `${REACT_APP_IMAGE_URL}/category/${imageValue}`;
  };

  useEffect(() => {
    console.log("EDIT DATA:", editData);

    if (editData) {
      setName(editData.name || "");

      setDescription(editData.description || "");

      setParentId(editData.parentId?._id || editData.parentId || "");

      setStatus(editData.status || "Y");

      let existingImage = "";

      if (editData.categoryImage) {
        existingImage = editData.categoryImage;
      } else if (editData.image) {
        existingImage = editData.image;
      } else if (editData.category?.categoryImage) {
        existingImage = editData.category.categoryImage;
      }

      console.log("Existing Category Image:", existingImage);

      if (existingImage) {
        const imageUrl = getImageUrl(existingImage);

        console.log("Final Image URL:", imageUrl);

        setImagePreview(imageUrl);
      } else {
        console.log("No existing category image found");

        setImagePreview("");
      }
    }

    fetchCategories();
  }, [editData]);

  const fetchCategories = async () => {
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/allCategory`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Categories Response:", res.data);

      if (res.data.success) {
        setCategories(res.data.data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log(
        "Category Fetch Error:",
        error.response?.data || error.message,
      );

      setCategories([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");

    const input = document.getElementById("category-image-input");

    if (input) {
      input.value = "";
    }
  };

  const handleImageError = (e) => {
    console.log("IMAGE LOAD ERROR:", e.target.src);

    if (!e.target.dataset.fallback && editData?.categoryImage) {
      const imageName = String(editData.categoryImage).replace(/^\/+/, "");

      e.target.dataset.fallback = "true";

      e.target.src = `${REACT_APP_IMAGE_URL}/category/${imageName}`;
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      if (editData) {
        data.append("id", editData._id);
      }

      data.append("name", name);

      data.append("description", description);

      data.append("status", status);

      if (parentId) {
        data.append("parentId", parentId);
      }

      if (image) {
        data.append("categoryImage", image);
      }

      let res;

      if (editData) {
        res = await axios.post(
          `${REACT_APP_API_URL}/admin/updateCategory`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        res = await axios.post(`${REACT_APP_API_URL}/admin/category`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Category Submit Response:", res.data);

      alert(
        res.data.message ||
          (editData
            ? "Category updated successfully"
            : "Category created successfully"),
      );

      window.dispatchEvent(new Event("dashboardUpdate"));

      navigate("/category");
    } catch (error) {
      console.log(
        "CATEGORY SUBMIT ERROR:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form-page">
      <div className="category-form-header">
        <h2>{editData ? "Update Category" : "Create Category"}</h2>

        <p>{editData ? "Update category information" : "Add a new category"}</p>
      </div>

      <form className="category-form" onSubmit={submit}>
        <div className="category-image-section">
          <label
            htmlFor="category-image-input"
            className="category-image-box"
            title="Click to select image"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Category Preview"
                className="category-image-preview"
                onError={handleImageError}
              />
            ) : (
              <div className="category-image-placeholder">
                <span>📷</span>

                <p>Click to add image</p>
              </div>
            )}

            <input
              id="category-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <button
              type="button"
              className="remove-image-btn"
              onClick={removeImage}
            >
              Remove Image
            </button>
          )}
        </div>

        <div className="category-form-group">
          <label>Category Name</label>

          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="category-form-group">
          <label>Description</label>

          <textarea
            placeholder="Enter category description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
          />
        </div>

        <div className="category-form-group">
          <label>Parent Category</label>

          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">Select Parent Category</option>

            {categories
              .filter((category) => !editData || category._id !== editData._id)
              .map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="category-form-group">
          <label>Status</label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Y">Active</option>

            <option value="N">Inactive</option>
          </select>
        </div>

        <div className="category-form-buttons">
          <button
            type="submit"
            className="category-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Please Wait..."
              : editData
                ? "Update Category"
                : "Create Category"}
          </button>

          <button
            type="button"
            className="category-back-btn"
            onClick={() => navigate("/category")}
            disabled={loading}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
