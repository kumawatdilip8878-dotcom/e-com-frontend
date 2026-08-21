import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {REACT_APP_API_URL} from "../../config/ApiConfig"


const UserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const token = localStorage.getItem("token");

  const editData = location.state;

  const isEdit = Boolean(editData?._id);


  const [name, setName] = useState(editData?.name || "");
  const [mobile, setMobile] = useState(editData?.mobile || "");
  const [email, setEmail] = useState(editData?.email || "");
  const [status, setStatus] = useState(editData?.status || "Y");

  // Password only for create
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleMobileChange = (e) => {
    const value = e.target.value;

    // Only numbers
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submitUser = async (e) => {
    e.preventDefault();

    // ===================================================
    // TOKEN CHECK
    // ===================================================

    if (!token) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!name.trim()) {
      alert("Please enter user name.");
      return;
    }

    if (!mobile) {
      alert("Please enter mobile number.");
      return;
    }

    if (mobile.length !== 10) {
      alert("Mobile number must be 10 digits.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!isEdit && !password) {
      alert("Please enter password.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // DATA
      // =================================================

      const data = {
        name: name.trim(),
        mobile: mobile,
        email: email.trim(),
        status: status,
      };

      // Password create ke time bhejna
      if (!isEdit) {
        data.password = password;
      }

      // Edit ke time ID bhejna
      if (isEdit) {
        data.id = editData._id;
      }

      console.log("USER DATA:", data);

      // =================================================
      // API
      // =================================================

      const url = isEdit
        ? `${REACT_APP_API_URL}/admin/updateUser`
        : `${REACT_APP_API_URL}/admin/createUser`;

      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("USER RESPONSE:", res.data);

      // =================================================
      // SUCCESS
      // =================================================

      if (res.data.success) {
        alert(
          res.data.message ||
            (isEdit
              ? "User updated successfully"
              : "User created successfully"),
        );

        window.dispatchEvent(new Event("dashboardUpdate"));

        navigate("/users");
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("USER SAVE ERROR:", error.response?.data || error.message);

      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/users");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="user-form-page">
      <div className="user-form-box">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="user-form-header">
          <div>
            <h2>{isEdit ? "Edit User" : "Create User"}</h2>

            <p>{isEdit ? "Update user information" : "Add a new user"}</p>
          </div>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form className="user-form" onSubmit={submitUser}>
          {/* =================================================
              NAME
          ================================================= */}

          <div className="user-form-group">
            <label>User Name</label>

            <input
              type="text"
              placeholder="Enter user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* =================================================
              MOBILE
          ================================================= */}

          <div className="user-form-group">
            <label>Mobile Number</label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter 10 digit mobile number"
              value={mobile}
              onChange={handleMobileChange}
              maxLength={10}
              required
            />
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="user-form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          {!isEdit && (
            <div className="user-form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="user-form-group">
            <label>Status</label>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Y">Active</option>

              <option value="N">Inactive</option>
            </select>
          </div>

          <div className="user-form-buttons">
            <button
              type="submit"
              className="user-submit-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
            </button>

            <button
              type="button"
              className="user-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
