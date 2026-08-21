import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { REACT_APP_API_URL } from "../../config/ApiConfig";


const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    totalUsers: 0,
    totalProducts: 0,
  });

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const fetchDashboard = async () => {
    try {
      if (!token) {
        toast.error("Authentication token missing");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/dashboard`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dashboard Response:", res.data);

      if (res.data.success) {
        setData({
          totalUsers: res.data.data?.totalUsers || 0,
          totalProducts: res.data.data?.totalProducts || 0,
        });
      } else {
        toast.error(
          res.data.message || "Dashboard data not found"
        );
      }
    } catch (error) {
      console.log(
        "Dashboard Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = async () => {
    try {
      if (!token) {
        setOrdersLoading(false);
        return;
      }

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/orders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Orders Response:", res.data);

      if (res.data.success) {
        setOrders(res.data.data || []);
      } else {
        setOrders([]);

        toast.error(
          res.data.message || "Orders not found"
        );
      }
    } catch (error) {
      console.log(
        "Orders Error:",
        error.response?.data || error.message
      );

      setOrders([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  // ==========================================
  // USE EFFECT
  // ==========================================

  useEffect(() => {
    fetchDashboard();
    fetchOrders();
  }, []);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    setLoading(true);
    setOrdersLoading(true);

    fetchDashboard();
    fetchOrders();

    toast.success("Dashboard refreshed");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-page dashboard-loading-page">
        <div className="dashboard-loading-box">
          <div className="dashboard-loader"></div>

          <h2>Loading Dashboard...</h2>

          <p>
            Please wait while we fetch your dashboard
            data.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* Background Glow */}

      <div className="dashboard-glow glow-left"></div>

      <div className="dashboard-glow glow-right"></div>


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div className="dashboard-heading">

          <span className="dashboard-label">
            ADMIN CONTROL CENTER
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Welcome back! Here's what's happening
            with your store today.
          </p>

        </div>


        <button
          className="refresh-btn"
          onClick={handleRefresh}
        >
          <span className="refresh-icon">
            ↻
          </span>

          <span>
            Refresh
          </span>
        </button>

      </div>


      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="dashboard-cards">

        {/* ================================
            TOTAL USERS
        ================================= */}

        <div className="dashboard-card users-card">

          <div className="card-top">

            <div className="card-icon">
              👥
            </div>

            <span className="card-growth">
              Active
            </span>

          </div>


          <div className="card-content">

            <p>
              Total Users
            </p>

            <h2>
              {data.totalUsers}
            </h2>

            <span className="card-description">
              Registered users
            </span>

          </div>


          <div className="card-decoration"></div>

        </div>


        {/* ================================
            TOTAL PRODUCTS
        ================================= */}

        <div className="dashboard-card products-card">

          <div className="card-top">

            <div className="card-icon">
              📦
            </div>

            <span className="card-growth">
              Active
            </span>

          </div>


          <div className="card-content">

            <p>
              Total Products
            </p>

            <h2>
              {data.totalProducts}
            </h2>

            <span className="card-description">
              Products available
            </span>

          </div>


          <div className="card-decoration"></div>

        </div>

      </div>


      {/* ======================================
          RECENT ORDERS
      ====================================== */}

      <div className="recent-orders">

        {/* Orders Header */}

        <div className="orders-header">

          <div>

            <span className="section-label">
              ORDER MANAGEMENT
            </span>

            <h2>
              Recent Orders
            </h2>

            <p>
              Latest orders from your users
            </p>

          </div>


          <div className="orders-count">
            {orders.length} Orders
          </div>

        </div>


        {/* ======================================
            ORDERS LOADING
        ====================================== */}

        {ordersLoading ? (

          <div className="orders-loading">

            <div className="small-loader"></div>

            <span>
              Loading orders...
            </span>

          </div>

        ) : orders.length === 0 ? (

          /* ====================================
             NO ORDERS
          ==================================== */

          <div className="no-orders">

            <div className="empty-icon">
              🛒
            </div>

            <h3>
              No Orders Found
            </h3>

            <p>
              There are currently no orders available.
            </p>

          </div>

        ) : (

          /* ====================================
             ORDERS TABLE
          ==================================== */

          <div className="orders-table-wrapper">

            <table className="orders-table">

              <thead>

                <tr>

                  <th>
                    S.No
                  </th>

                  <th>
                    Order ID
                  </th>

                  <th>
                    User
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created At
                  </th>

                </tr>

              </thead>


              <tbody>

                {orders.map((order, index) => (

                  <tr
                    key={
                      order._id || index
                    }
                  >

                    {/* S.NO */}

                    <td>

                      <span className="serial-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                    </td>


                    {/* ORDER ID */}

                    <td>

                      <strong className="order-id">

                        {order.orderId ||
                          order._id ||
                          "N/A"}

                      </strong>

                    </td>


                    {/* USER */}

                    <td>

                      <div className="user-cell">

                        <div className="user-avatar">

                          {(
                            order.userId?.name ||
                            order.user?.name ||
                            order.name ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <span>

                          {order.userId?.name ||
                            order.user?.name ||
                            order.name ||
                            "N/A"}

                        </span>

                      </div>

                    </td>


                    {/* AMOUNT */}

                    <td>

                      <strong className="amount">

                        ₹
                        {order.totalAmount ||
                          order.amount ||
                          0}

                      </strong>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`order-status ${
                          order.status
                            ?.toLowerCase()
                            ?.replace(
                              /\s+/g,
                              "-"
                            ) ||
                          "pending"
                        }`}
                      >

                        <span className="status-dot"></span>

                        {order.status ||
                          "Pending"}

                      </span>

                    </td>


                    {/* CREATED DATE */}

                    <td>

                      <span className="order-date">

                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;