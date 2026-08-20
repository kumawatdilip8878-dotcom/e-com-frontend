
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { REACT_APP_API_URL } from "../config/ApiConfig";

const OrderList = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // GET ALL ORDERS
  // =====================================================

  const getOrders = useCallback(async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/order/getAll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ORDER DATA:", res.data);

      if (res.data.success) {
        setOrders(res.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log(
        "ORDER ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Orders fetch failed"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateStatus = async (orderId, status) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/order/updateStatus`,
        {
          id: orderId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("STATUS RESPONSE:", res.data);

      if (res.data.success) {
        alert(
          res.data.message ||
            "Order status updated successfully"
        );

        getOrders();
      } else {
        alert(
          res.data.message ||
            "Status update failed"
        );
      }
    } catch (error) {
      console.log(
        "STATUS ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Status update failed"
      );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
    } catch (error) {
      return "-";
    }
  };

  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="order-page">

      {/* =================================================
          ORDER HEADER
      ================================================= */}

      <div className="order-header">

        <div>
          <h2>Order Management</h2>

          <p>
            Manage customer orders
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={getOrders}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="order-summary">

        {/* TOTAL ORDERS */}

        <div className="order-card">
          <span>Total Orders</span>

          <strong>
            {totalOrders}
          </strong>
        </div>

        {/* PENDING */}

        <div className="order-card">
          <span>Pending</span>

          <strong>
            {pendingOrders}
          </strong>
        </div>

        {/* DELIVERED */}

        <div className="order-card">
          <span>Delivered</span>

          <strong>
            {deliveredOrders}
          </strong>
        </div>

      </div>

      {/* =================================================
          ORDER TABLE
      ================================================= */}

      <div className="order-table-box">

        {loading ? (

          <div className="loading-box">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (

          <div className="no-orders">
            No Orders Found
          </div>

        ) : (

          <table>

            <thead>
              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Products
                </th>

                <th>
                  Total
                </th>

                <th>
                  Date
                </th>

                <th>
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order._id}>

                  {/* ORDER ID */}

                  <td>
                    <strong>
                      #
                      {order._id
                        ? order._id.slice(-8)
                        : "-"}
                    </strong>
                  </td>

                  {/* CUSTOMER */}

                  <td>

                    <div className="customer-info">

                      <strong>
                        {order.userId?.name ||
                          order.user?.name ||
                          "User"}
                      </strong>

                      <span>
                        {order.userId?.mobile ||
                          order.userId?.email ||
                          order.user?.mobile ||
                          order.user?.email ||
                          "-"}
                      </span>

                    </div>

                  </td>

                  {/* PRODUCTS */}

                  <td>

                    <div className="order-products">

                      {Array.isArray(order.items) &&
                      order.items.length > 0 ? (

                        order.items.map(
                          (item, index) => (

                            <div
                              className="order-product"
                              key={
                                item._id ||
                                index
                              }
                            >

                              <strong>
                                {item.name ||
                                  item.productId?.name ||
                                  item.product?.name ||
                                  "Product"}
                              </strong>

                              <span>
                                ₹{" "}
                                {item.price ||
                                  item.productId?.price ||
                                  0}

                                {" × "}

                                {item.quantity ||
                                  1}
                              </span>

                            </div>

                          )
                        )

                      ) : (

                        <span>
                          No products
                        </span>

                      )}

                    </div>

                  </td>

                  {/* TOTAL */}

                  <td>

                    <strong>
                      ₹{" "}
                      {order.totalAmount ??
                        order.total ??
                        0}
                    </strong>

                  </td>

                  {/* DATE */}

                  <td>
                    {formatDate(
                      order.createdAt ||
                        order.orderDate
                    )}
                  </td>

                  {/* STATUS */}

                  <td>

                    <select
                      value={
                        order.status ||
                        "Pending"
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};

export default OrderList;
