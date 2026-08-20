
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaThLarge,
  FaBox,
  FaStore,
  FaShoppingCart,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { REACT_APP_API_URL } from "../config/ApiConfig";

const Sidebar = () => {
  const token = localStorage.getItem("token");

  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // GET CART
  // =====================================================

  useEffect(() => {
    if (token) {
      getCart();
    } else {
      setCartCount(0);
    }
  }, [token]);

  // =====================================================
  // GET CART FUNCTION
  // =====================================================

  const getCart = async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/user/cart`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("CART RESPONSE:", res.data);

      if (res.data.success) {
        const cartData =
          res.data.cart ||
          res.data.data ||
          [];

        setCartCount(cartData.length || 0);
      }
    } catch (error) {
      console.log(
        "CART ERROR:",
        error.response?.data || error
      );

      setCartCount(0);
    }
  };

  // =====================================================
  // CLOSE SIDEBAR
  // =====================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =====================================================
  // ACTIVE CLASS
  // =====================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

  return (
    <>
      {/* =================================================
          MOBILE MENU BUTTON
      ================================================= */}

      <button
        className="sidebar-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* =================================================
          OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* SIDEBAR HEADER */}

        <div className="sidebar-header">
          <h3>Menu</h3>

          <button
            onClick={closeSidebar}
            className="sidebar-close-btn"
          >
            <FaTimes />
          </button>
        </div>

        {/* =================================================
            MENU
        ================================================= */}

        <nav className="sidebar-nav">

          {/* HOME */}

          <Link
            to="/dashboard"
            className={
              isActive("/dashboard")
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FaHome />

            <span>
              Overview
            </span>
          </Link>
<Link
            to="/users"
            className={
              isActive("/users")
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FaBox />

            <span>
              Users
            </span>
          </Link>
          {/* CATEGORY */}

          <Link
            to="/category"
            className={
              isActive("/category")
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FaThLarge />

            <span>
              Category
            </span>
          </Link>


          {/* PRODUCT */}

          <Link
            to="/product"
            className={
              isActive("/product")
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FaBox />

            <span>
              Product
            </span>
          </Link>


          <Link
            to="/orders"
            className={
              isActive("/orders")
                ? "sidebar-link active"
                : "sidebar-link"
            }
            onClick={closeSidebar}
          >
            <FaShoppingBag />

            <span>
              Orders
            </span>
          </Link>

        </nav>

      </aside>
    </>
  );
};

export default Sidebar;

