import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {REACT_APP_API_URL} from "../../config/ApiConfig"

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = location.state?.mobile || "";

  const [otp, setOtp] = useState("");

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
      `${REACT_APP_API_URL}/admin/auth/otpVerfy`,
        {
          mobile,
          otp,
        }
      );

      alert(res.data.message);

      navigate("/reset-password", {
        state: { mobile },
      });
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={verifyOtp}>
        <h2>OTP Verify</h2>

        <input
          type="text"
          value={mobile}
          readOnly
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OtpVerify;