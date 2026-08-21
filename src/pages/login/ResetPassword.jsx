import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { REACT_APP_API_URL } from "../../config/ApiConfig";


const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // MOBILE
  // ==========================================

  const mobile = location.state?.mobile || "";

  // ==========================================
  // STATE
  // ==========================================

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const resetPassword = async (e) => {
    e.preventDefault();

    // Mobile check

    if (!mobile) {
      alert("Mobile number not found.");

      navigate("/");

      return;
    }

    // Password check

    if (!password) {
      alert("Please enter new password.");

      return;
    }

    // Confirm password check

    if (!confirmPassword) {
      alert("Please confirm your password.");

      return;
    }

    // Match check

    if (password !== confirmPassword) {
      alert("Passwords do not match.");

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/auth/resetPassword`,
        {
          mobile,
          password,
          confirmPassword,
        }
      );

      console.log(
        "RESET PASSWORD RESPONSE:",
        res.data
      );

      if (res.data.success) {
        alert(
          res.data.message ||
            "Password reset successfully"
        );

        navigate("/");
      } else {
        alert(
          res.data.message ||
            "Password reset failed"
        );
      }
    } catch (error) {
      console.log(
        "RESET PASSWORD ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="reset-page">

      <div className="reset-glow reset-glow-left"></div>

      <div className="reset-glow reset-glow-right"></div>

      <form
        className="reset-box"
        onSubmit={resetPassword}
      >

        {/* HEADER */}

        <div className="reset-header">

          <div className="reset-icon">
            🔑
          </div>

          <h2>
            Reset Password
          </h2>

          <p>
            Create a new password for your
            account.
          </p>

        </div>


        {/* MOBILE */}

        <div className="reset-form-group">

          <label>
            Mobile Number
          </label>

          <input
            type="text"
            value={mobile}
            readOnly
          />

        </div>


        {/* NEW PASSWORD */}

        <div className="reset-form-group">

          <label>
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="new-password"
          />

        </div>


        {/* CONFIRM PASSWORD */}

        <div className="reset-form-group">

          <label>
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            autoComplete="new-password"
          />

        </div>


        {/* BUTTON */}

        <button
          type="submit"
          className="reset-submit-btn"
          disabled={loading}
        >

          {loading
            ? "Resetting..."
            : "Reset Password"}

        </button>


        {/* BACK */}

        <button
          type="button"
          className="reset-back-btn"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          ← Back to Login
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;