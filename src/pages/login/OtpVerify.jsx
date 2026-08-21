import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { REACT_APP_API_URL } from "../../config/ApiConfig";


const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // MOBILE
  // ==========================================

  const mobile = location.state?.mobile || "";

  // ==========================================
  // STATE
  // ==========================================

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // OTP CHANGE
  // ==========================================

  const handleOtpChange = (e) => {
    const value = e.target.value;

    // Only numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!mobile) {
      alert("Mobile number not found.");
      navigate("/");
      return;
    }

    if (!otp) {
      alert("Please enter OTP.");
      return;
    }

    if (otp.length !== 6) {
      alert("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${REACT_APP_API_URL}/admin/auth/otpVerfy`, {
        mobile,
        otp,
      });

      console.log("OTP RESPONSE:", res.data);

      if (res.data.success) {
        alert(res.data.message || "OTP verified successfully");

        navigate("/reset-password", {
          state: {
            mobile,
          },
        });
      } else {
        alert(res.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.log("OTP ERROR:", error.response?.data || error.message);

      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="otp-page">
      <div className="otp-glow otp-glow-left"></div>
      <div className="otp-glow otp-glow-right"></div>

      <form className="otp-box" onSubmit={verifyOtp}>
        {/* HEADER */}

        <div className="otp-header">
          <div className="otp-icon">🔐</div>

          <h2>OTP Verify</h2>

          <p>Enter the 6-digit OTP sent to your mobile number.</p>
        </div>

        {/* MOBILE */}

        <div className="otp-form-group">
          <label>Mobile Number</label>

          <input type="text" value={mobile} readOnly />
        </div>

        {/* OTP */}

        <div className="otp-form-group">
          <label>Verification Code</label>

          <input
            className="otp-input"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>

        {/* BUTTON */}

        <button type="submit" className="otp-submit-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* BACK */}

        <button
          type="button"
          className="otp-back-btn"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          ← Back to Login
        </button>
      </form>
    </div>
  );
};

export default OtpVerify;
