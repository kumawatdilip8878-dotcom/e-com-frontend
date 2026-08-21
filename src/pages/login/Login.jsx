import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  REACT_APP_API_URL,
  REACT_APP_IMAGE_URL,
} from "../../config/ApiConfig";


const Login = () => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      toast.error("Please enter mobile number and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/auth/loginby`,
        {
          mobile,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.data)
        );

        toast.success(
          res.data.message || "Login Successfully"
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        toast.error(
          res.data.message || "Login failed"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= BACKGROUND ================= */}

      <div className="login-grid"></div>

      <div className="gradient-orb orb-one"></div>
      <div className="gradient-orb orb-two"></div>
      <div className="gradient-orb orb-three"></div>

      {/* Background Dashboard Cards */}

      <div className="floating-card floating-one">
        <div className="floating-card-header">
          <span>Revenue</span>
          <span className="mini-dot"></span>
        </div>

        <h3>₹84,250</h3>

        <div className="fake-line">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="floating-card floating-two">

        <div className="floating-card-header">
          <span>Products</span>
          <span>↗</span>
        </div>

        <div className="product-stat">
          <strong>1,284</strong>
          <small>+18.4%</small>
        </div>

        <div className="fake-bars">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>

      </div>

      <div className="floating-card floating-three">

        <div className="floating-card-header">
          <span>Orders</span>
          <span>•••</span>
        </div>

        <div className="order-row">
          <div className="avatar">JD</div>

          <div>
            <strong>New Order</strong>
            <small>Just now</small>
          </div>

          <b>₹2,499</b>
        </div>

        <div className="order-row">
          <div className="avatar purple">AK</div>

          <div>
            <strong>New Order</strong>
            <small>2 min ago</small>
          </div>

          <b>₹1,899</b>
        </div>

      </div>


      {/* ================= MAIN WRAPPER ================= */}

      <div className="login-wrapper">

        {/* ================= LEFT SIDE ================= */}

        <div className="login-brand">

          <div className="brand-content">

            {/* Logo */}

            <div className="brand-logo">

              {REACT_APP_IMAGE_URL ? (
                <img
                  src={`${REACT_APP_IMAGE_URL}/logo.png`}
                  alt="Logo"
                />
              ) : (
                <div className="logo-placeholder">
                  A
                </div>
              )}

            </div>


            <div className="brand-tag">
              ADMIN CONTROL CENTER
            </div>


            <h1>
              Manage your
              <br />

              <span>
                business smarter.
              </span>
            </h1>


            <p className="brand-description">
              Everything you need to manage users,
              products, orders and your entire
              e-commerce platform from one powerful
              dashboard.
            </p>


            {/* Features */}

            <div className="brand-features">

              <div className="feature-item">

                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Easy Management
                  </strong>

                  <p>
                    Manage your platform effortlessly.
                  </p>
                </div>

              </div>


              <div className="feature-item">

                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Secure Access
                  </strong>

                  <p>
                    Your admin account stays protected.
                  </p>
                </div>

              </div>


              <div className="feature-item">

                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Powerful Dashboard
                  </strong>

                  <p>
                    Everything you need in one place.
                  </p>
                </div>

              </div>

            </div>

          </div>


          <div className="brand-footer">
            © 2026 Admin Panel
            <span>•</span>
            All rights reserved.
          </div>

        </div>


        {/* ================= RIGHT LOGIN ================= */}

        <div className="login-form-section">

          <div className="login-card">

            {/* Mobile Logo */}

            <div className="mobile-logo">

              {REACT_APP_IMAGE_URL ? (
                <img
                  src={`${REACT_APP_IMAGE_URL}/logo.png`}
                  alt="Logo"
                />
              ) : (
                <div className="logo-placeholder">
                  A
                </div>
              )}

            </div>


            {/* Heading */}

            <div className="login-heading">

              <span className="welcome-text">
                Welcome back 👋
              </span>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Enter your credentials to
                continue to your dashboard.
              </p>

            </div>


            {/* Form */}

            <form
              onSubmit={handleLogin}
              className="login-form"
            >

              {/* MOBILE */}

              <div className="input-group">

                <label>
                  Mobile Number
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    +
                  </span>

                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value)
                    }
                    maxLength={10}
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <div className="password-label">

                  <label>
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>

                </div>


                <div className="input-wrapper">

                  <span className="input-icon">
                    •
                  </span>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {/* REMEMBER */}

              <div className="remember-row">

                <label>
                  <input type="checkbox" />
                  <span>
                    Remember me
                  </span>
                </label>

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="loader"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In

                    <span className="button-arrow">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>


            {/* Security */}

            <div className="login-security">

              <span className="security-icon">
                ✓
              </span>

              <span>
                Secure admin authentication
              </span>

            </div>


            <div className="login-bottom-text">
              Protected with enterprise-grade security
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;