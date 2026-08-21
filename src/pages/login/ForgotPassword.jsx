import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {REACT_APP_API_URL,} from "../../config/ApiConfig"

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/auth/forget`,
        {
          mobile,
        }
      );

      if (res.data.success) {
        alert(res.data.message);

        navigate("/otp-verify", {
          state: { mobile },
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleForgot}>
        <h2>Forgot Password</h2>

        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p style={{ marginTop: "15px" }}>
          <Link to="/">Back to Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;