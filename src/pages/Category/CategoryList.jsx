import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REACT_APP_API_URL, REACT_APP_IMAGE_URL } from "../../config/ApiConfig";

const CategoryList = ({ categories = [], fetchCategories }) => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/deleteCategory`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);

      window.dispatchEvent(new Event("dashboardUpdate"));

      await fetchCategories();
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const changeStatus = async (id) => {
    try {
      console.log("Changing Category Status:", id);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/changeCategoryStatus`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("STATUS RESPONSE:", res.data);

      alert(res.data.message);

      await fetchCategories();

      window.dispatchEvent(new Event("dashboardUpdate"));
    } catch (error) {
      console.log("STATUS ERROR:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Status update failed");
    }
  };

  const editCategory = (category) => {
    navigate("/category/form", {
      state: category,
    });
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    image = String(image);

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    image = image.replace(/^\/+/, "");

    return `${REACT_APP_IMAGE_URL}/${image}`;
  };

  return (
    <div className="table-box">
      <table>
        {/* TABLE HEADER */}

        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Parent</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        {/* TABLE BODY */}

        <tbody>
          {categories.length > 0 ? (
            categories.map((item) => {
              const imageUrl = getImageUrl(item.image);

              return (
                <tr key={item._id}>
                  {/* IMAGE */}

                  <td className="category-image-cell">
                    {item.image ? (
                      <img
                        src={imageUrl}
                        alt={item.name || "Category"}
                        className="category-table-image"
                        onError={(e) => {
                          console.log(
                            "CATEGORY IMAGE ERROR:",
                            e.currentTarget.src,
                          );

                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="category-no-image">No Image</span>
                    )}
                  </td>

                  {/* NAME */}

                  <td>
                    <strong>{item.name || "-"}</strong>
                  </td>

                  {/* DESCRIPTION */}

                  <td className="category-description">
                    {item.description || "-"}
                  </td>

                  {/* PARENT */}

                  <td>{item.parentId?.name || "-"}</td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={
                        item.status === "Y"
                          ? "category-status-active"
                          : "category-status-inactive"
                      }
                    >
                      {item.status === "Y" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td className="category-action-cell">
                    <div className="category-actions">
                      {/* EDIT */}

                      <button
                        type="button"
                        className="category-icon-btn edit"
                        title="Edit Category"
                        onClick={() => editCategory(item)}
                      >
                        ✏️
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        className="category-icon-btn delete"
                        title="Delete Category"
                        onClick={() => deleteCategory(item._id)}
                      >
                        🗑️
                      </button>

                      {/* STATUS */}

                      <button
                        type="button"
                        className="category-icon-btn status"
                        title={item.status === "Y" ? "Deactivate" : "Activate"}
                        onClick={() => changeStatus(item._id)}
                      >
                        {item.status === "Y" ? "🔴" : "🟢"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No Categories Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
