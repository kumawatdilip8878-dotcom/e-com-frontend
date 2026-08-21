import { useEffect, useState } from "react";
import axios from "axios";
import { REACT_APP_API_URL, REACT_APP_IMAGE_URL } from "../../config/ApiConfig";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    totalUsers: 0,
    totalProducts: 0,
  });

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      if (!token) {
        console.log("Token missing");
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
        },
      );

      console.log("Dashboard Response:", res.data);

      if (res.data.success) {
        setData({
          totalUsers: res.data.data?.totalUsers || 0,
          totalProducts: res.data.data?.totalProducts || 0,
        });
      }
    } catch (error) {
      console.log("Dashboard Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

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
        },
      );

      console.log("Orders Response:", res.data);

      if (res.data.success) {
        setOrders(res.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Orders Error:", error.response?.data || error.message);

      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1>Dashboard</h1>

        <div className="dashboard-loading">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h2>{data.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div className="card">
          <h2>{data.totalProducts}</h2>
          <p>Total Products</p>
        </div>
      </div>

      <div className="recent-orders">
        <div className="orders-header">
          <div>
            <h2>Recent Orders</h2>
            <p>Latest orders from users</p>
          </div>
        </div>

        {ordersLoading ? (
          <div className="orders-loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id || index}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{order.orderId || order._id || "N/A"}</strong>
                    </td>

                    <td>
                      {order.userId?.name ||
                        order.user?.name ||
                        order.name ||
                        "N/A"}
                    </td>

                    <td>₹{order.totalAmount || order.amount || 0}</td>

                    <td>
                      <span
                        className={`order-status ${
                          order.status?.toLowerCase()?.replace(/\s+/g, "-") ||
                          "pending"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
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
