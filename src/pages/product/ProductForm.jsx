import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { REACT_APP_API_URL, REACT_APP_IMAGE_URL } from "../../config/ApiConfig";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const isEdit = Boolean(id);

  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    status: "Y",
  });

  useEffect(() => {
    getCategories();

    if (isEdit) {
      getProduct();
    }
  }, [id]);

  const getCategories = async () => {
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

      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (error) {
      console.log("CATEGORY ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Category fetch failed");
    }
  };

  // GET S
  // =====================================================

  const getProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/get/product`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("SINGLE PRODUCT:", res.data);

      if (res.data.success) {
        const product = res.data.data;

        setFormData({
          name: product.name || "",

          description: product.description || "",

          price: product.price ?? "",

          stock: product.stock ?? "",

          categoryId: product.categoryId?._id || product.categoryId || "",

          status: product.status || "Y",
        });

        let existingImages = [];

        if (Array.isArray(product.productImages)) {
          existingImages = product.productImages;
        } else if (Array.isArray(product.images)) {
          existingImages = product.images;
        } else if (product.image) {
          existingImages = [product.image];
        }

        if (existingImages.length > 0) {
          const formattedImages = existingImages.map((image) => {
            if (typeof image === "string" && image.startsWith("http")) {
              return image;
            }

            return `${REACT_APP_IMAGE_URL}/${image}`;
          });

          setPreviewImages(formattedImages);
        }
      }
    } catch (error) {
      console.log("GET PRODUCT ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Product fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    setImages(files);

    // New selected image preview
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // Old existing image hata do
    setPreviewImages(newPreviews);
  };

  // =====================================================
  // OPEN FILE PICKER
  // =====================================================

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // =====================================================
  // REMOVE SELECTED IMAGES
  // =====================================================

  const removeImages = () => {
    setImages([]);

    // Edit me existing image dobara load nahi karenge.
    // User ko new image choose karni hogi.
    setPreviewImages([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submitProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // =================================================
      // ID
      // =================================================

      if (isEdit) {
        data.append("id", id);
      }

      // =================================================
      // FORM DATA
      // =================================================

      data.append("name", formData.name);

      data.append("description", formData.description);

      data.append("price", formData.price);

      data.append("stock", formData.stock);

      data.append("categoryId", formData.categoryId);

      data.append("status", formData.status);

      // =================================================
      // IMAGES
      // =================================================

      if (images.length > 0) {
        images.forEach((file) => {
          data.append("productImages", file);
        });
      }

      // =================================================
      // URL
      // =================================================

      const url = isEdit
        ? `${REACT_APP_API_URL}/admin/update/product`
        : `${REACT_APP_API_URL}/admin/create/product`;

      // =================================================
      // API
      // =================================================

      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PRODUCT RESPONSE:", res.data);

      // =================================================
      // SUCCESS
      // =================================================

      if (res.data.success) {
        alert(
          res.data.message ||
            (isEdit
              ? "Product updated successfully"
              : "Product created successfully"),
        );

        window.dispatchEvent(new Event("dashboardUpdate"));

        navigate("/product");
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(
        "PRODUCT SAVE ERROR:",
        error.response?.data || error.message || error,
      );

      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/product");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="product-form-page">
      <div className="product-form-box">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="form-header">
          <div>
            <h2>{isEdit ? "Edit Product" : "Create Product"}</h2>

            <p>{isEdit ? "Update product details" : "Add a new product"}</p>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && isEdit ? (
          <div className="form-loading">Loading product...</div>
        ) : (
          <form onSubmit={submitProduct}>
            <div className="product-image-section">
              <label className="product-image-title">Product Image</label>

              <div className="product-image-box" onClick={openFilePicker}>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="productImages"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {/* IMAGE PREVIEW */}

                {previewImages.length > 0 ? (
                  <div className="product-image-preview-wrapper">
                    {previewImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="product-image-preview"
                      />
                    ))}
                  </div>
                ) : (
                  /* PLACEHOLDER */

                  <div className="product-image-placeholder">
                    <span className="product-image-icon">📷</span>

                    <p>Click to upload</p>

                    <small>Select product image</small>
                  </div>
                )}
              </div>

              {/* SELECTED FILE NAME */}

              {images.length > 0 && (
                <div className="selected-images">
                  {images.map((file, index) => (
                    <div className="selected-image" key={index}>
                      {file.name}
                    </div>
                  ))}
                </div>
              )}

              {/* REMOVE */}
            </div>

            {/* =================================================
                NAME
            ================================================= */}

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            {/* =================================================
                PRICE + STOCK
            ================================================= */}

            <div className="form-row">
              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  placeholder="Enter stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* =================================================
                CATEGORY + STATUS
            ================================================= */}

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Y">Active</option>

                  <option value="N">Inactive</option>
                </select>
              </div>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="form-buttons">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Product"
                    : "Create Product"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
