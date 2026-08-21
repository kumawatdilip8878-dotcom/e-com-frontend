import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import {REACT_APP_API_URL,REACT_APP_IMAGE_URL} from "../../config/ApiConfig"

import { useNavigate } from "react-router-dom";

import CategoryList from "./CategoryList";


const Category = () => {
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // =========================
  // GET ALL CATEGORIES
  // =========================

  const fetchCategories = useCallback(async () => {
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
        setCategories(res.data.data);
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to fetch categories");
    }
  }, [token]);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="category-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Category Management</h2>

        <button
          className="create-btn"
          onClick={() => navigate("/category/form")}
        >
          + Create Category
        </button>
      </div>

      <CategoryList categories={categories} fetchCategories={fetchCategories} />
    </div>
  );
};

export default Category;
