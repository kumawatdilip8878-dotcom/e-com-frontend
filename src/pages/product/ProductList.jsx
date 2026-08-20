import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { REACT_APP_API_URL, REACT_APP_IMAGE_URL } from "../../config/ApiConfig";

const ProductList = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/getAll/product`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("PRODUCT DATA:", res.data);

      if (res.data.success) {
        setProducts(res.data.data || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log("GET PRODUCT ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Product fetch failed");
    } finally {
      setLoading(false);
    }
  };


  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/delete/product`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message || "Product deleted successfully");

      window.dispatchEvent(new Event("dashboardUpdate"));

      getProducts();
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const editProduct = (id) => {
    console.log("EDIT PRODUCT ID:", id);

    navigate(`/product/form/${id}`);
  };


  const getImageUrl = (item) => {
    let imageName = null;

    if (Array.isArray(item.productImages) && item.productImages.length > 0) {
      imageName = item.productImages[0];
    } else if (Array.isArray(item.images) && item.images.length > 0) {
      imageName = item.images[0];
    } else if (item.image) {
      imageName = item.image;
    }

    if (!imageName) {
      return null;
    }

    imageName = String(imageName);

    // Already complete URL
    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }

    imageName = imageName.replace(/^\/+/, "");

    // uploads/...
    if (imageName.startsWith("uploads/")) {
      return `${REACT_APP_IMAGE_URL}/${imageName}`;
    }

    // product/...
    if (imageName.startsWith("product/")) {
      return `${REACT_APP_IMAGE_URL}/${imageName}`;
    }

    // filename only
    return `${REACT_APP_IMAGE_URL}/product/${imageName}`;
  };

  return (
    <div className="product-page">
     

      <div className="product-header">
        <div>
          <h2>Product List</h2>
          <p>Manage your products</p>
        </div>

        <button
          type="button"
          className="add-btn"
          onClick={() => navigate("/product/form")}
        >
          ＋ Add Product
        </button>
      </div>


      <div className="table-box">
        {loading ? (
          <div className="loading-box">Loading products...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((item) => {
                  const imageUrl = getImageUrl(item);

                  return (
                    <tr key={item._id}>
                      {/* IMAGE */}

                      <td className="product-image-cell">
                        {imageUrl ? (
                          <div className="product-image-wrapper">
                            <img
                              src={imageUrl}
                              alt={item.name || "Product"}
                              className="product-list-image"
                              onLoad={() => {
                                console.log("IMAGE LOADED:", imageUrl);
                              }}
                              onError={(e) => {
                                console.log(
                                  "IMAGE ERROR:",
                                  e.currentTarget.src,
                                );

                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </td>

                      {/* NAME */}

                      <td>
                        <strong>{item.name || "-"}</strong>
                      </td>

                      {/* DESCRIPTION */}

                      <td className="description-cell">
                        {item.description || "-"}
                      </td>

                      {/* PRICE */}

                      <td>₹ {item.price || 0}</td>

                      {/* STOCK */}

                      <td>{item.stock ?? 0}</td>

                      {/* CATEGORY */}

                      <td>
                        {item.categoryId?.name || item.category?.name || "-"}
                      </td>

                      {/* STATUS */}

                      <td>
                        {item.status === "Y" ? (
                          <span className="active">Active</span>
                        ) : (
                          <span className="inactive">Inactive</span>
                        )}
                      </td>

                      {/* =================================
                          ACTION
                      ================================= */}

                      <td>
                        <div className="product-actions">
                          {/* EDIT ICON */}

                          <button
                            type="button"
                            className="product-action-icon edit-icon"
                            title="Edit Product"
                            onClick={() => editProduct(item._id)}
                          >
                            ✏️
                          </button>

                          {/* DELETE ICON */}

                          <button
                            type="button"
                            className="product-action-icon delete-icon"
                            title="Delete Product"
                            onClick={() => deleteProduct(item._id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="no-product">
                    No Product Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductList;
