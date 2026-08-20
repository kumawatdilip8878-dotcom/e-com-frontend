import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  const getUsers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError(
          "Login token not found. Please login again."
        );
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:3001/admin/users",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Users API Response:",
        res.data
      );

      if (res.data.success) {
        setUsers(res.data.data || []);
      } else {
        setError(
          res.data.message ||
            "Users fetch failed"
        );
      }
    } catch (error) {
      console.log(
        "Users API Error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };


  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/admin/deleteUser",
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      await getUsers();

      window.dispatchEvent(
        new Event("dashboardUpdate")
      );
    } catch (error) {
      console.log(
        "DELETE USER ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };


  const changeUserStatus = async (id) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/admin/changeUserStatus",
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      await getUsers();

      window.dispatchEvent(
        new Event("dashboardUpdate")
      );
    } catch (error) {
      console.log(
        "STATUS ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Status update failed"
      );
    }
  };

  // =====================================================
  // EDIT USER
  // =====================================================

  const editUser = (user) => {
    navigate("/user/form", {
      state: user,
    });
  };

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    getUsers();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="users-container">
        <h1>Users</h1>

        <p>Loading users...</p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="users-container">
        <h1>Users</h1>

        <div className="users-error">
          {error}
        </div>

        <button
          onClick={getUsers}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // USERS PAGE
  // =====================================================

  return (
    <div className="users-container">

      {/* HEADER */}

      <div className="users-header">

        <div>
          <h1>Users</h1>

          <p>
            Manage all registered users
          </p>
        </div>

        <div className="users-header-right">

          <div className="total-users">
            Total Users: {users.length}
          </div>

          <button
            className="create-user-btn"
            onClick={() =>
              navigate("/user/form")
            }
          >
            + Create User
          </button>

        </div>

      </div>

      {/* EMPTY */}

      {users.length === 0 ? (
        <div className="no-users">
          No users found
        </div>
      ) : (
        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {users.map(
                (user, index) => (
                  <tr key={user._id}>

                    {/* S.NO */}

                    <td>
                      {index + 1}
                    </td>

                    {/* NAME */}

                    <td>
                      <strong>
                        {user.name ||
                          "N/A"}
                      </strong>
                    </td>

                    {/* MOBILE */}

                    <td>
                      {user.mobile ||
                        "N/A"}
                    </td>

                    {/* EMAIL */}

                    <td>
                      {user.email ||
                        "N/A"}
                    </td>

                    {/* STATUS */}

                  

                    {/* CREATED */}

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* ACTION */}

                    <td className="user-action-cell">

                      <div className="user-actions">

                        {/* EDIT */}

                        <button
                          type="button"
                          className="user-icon-btn edit"
                          title="Edit User"
                          onClick={() =>
                            editUser(
                              user
                            )
                          }
                        >
                          ✏️
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="user-icon-btn delete"
                          title="Delete User"
                          onClick={() =>
                            deleteUser(
                              user._id
                            )
                          }
                        >
                          🗑️
                        </button>

                        {/* STATUS */}

                        <button
                          type="button"
                          className="user-icon-btn status"
                          title={
                            user.status ===
                            "Y"
                              ? "Deactivate User"
                              : "Activate User"
                          }
                          onClick={() =>
                            changeUserStatus(
                              user._id
                            )
                          }
                        >
                          {user.status ===
                          "Y"
                            ? "🔴"
                            : "🟢"}
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default Users;